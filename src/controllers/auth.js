import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from '../models/users.js'

export const getMe = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id)
    UserModel.aggregate([
        {$match: {_id: userId}},
        {$project: {
            _id: 1,
            name: 1, 
            email: 1
        }}
    ])
    .then(result => {
        res.status(200).json(result[0])
    })
}

export const userRegister = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.send(errors.array())
    }
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const hasPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
        name: name,
        email: email,
        password: hasPassword
    })
    user.save()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(400).send(err)
    })
}

export const userLogin = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.send(errors.array())
    }

    const email = req.body.email
    const password = req.body.password
    UserModel.findOne({email: email})
    .then(async (result) => {
        try {
            if(!result) {
                return res.status(400).send("Akun tidak ditemukan")
            }
            if(bcrypt.compare(password, result.password)) {
                const user = {_id: result._id}
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                const data = {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                }
                res.status(200).json({accessToken: accessToken, user: data});
            } else {
                res.status(400).send('password salah');
            }
        } catch (error) {
            res.status(400).send(error)
        }
    })
}