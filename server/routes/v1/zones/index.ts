import express, { Router } from 'express'

import { listZones, getZone, createZone, updateZone, deleteZone } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createZoneSchema, updateZoneSchema } from '../../../middlewares/requestSchemas'

const zones: Router = express.Router()

zones.get('/', listZones)
zones.get('/:id', getZone)
zones.post('/', validateRequest(createZoneSchema), createZone)
zones.put('/:id', validateRequest(updateZoneSchema), updateZone)
zones.delete('/:id', deleteZone)

export default zones
