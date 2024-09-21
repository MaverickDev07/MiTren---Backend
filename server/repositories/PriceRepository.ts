import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import BaseRepository from './BaseRepository'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }

  async getPricesByStationPair(
    start_station_id: string | Types.ObjectId,
    end_station_id: string | Types.ObjectId,
  ): Promise<Array<PriceAttributes>> {
    return Price.find({
      'start_station.station_id': start_station_id,
      'end_station.station_id': end_station_id,
    })
      .sort({ base_price: -1 })
      .exec()
  }
}
