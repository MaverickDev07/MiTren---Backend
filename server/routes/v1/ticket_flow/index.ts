import express, { Router } from 'express'

import { listPricesByStationPair } from './controller'

const ticketFlow: Router = express.Router()

ticketFlow.get('/step-3/:start_station_id/:end_station_id', listPricesByStationPair)

export default ticketFlow
