import express, { Router } from 'express'

import {
  listRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute,
  createRouteByStarionRange,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import {
  createRouteSchema,
  createRouteStationRangeSchema,
  updateRouteSchema,
} from '../../../middlewares/requestSchemas'

const routes: Router = express.Router()

routes.get('/', listRoutes)
routes.get('/:id', getRoute)
routes.post('/', validateRequest(createRouteSchema), createRoute)
routes.post(
  '/station/range',
  validateRequest(createRouteStationRangeSchema),
  createRouteByStarionRange,
)
routes.put('/:id', validateRequest(updateRouteSchema), updateRoute)
routes.delete('/:id', deleteRoute)

export default routes
