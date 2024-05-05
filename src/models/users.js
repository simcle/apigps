import mongoose from 'mongoose'
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String}
}, {
    timestamps: true
})
userSchema.index({email: 1}, {unique: true})
const UserModel = mongoose.model('User', userSchema);
export default UserModel; 