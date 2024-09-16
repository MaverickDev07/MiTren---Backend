import Price, { PriceAttributes } from '../database/models/Price'
import BaseRepository from './BaseRepository'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }
}
