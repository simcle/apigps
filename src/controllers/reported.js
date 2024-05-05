import ReportedModel from "../models/reported.js";

export const insertReported = (data) => {
    
    const reported = new ReportedModel({
        imei: data.imei,
        totalOdometer: data.totalOdometer,
        gsmSignal: data.gsmSignal,
        externalVoltage: data.externalVoltage,
        batteryVoltage: data.batteryVoltage,
        batteryCurrent: data.batteryCurrent,
        gnssStatus: data.gnssStatus,
        sleepMode: data.sleepMode,
        ignition: data.ignition,
        movement: data.movement,
        ts: data.ts,
        latlng: data.latlng,
        ang: data.ang,
        sp: data.sp
    })
    reported.save()
}

export const getReported = (req, res) => {
    const imei = req.query.imei
    const start = new Date(req.query.start).getTime()
    const end = new Date(req.query.end).getTime()

    ReportedModel.aggregate([
        {$match: {$and: [{imei: imei}, {ts: {$gte: start, $lt: end}}]}},
        {$sort: {ts: 1}}
    ])
    .then(result => {
        res.status(200).json(result)
    })
    
}