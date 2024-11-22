import express, { Router } from 'express'

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePasswordUser,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import {
  createUserSchema,
  updatePasswordUserSchema,
  updateUserSchema,
} from '../../../middlewares/requestSchemas'

const lines: Router = express.Router()

lines.get('/', listUsers)
lines.get('/:id', getUser)
lines.post('/', validateRequest(createUserSchema), createUser)
lines.put('/:id', validateRequest(updateUserSchema), updateUser)
lines.put('/:id/password', validateRequest(updatePasswordUserSchema), updatePasswordUser)
lines.delete('/:id', deleteUser)

export default lines
