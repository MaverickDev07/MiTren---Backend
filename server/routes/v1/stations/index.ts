import express, { Router } from 'express'

import { listStations, getStation, createStation, updateStation, deleteStation } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createStationSchema, updateStationSchema } from '../../../middlewares/requestSchemas'

const stations: Router = express.Router()

stations.get('/', listStations)
stations.get('/:id', getStation)
stations.post('/', validateRequest(createStationSchema), createStation)
stations.put('/:id', validateRequest(updateStationSchema), updateStation)
stations.delete('/:id', deleteStation)

export default stations
