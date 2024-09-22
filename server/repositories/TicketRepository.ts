import Ticket, { TicketAttributes } from '../database/models/Ticket'
import BaseRepository from './BaseRepository'

export default class TicketRepository extends BaseRepository<TicketAttributes> {
  protected allowedSortByFields = [
    'method_name',
    'promotion_title',
    'route.line_name',
    'createdAt',
    'updatedAt',
  ]
  protected allowedFilterByFields = [
    'start_station',
    'end_station',
    'promotion_title',
    'route.line_name',
  ]

  constructor() {
    super(Ticket)
  }
}
