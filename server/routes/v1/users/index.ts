import express, { Router } from 'express'

import { listUsers, getUser, createUser, updateUser, deleteUser } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createUserSchema, updateUserSchema } from '../../../middlewares/requestSchemas'

const users: Router = express.Router()

users.get('/', listUsers)
users.get('/:id', getUser)
users.post('/', validateRequest(createUserSchema), createUser)
users.put('/:id', validateRequest(updateUserSchema), updateUser)
users.delete('/:id', deleteUser)

export default users
