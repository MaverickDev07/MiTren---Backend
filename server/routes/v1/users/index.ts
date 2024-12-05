import express, { Router } from 'express'

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePasswordUser,
  listPagedUsers,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import {
  createUserSchema,
  updatePasswordUserSchema,
  updateUserSchema,
} from '../../../middlewares/requestSchemas'
import { inRoles, verifyToken } from '../../../middlewares/authJwt'

const lines: Router = express.Router()

lines.get('/find/all', [verifyToken, inRoles(['ADMIN'])], listUsers)
lines.get('/', [verifyToken, inRoles(['ADMIN'])], listPagedUsers)
lines.get('/:id', [verifyToken, inRoles(['ADMIN'])], getUser)
lines.post('/', [verifyToken, inRoles(['ADMIN']), validateRequest(createUserSchema)], createUser)
lines.put('/:id', [verifyToken, inRoles(['ADMIN']), validateRequest(updateUserSchema)], updateUser)
lines.put(
  '/:id/password',
  [verifyToken, inRoles(['ADMIN']), validateRequest(updatePasswordUserSchema)],
  updatePasswordUser,
)
lines.delete('/:id', [verifyToken, inRoles(['ADMIN'])], deleteUser)

export default lines
