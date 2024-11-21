import express, { Router } from 'express'

import { listUsers, getUser, createUser, updateUser, deleteUser } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createUserSchema, updateUserSchema } from '../../../middlewares/requestSchemas'

const lines: Router = express.Router()

lines.get('/', listUsers)
lines.get('/:id', getUser)
lines.post('/', validateRequest(createUserSchema), createUser)
lines.put('/:id', validateRequest(updateUserSchema), updateUser)
lines.delete('/:id', deleteUser)

export default lines
