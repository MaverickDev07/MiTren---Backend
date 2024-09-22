import express, { Router, NextFunction, Request, Response } from 'express'

import {
  listKiosks,
  getKiosk,
  createKiosk,
  updateKiosk,
  deleteKiosk,
  getStationByKioskId,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createKioskSchema, updateKioskSchema } from '../../../middlewares/requestSchemas'
import EnvManager from '../../../config/EnvManager'
import ApiError from '../../../errors/ApiError'

const kiosks: Router = express.Router()

const getKioskIdByEnv = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kioskId = EnvManager.getKioskId()
    if (!kioskId)
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'KioskId not found',
        status: 400,
        code: 'ERR_NF',
      })
    req.params.id = EnvManager.kioskId()

    next()
  } catch (error: any) {
    next(error)
  }
}

kiosks.get('/', listKiosks)
kiosks.get('/:id', getKiosk)
kiosks.get('/env-id/station', [getKioskIdByEnv], getStationByKioskId)
kiosks.post('/', validateRequest(createKioskSchema), createKiosk)
kiosks.put('/:id', validateRequest(updateKioskSchema), updateKiosk)
kiosks.delete('/:id', deleteKiosk)

export default kiosks
