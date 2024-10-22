import express, { Router } from 'express'

import {
  getKioskIdByEnv,
  getStationByKioskId,
  listLinesByActive,
  listMethodsByActivate,
  listPagedStationsByLine,
  listPricesByStationPair,
} from './controller'

const ticketFlow: Router = express.Router()

ticketFlow.get('/step-1/lines', listLinesByActive)
ticketFlow.get('/step-2/line/:id', listPagedStationsByLine)
ticketFlow.get('/step-2/env-id/station', [getKioskIdByEnv], getStationByKioskId)
ticketFlow.get('/step-3/:start_station_id/:end_station_id', listPricesByStationPair)
ticketFlow.get('/step-4/methods', listMethodsByActivate)

export default ticketFlow
