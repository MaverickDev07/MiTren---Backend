import express, { Router } from 'express'

import { listNfcCards, getNfcCard, createNfcCard, updateNfcCard, deleteNfcCard } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createNfcCardSchema, updateNfcCardSchema } from '../../../middlewares/requestSchemas'

const nfcCards: Router = express.Router()

nfcCards.get('/', listNfcCards)
nfcCards.get('/:id', getNfcCard)
nfcCards.post('/', validateRequest(createNfcCardSchema), createNfcCard)
nfcCards.put('/:id', validateRequest(updateNfcCardSchema), updateNfcCard)
nfcCards.delete('/:id', deleteNfcCard)

export default nfcCards
