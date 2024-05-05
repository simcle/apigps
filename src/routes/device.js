import express from 'express'
import { getDevice, insertDevice, updateDevice } from '../controllers/devices.js'
const deviceRouter = express.Router()

deviceRouter.get('/', getDevice)
deviceRouter.post('/', insertDevice)
deviceRouter.put('/', updateDevice)

export default deviceRouter;


