import express from 'express'
import { getReported, downloadReport, getStatistic } from '../controllers/reported.js'

const reportedRouter = express.Router()

reportedRouter.get('/', getReported)
reportedRouter.get('/download', downloadReport)
reportedRouter.get('/statistics', getStatistic)

export default reportedRouter