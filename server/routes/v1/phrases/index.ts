import express, { Router } from 'express'

import {
  listPhrases,
  getPhrase,
  createPhrase,
  updatePhrase,
  deletePhrase,
  listPagedPhrases,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createPhraseSchema, updatePhraseSchema } from '../../../middlewares/requestSchemas'

const phrases: Router = express.Router()

phrases.get('/find/all', listPhrases)
phrases.get('/', listPagedPhrases)
phrases.get('/:id', getPhrase)
phrases.post('/', validateRequest(createPhraseSchema), createPhrase)
phrases.put('/:id', validateRequest(updatePhraseSchema), updatePhrase)
phrases.delete('/:id', deletePhrase)

export default phrases
