import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import Station from '../database/models/Station'
import BaseRepository from './BaseRepository'
import Line from '../database/models/Line'
import Route from '../database/models/Route'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }

  async getPricesByStationPair(
    start_station_id: string | Types.ObjectId,
    end_station_id: string | Types.ObjectId,
  ): Promise<any> {
    const { station_name: start_station, line_id: start_lines_id } =
      await Station.findById(start_station_id)
    const { station_name: end_station, line_id: end_lines_id } =
      await Station.findById(end_station_id)
    let is_transfer = true
    let line_id = null
    let start_line = null
    let end_line = null

    for (const start_line of start_lines_id) {
      for (const end_line of end_lines_id) {
        if (start_line.toString() === end_line.toString()) {
          is_transfer = false
          line_id = start_line
        }
      }
    }

    if (!is_transfer) {
      const prices = await Price.find({
        'start_station.station_id': start_station_id,
        'end_station.station_id': end_station_id,
      })
        .select({ base_price: 1, customer_type: 1 })
        .sort({ base_price: -1 })
        .exec()
      const { line_name } = await Line.findById(line_id)
      start_line = end_line = line_name

      return {
        prices,
        start_point: { start_station, start_line },
        end_point: { end_station, end_line },
        transfer_point: {
          is_transfer,
          transfer_station: '',
        },
      }
    } else {
      // Encontrar la ruta de la estación Inicial
      // const start_route = await Route.find({ line_id: { $in: start_lines_id } })
      const prices = await Price.find({
        'start_station.station_id': start_station_id,
        'end_station.station_id': end_station_id,
      })
        .select({ base_price: 1, customer_type: 1 })
        .sort({ base_price: -1 })
        .exec()
      start_line = await Line.findById(start_lines_id[0])
      end_line = await Line.findById(end_lines_id[0])
      start_line = start_line.line_name
      end_line = end_line.line_name

      return {
        prices,
        start_point: { start_station, start_line },
        end_point: { end_station, end_line },
        transfer_point: {
          is_transfer,
          transfer_station: '',
        },
      }
    }

    // const transfer_station = await Route.find
    // const routes = await Route.find({ line_id: { $in: start_lines_id } })
    // const transfer_station = routes.

    /*for (const route of routes) {
      const transfer_station = await route.stations.find(station => {
        return station.line_id === end_lines_id[0]
      })
      console.log()
    }

    return Price.find({
      'start_station.station_id': start_station_id,
      'end_station.station_id': end_station_id,
    })
      .sort({ base_price: -1 })
      .exec()*/
  }
}
