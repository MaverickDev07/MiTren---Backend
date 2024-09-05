import Ticket, { TicketAttributes } from '../database/models/Ticket'
import BaseRepository from './BaseRepository'

export default class TicketRepository extends BaseRepository<TicketAttributes> {
  protected allowedSortByFields = [
    'date_time',
    'start_station',
    'end_station',
    'method_name',
    'transfer',
    'promotion_title',
  ]
  protected allowedFilterByFields = [
    'start_station',
    'end_station',
    'method_name',
    'transfer',
    'promotion_title',
  ]

  constructor() {
    super(Ticket)
  }
}
