import express, { Router } from 'express'

import {
  listStations,
  getStation,
  createStation,
  updateStation,
  deleteStation,
  listPagedStations,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createStationSchema, updateStationSchema } from '../../../middlewares/requestSchemas'
import { inRoles, verifyToken } from '../../../middlewares/authJwt'

const stations: Router = express.Router()

stations.get('/find/all', [verifyToken, inRoles(['ADMIN'])], listStations)
stations.get('/', [verifyToken, inRoles(['ADMIN'])], listPagedStations)
stations.get('/:id', [verifyToken, inRoles(['ADMIN'])], getStation)
stations.post(
  '/',
  [verifyToken, inRoles(['ADMIN']), validateRequest(createStationSchema)],
  createStation,
)
stations.put(
  '/:id',
  [verifyToken, inRoles(['ADMIN']), validateRequest(updateStationSchema)],
  updateStation,
)
stations.delete('/:id', [verifyToken, inRoles(['ADMIN'])], deleteStation)

export default stations
