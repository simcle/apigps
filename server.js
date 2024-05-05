import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {createServer} from 'http'
import {Server} from 'socket.io'
import {AwsMqtt} from './awsMqtt.js'
import mongoose from 'mongoose'

const app = express()
app.use(cors())
app.use(express.json())
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['*']
    }
})

import { insertReported } from './src/controllers/reported.js'
import { statusDevice, updateCurrent } from './src/controllers/devices.js'

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
        data = {
            imei: imei,
            totalOdometer: data.state.reported[16],
            gsmSignal: data.state.reported[21],
            externalVoltage: data.state.reported[66],
            batteryVoltage: data.state.reported[67],
            batteryCurrent: data.state.reported[68],
            gnssStatus: data.state.reported[69],
            sleepMode: data.state.reported[200],
            ignition: data.state.reported[239],
            movement: data.state.reported[240],
            ts: data.state.reported.ts,
            latlng: data.state.reported.latlng,
            ang: data.state.reported.ang,
            sp: data.state.reported.sp
        }
        io.emit('data', data)
        io.emit(imei, data)
        insertReported(data)
        updateCurrent(data)
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

const PORT = process.env.PORT || 3000;
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATA_BASE, {
    autoIndex: true
})
.then(() => {
    httpServer.listen(PORT, () => console.log('server listen on port '+PORT))
})

