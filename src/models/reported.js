import mongoose from "mongoose";
const { Schema } = mongoose;

// 16 => totalOdometer
// 21 => gsmSignal
// 66 => externalVoltage
// 67 => batteryVoltage
// 68 => batteryCurrent
// 69 => gnssStatus
// 81 => vehicleSpeed
// 82 => acceleratorPedalPosition	
// 85 => engineRPM	
// 87 => totalMileage (meter)
// 90 => doorStatus
// 100 => programNumber
// 103 => engineWorktime (counted)
// 105 => Total Mileage
// 115 => engineTemperature
// 123 => Control State Flags
// 124 => Agricultural Machinery Flags
// 132 => Security State Flags
// 235 => oilLevel
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
    vehicleSpeed: {type: Number},
    engineRPM: {type: Number},
    totalMileage: {type: Number},
    doorStatus: {type: Number},
    engineWorktime: {type: Number},
    engineTemperature: {type: Number},
    oilLevel: {type: Number},
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