import mongoose from 'mongoose'
const { Schema } = mongoose;

const DeviceSchema = new Schema({
    imei: {type: String},
    gsm: {type: String},
    nopol: {type: String, default: null},
    merk: {type: String, default: null},
    isOnline: {type: Boolean, default: false},
    current: {type: Object, default: {ignition: 0, movement: 0}}
}, {
    timestamps: true
})

const DeviceModel = mongoose.model('Device', DeviceSchema);
export default DeviceModel;
