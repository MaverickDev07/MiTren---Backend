import express, { Router } from 'express'

import { listLines, getLine, createLine, updateLine, deleteLine } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createLineSchema, updateLineSchema } from '../../../middlewares/requestSchemas'

const lines: Router = express.Router()

lines.get('/', listLines)
lines.get('/:id', getLine)
lines.post('/', validateRequest(createLineSchema), createLine)
lines.put('/:id', validateRequest(updateLineSchema), updateLine)
lines.delete('/:id', deleteLine)

export default lines
