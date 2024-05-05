import express from 'express'
import { getReported } from '../controllers/reported.js'

const reportedRouter = express.Router()

reportedRouter.get('/', getReported)

export default reportedRouter