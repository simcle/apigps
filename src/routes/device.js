import express from 'express'
import { getDevice, getPicture, getStatusDevice, insertDevice, updateDevice } from '../controllers/devices.js'
const deviceRouter = express.Router()

deviceRouter.get('/', getDevice)
deviceRouter.get('/status', getStatusDevice)
deviceRouter.post('/', insertDevice)
deviceRouter.put('/', updateDevice)
deviceRouter.post('/get-picture/:imei', getPicture)

export default deviceRouter;


