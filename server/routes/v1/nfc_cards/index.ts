import express, { Router } from 'express'

import {
  listNfcCards,
  getNfcCard,
  createNfcCard,
  updateNfcCard,
  deleteNfcCard,
  addCreatedByUser,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createNfcCardSchema, updateNfcCardSchema } from '../../../middlewares/requestSchemas'
import { verifyToken } from '../../../middlewares/authJwt'

const nfcCards: Router = express.Router()

nfcCards.get('/', listNfcCards)
nfcCards.get('/:id', getNfcCard)
nfcCards.post(
  '/',
  [verifyToken, addCreatedByUser, validateRequest(createNfcCardSchema)],
  createNfcCard,
)
nfcCards.put('/:id', validateRequest(updateNfcCardSchema), updateNfcCard)
nfcCards.delete('/:id', deleteNfcCard)

export default nfcCards
