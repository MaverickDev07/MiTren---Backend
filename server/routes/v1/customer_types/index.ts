import express, { Router } from 'express'

import {
  listCustomerTypes,
  getCustomerType,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType,
} from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import {
  createCustomerTypeSchema,
  updateCustomerTypeSchema,
} from '../../../middlewares/requestSchemas'

const customerTypes: Router = express.Router()

customerTypes.get('/', listCustomerTypes)
customerTypes.get('/:id', getCustomerType)
customerTypes.post('/', validateRequest(createCustomerTypeSchema), createCustomerType)
customerTypes.put('/:id', validateRequest(updateCustomerTypeSchema), updateCustomerType)
customerTypes.delete('/:id', deleteCustomerType)

export default customerTypes
