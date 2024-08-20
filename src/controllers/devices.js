import DeviceModel from "../models/devices.js";
import { AwsMqtt } from "../../awsMqtt.js";

export const getDevice = (req, res) => {
    DeviceModel.find()
    .then(result => {
        res.status(200).json(result)
    })
}


export const getStatusDevice = (req, res) => {
    DeviceModel.aggregate([
        {$group: {
            _id: '$isOnline',
            count: {$sum: 1}
        }}
    ])
    .then(result => {
        res.status(200).json(result)

    })
}

export const insertDevice = (req, res) => {
    const imei = req.body.imei
    const gsm = req.body.gsm
    const nopol = req.body.nopol
    const merk = req.body.merk
    const isDualcam = req.body.dualcam
    const device = new DeviceModel({
        imei: imei,
        gsm: gsm,
        nopol: nopol,
        merk: merk,
        isDualcam: isDualcam
    })
    device.save()
    .then(() => {
        res.status(200).json('OK')
    })
    .catch(err => {
        res.status(400).send(err)
    })
}

export const updateDevice = (req, res) => {
    const deviceId = req.body._id
    DeviceModel.findByIdAndUpdate(deviceId, {
        imei: req.body.imei,
        gsm: req.body.gsm,
        nopol: req.body.nopol,
        merk: req.body.merk,
        isDualcam: req.body.dualcam
    })
    .then(() => {
        res.status(200).json('OK')
    })
}
export const updateCurrent = async (data) => {
    await DeviceModel.updateOne({imei: data.imei}, {$set: {current: data}})
}
export const statusDevice = async (data) => {
    await DeviceModel.updateOne({imei: data.imei}, {$set: {isOnline: data.status}})
}

function waitMessage (topic) {
        return new Promise((resolve) => {
            AwsMqtt.on('message', (receivedTopic, message) => {
                if(receivedTopic == topic) {
                    const payload = message.toString()
                    const data = JSON.parse(payload)
                    if(data.RSP) {
                        resolve(data)
                    }
                }
            })
        })
}

export const getPicture = async (req, res) => {
    const command = req.body.command
    const imei = req.params.imei
    const topic = `${imei}/commands`
    
    AwsMqtt.publish(topic, JSON.stringify({"CMD": command}))
    const m = await waitMessage(`${imei}/data`)
    res.status(200).json('OK')
}