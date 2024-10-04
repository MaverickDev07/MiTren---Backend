import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import Station from '../database/models/Station'
import Route from '../database/models/Route'
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
    const { line_id: start_lines_id } = await Station.findById(start_station_id)
    const { line_id: end_lines_id } = await Station.findById(end_station_id)
    let is_transfer = true

    for (const start_line of start_lines_id) {
      for (const end_line of end_lines_id) {
        if (start_line === end_line) is_transfer = false
      }
    }

    if (!is_transfer)
      return Price.find({
        'start_station.station_id': start_station_id,
        'end_station.station_id': end_station_id,
      })
        .sort({ base_price: -1 })
        .exec()

    // const transfer_station = await Route.find
    //const routes = await Route.find({ line_id: { $in: start_lines_id } })
    //const transfer_station = routes.

    /*for (const route of routes) {
      const transfer_station = await route.stations.find(station => {
        return station.line_id === end_lines_id[0]
      })
      console.log()
    }*/

    return Price.find({
      'start_station.station_id': start_station_id,
      'end_station.station_id': end_station_id,
    })
      .sort({ base_price: -1 })
      .exec()
  }
}
