import express, { Router } from 'express'

import { listTickets, getTicket, createTicket, updateTicket, deleteTicket } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createTicketSchema, updateTicketSchema } from '../../../middlewares/requestSchemas'

const tickets: Router = express.Router()

tickets.get('/', listTickets)
tickets.get('/:id', getTicket)
tickets.post('/', validateRequest(createTicketSchema), createTicket)
tickets.put('/:id', validateRequest(updateTicketSchema), updateTicket)
tickets.delete('/:id', deleteTicket)

export default tickets
