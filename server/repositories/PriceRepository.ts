import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import Station from '../database/models/Station'
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
    const start_station = await Station.findById(start_station_id)
    const end_station = await Station.findById(end_station_id)
    let is_transfer = false

    for (const start_line of start_station.line_id) {
      for (const end_line of end_station.line_id) {
        if (start_line === end_line) is_transfer = true
      }
    }

    if (!is_transfer)
      return Price.find({
        'start_station.station_id': start_station_id,
        'end_station.station_id': end_station_id,
      })
        .sort({ base_price: -1 })
        .exec()
  }
}
