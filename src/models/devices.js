import mongoose from 'mongoose'
const { Schema } = mongoose;

const DeviceSchema = new Schema({
    imei: {type: String},
    gsm: {type: String},
    nopol: {type: String, default: null},
    merk: {type: String, default: null},
    isOnline: {type: Boolean, default: false},
    current: {
        ignition: {type: Number, default: 0},
        movement: {type: Number, default: 0}
    }
}, {
    timestamps: true
})

const DeviceModel = mongoose.model('Device', DeviceSchema);
export default DeviceModel;
