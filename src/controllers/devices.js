import DeviceModel from "../models/devices.js";


export const getDevice = (req, res) => {
    DeviceModel.find()
    .then(result => {
        res.status(200).json(result)
    })
}

export const insertDevice = (req, res) => {
    const imei = req.body.imei
    const gsm = req.body.gsm
    const nopol = req.body.nopol
    const merk = req.body.merk
    const device = new DeviceModel({
        imei: imei,
        gsm: gsm,
        nopol: nopol,
        merk: merk
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
        merk: req.body.merk
    })
    .then(() => {
        res.status(200).json('OK')
    })
}
export const updateCurrent = async (data) => {
    await DeviceModel.updateOne({imei: data.imei}, {current: data})
}
export const statusDevice = async (data) => {
    await DeviceModel.updateOne({imei: data.imei}, {$set: {isOnline: data.status}})
}