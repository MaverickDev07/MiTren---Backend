import express, { Router } from 'express'

import {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createPromotionSchema, updatePromotionSchema } from '../../../middlewares/requestSchemas'

const promotions: Router = express.Router()

promotions.get('/', listPromotions)
promotions.get('/:id', getPromotion)
promotions.post('/', validateRequest(createPromotionSchema), createPromotion)
promotions.put('/:id', validateRequest(updatePromotionSchema), updatePromotion)
promotions.delete('/:id', deletePromotion)

export default promotions
