import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {createServer} from 'http'
import {Server} from 'socket.io'
import {AwsMqtt} from './awsMqtt.js'
import mongoose from 'mongoose'
import compression from 'compression'

const app = express()
app.use(cors())
app.use(express.json())
app.use(compression())
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['*']
    }
})

import { insertReported } from './src/controllers/reported.js'
import { statusDevice, updateCurrent } from './src/controllers/devices.js'

io.on('connection', (socket) => {
    socket.on('progress', (msg) => {
        io.emit('progress', msg)
    })
    socket.on('done', (msg) => {
        io.emit('done', msg)
    })
})

const myTopicData = /data/ig;
const myTopicConnected = /connected/ig;
const myTopicDisconnected = /disconnected/ig;
AwsMqtt.on('message', (topic, message) => {
    const myTopic = topic.split('/')
    let imei;
    const payload = message.toString() 
    if(topic.match(myTopicData)) {
        imei = myTopic[0]
        let data = JSON.parse(payload)
        if(data.state) {
            let reported = data.state.reported
            data = {
                imei: imei,
                totalOdometer: reported[16],
                gsmSignal: reported[21],
                externalVoltage: reported[66],
                batteryVoltage: reported[67],
                batteryCurrent: reported[68],
                gnssStatus: reported[69],
                vehicleSpeed: reported[81],
                engineRPM: reported[85],
                totalMileage: reported[87],
                doorStatus: reported[90],
                engineWorktime: reported[103],
                engineTemperature: reported[115],
                oilLevel: reported[235],
                sleepMode: reported[200],
                ignition: reported[239],
                movement: reported[240],
                ts: reported.ts,
                latlng: reported.latlng,
                ang: reported.ang,
                sp: reported.sp
            }
            io.emit('data', data)
            io.emit(imei, data)
            insertReported(data)
            updateCurrent(data)
        }
    }
    if(topic.match(myTopicConnected)) {
        imei = myTopic[4]
        io.emit('connected', imei)
        statusDevice({
            imei: imei,
            status: true
        })
    }
    if(topic.match(myTopicDisconnected)) {
        imei = myTopic[4]
        io.emit('disconnected', imei)
        statusDevice({
            imei: imei,
            status: false
        })
    }
})

import authenticateToken from './authenticate.js'

import authRouter from './src/routes/auth.js'
import deviceRouter from './src/routes/device.js'
import reportedRouter from './src/routes/reported.js'


app.use('/auth', authRouter);
app.use('/devices', authenticateToken, deviceRouter);
app.use('/reported', authenticateToken, reportedRouter);

const PORT = process.env.PORT || 4000;
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATA_BASE, {
    autoIndex: true
})
.then(() => {
    httpServer.listen(PORT, () => console.log('server listen on port '+PORT))
})

