import express, { Router } from 'express'

import {
  listPrices,
  getPrice,
  getPricesByLine,
  createPrice,
  updatePrice,
  deletePrice,
  createOrUpdatePriceByRange,
  createOrUpdatePrices,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createPriceSchema, updatePriceSchema } from '../../../middlewares/requestSchemas'

const prices: Router = express.Router()

prices.get('/', listPrices)
prices.get('/:id', getPrice)
prices.get('/line_id/:id', getPricesByLine)
prices.post('/', validateRequest(createPriceSchema), createPrice)
prices.post('/upserts', createOrUpdatePrices)
prices.put('/:id', validateRequest(updatePriceSchema), updatePrice)
prices.post('/range/:start_station_id/:end_station_id', createOrUpdatePriceByRange)
prices.delete('/:id', deletePrice)

export default prices
