import mongoose from "mongoose";
const { Schema } = mongoose;

// 16 => totalOdometer
// 21 => gsmSignal
// 66 => externalVoltage
// 67 => batteryVoltage
// 68 => batteryCurrent
// 69 => gnssStatus
// 181 => gnssPdop
// 182 => gnssHdop
// 200 => sleepMode
// 239 => ignition
// 240 => movement
// 241 => activeGsmOperator
// ts => timestamp 
// latlng: latitude longitude
// ang => angle
// sp => speed

const ReportedSchema = new Schema({
    imei: {type: String},
    totalOdometer: {type: Number},
    gsmSignal: {type: Number},
    externalVoltage: {type: Number},
    batteryVoltage: {type: Number},
    batteryCurrent: {type: Number},
    gnssStatus: {type: Number},
    sleepMode: {type: Number},
    ignition: {type: Number},
    movement: {type: Number},
    ts: {type: Number},
    latlng: {type: String},
    ang: {type: Number},
    sp: {type: Number},
}, {
    timestamps: true
})

const ReportedModel = mongoose.model('Reported', ReportedSchema)

export default ReportedModel