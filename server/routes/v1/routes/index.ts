import express, { Router } from 'express'

import {
  listRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute,
  listPagedStationsByLine,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createRouteSchema, updateRouteSchema } from '../../../middlewares/requestSchemas'

const routes: Router = express.Router()

routes.get('/', listRoutes)
routes.get('/line/:id', listPagedStationsByLine)
routes.get('/:id', getRoute)
routes.post('/', validateRequest(createRouteSchema), createRoute)
routes.put('/:id', validateRequest(updateRouteSchema), updateRoute)
routes.delete('/:id', deleteRoute)

export default routes
