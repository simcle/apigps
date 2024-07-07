import express from 'express'
import { getReported, downloadReport } from '../controllers/reported.js'

const reportedRouter = express.Router()

reportedRouter.get('/', getReported)
reportedRouter.get('/download', downloadReport)

export default reportedRouter