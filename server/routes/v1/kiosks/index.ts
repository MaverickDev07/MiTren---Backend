import express, { Router } from 'express'

import { listKiosks, getKiosk, createKiosk, updateKiosk, deleteKiosk } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createKioskSchema, updateKioskSchema } from '../../../middlewares/requestSchemas'

const kiosks: Router = express.Router()

kiosks.get('/', listKiosks)
kiosks.get('/:id', getKiosk)
kiosks.post('/', validateRequest(createKioskSchema), createKiosk)
kiosks.put('/:id', validateRequest(updateKioskSchema), updateKiosk)
kiosks.delete('/:id', deleteKiosk)

export default kiosks
