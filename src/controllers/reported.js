import DeviceModel from '../models/devices.js'
import ReportedModel from "../models/reported.js";
import excel from 'exceljs'
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
        vehicleSpeed: data.vehicleSpeed,
        engineRPM: data.engineRPM,
        totalMileage: data.totalMileage,
        doorStatus: data.doorStatus,
        engineWorktime: data.engineWorktime,
        engineTemperature: data.engineTemperature,
        oilLevel: data.oilLevel,
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

export const downloadReport = (req, res) => {
    const imei = req.query.imei
    const start = new Date(req.query.start).getTime()
    const end = new Date(req.query.end).getTime()
    const device = DeviceModel.find({imei: imei})
    const report = ReportedModel.aggregate([
        {$match: {$and: [{imei: imei}, {ts: {$gte: start, $lt: end}}]}},
        {$sort: {ts: 1}},
        {$project: {
            ts: {$dateToString: {format: "%d/%m/%Y %H:%M:%S", date: {$toDate: '$ts'}, timezone: 'Asia/Jakarta'}},
            imei: 1, 
            totalOdometer: 1,
            gsmSignal: 1,
            externalVoltage: {$multiply: ['$externalVoltage', 0.001]},
            batteryVoltage: 1, 
            gnssStatus: 1,
            sleepMode: 1,
            vehicleSpeed: 1,
            engineRPM: 1,
            totalMileage: {$divide: ['$totalMileage', 1000]}, 
            doorStatus: 1,
            engineWorktime: 1,
            engineTemperature: {$multiply: ['$engineTemperature', 0.1]},
            oilLevel: {$cond: [{$eq: ['$oilLevel', 1]}, 'PERIKSA', 'OK']},
            ignition: {$cond: [{$eq: ['$ignition', 1]}, 'On', 'Off']},
            latlng: 1,
        }}
    ])
    Promise.all([
        device,
        report
    ])
    .then( async (result) => {
        const device = result[0][0]
        let workbook = new excel.Workbook()
        let worksheet = workbook.addWorksheet('Laporan')
        worksheet.columns = [
            {key: 'ts', width: '20'},
            {key: 'ignition', width: '10'},
            {key: 'engineRPM', width: '10'},
            {key: 'vehicleSpeed', width: '10'},
            {key: 'engineTemperature', width: '10'},
            {key: 'totalMileage', width: '10'},
            {key: 'oilLevel', width: '10'},
            {key: 'latlng', width: '25'},
            {key: 'externalVoltage', width: '25'},
        ]
        worksheet.getRow(1).values = ['Imei', `: ${device.imei}`]
        worksheet.getRow(2).values = ['GSM', `: ${device.gsm}`]
        worksheet.getRow(3).values = ['NoPol', `: ${device.nopol}`]
        worksheet.getRow(4).values = ['Buatan', `: ${device.merk}`]
        worksheet.getRow(7).values = ['Tanggal', 'Mesin', 'RPM', 'Kecepatan', 'Suhu mesin', 'Odometer', 'Oli level', 'Koordinat (LatLng)', 'Aki kendaraan (volt)']
        worksheet.addRows(result[1])
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "laporan.xlsx"
        );
        await workbook.xlsx.write(res);
        res.status(200).end();
    })

}

export const getStatistic = (req, res) => {
    const imei = req.query.imei
    const test = new Date(req.query.end)
    const start = new Date(req.query.start).getTime()
    const end = new Date(req.query.end).getTime()
    ReportedModel.aggregate([
        {$match: {$and: [{imei: imei} , {totalMileage: {$gte: 0}}, {ts: {$gte: start, $lt: end}}]}},
        {$sort: {ts: 1}},
        {$project: {
            ts: {$dateToString: {format: "%d/%m/%Y", date: {$toDate: '$ts'}, timezone: 'Asia/Jakarta'}},
            totalMileage: {$divide: ['$totalMileage', 1000]},
            vehicleSpeed: 1,
        }},
        {$sort: {ts: 1}},
        {$group: {
            _id: '$ts',
            start: {$first: '$totalMileage'},
            end: {$last: '$totalMileage'},
            averageSpeed: {$avg: '$vehicleSpeed'}
        }},
        {$sort: {ts: 1}},
        {$project: {
            start: 1,
            end: 1,
            mileage: {$subtract: ['$end', '$start']},
            averageSpeed: 1
        }},
        {$sort: {_id: 1}}
    ])  
    .then(result => {
        res.status(200).json(result)
    }) 
}