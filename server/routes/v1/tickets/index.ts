import express, { Router, NextFunction, Request, Response } from 'express'

import { listTickets, getTicket, createTicket, updateTicket, deleteTicket } from './controller'
import validateRequest from '../../../middlewares/validateRequest'
import { createTicketSchema, updateTicketSchema } from '../../../middlewares/requestSchemas'
import EnvManager from '../../../config/EnvManager'
import ApiError from '../../../errors/ApiError'

const tickets: Router = express.Router()

const computeTotalPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { route } = req.body
    const kioskId = EnvManager.getKioskId()
    if (!kioskId)
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'KioskId not found',
        status: 400,
        code: 'ERR_NF',
      })
    const totalPrice = route.prices.reduce((acc: number, price: any) => {
      return acc + price.qty * price.base_price
    }, 0)
    console.log(totalPrice)

    req.body.kiosk_id = EnvManager.kioskId()
    req.body.total_price = totalPrice

    next()
  } catch (error) {
    next(error)
  }
}

tickets.get('/', listTickets)
tickets.get('/:id', getTicket)
tickets.post('/', [computeTotalPrice, validateRequest(createTicketSchema)], createTicket)
tickets.put('/:id', validateRequest(updateTicketSchema), updateTicket)
tickets.delete('/:id', deleteTicket)

export default tickets
