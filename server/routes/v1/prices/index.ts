import express, { Router } from 'express'

import { listPrices, getPrice, createPrice, updatePrice, deletePrice } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createPriceSchema, updatePriceSchema } from '../../../middlewares/requestSchemas'

const prices: Router = express.Router()

prices.get('/', listPrices)
prices.get('/:id', getPrice)
prices.post('/', validateRequest(createPriceSchema), createPrice)
prices.put('/:id', validateRequest(updatePriceSchema), updatePrice)
prices.delete('/:id', deletePrice)

export default prices
