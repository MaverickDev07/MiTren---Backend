import Route, { RouteAttributes } from '../database/models/Route'
import Station from '../database/models/Station'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'

export default class RouteRepository extends BaseRepository<RouteAttributes> {
  protected allowedSortByFields = ['route_code', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['route_code']

  constructor() {
    super(Route)
  }

  async createByStationRange(body: Record<string, any>) {
    const { start_code, end_code, prices } = body

    const start_line = await Station.findOne({ station_code: start_code })
      .select('line_id')
      .lean()
      .exec()
    const end_line = await Station.findOne({ station_code: end_code })
      .select('line_id')
      .lean()
      .exec()

    if (!start_line) {
      throw new ApiError({
        name: 'MODEL_NOT_FOUND_ERROR',
        message: 'La estación inicial no pertenece a ninguna línea',
        status: 404,
        code: 'ERR_MNF',
      })
    }
    if (!end_line) {
      throw new ApiError({
        name: 'MODEL_NOT_FOUND_ERROR',
        message: 'La estación final no pertenece a ninguna línea',
        status: 404,
        code: 'ERR_MNF',
      })
    }
    if (start_line.line_id.toString() !== end_line.line_id.toString()) {
      throw new ApiError({
        name: 'INVALID_DATA_ERROR',
        message: 'Las estaciones no pertenecen a la misma línea',
        status: 400,
        code: 'ERR_ID',
      })
    }

    const filteredStations = await Station.find({
      line_id: start_line.line_id,
      station_code: { $gte: start_code, $lte: end_code },
    })
      .select({ _id: 0, station_code: 1, station_name: 1 })
      .sort({ station_code: 1 })
      .lean()
      .exec()

    const successRoutes: string[] = []
    const failedRoutes: string[] = []

    for (const [index, start_station] of filteredStations.entries()) {
      for (const end_station of filteredStations.slice(index + 1)) {
        const start_code = start_station.station_name
          .toUpperCase()
          .split(' ')
          .map((item: string) => item[0])
          .join('')
        const end_code = end_station.station_name
          .toUpperCase()
          .split(' ')
          .map((item: string) => item[0])
          .join('')
        const route_code = [start_code, end_code].join('-')

        try {
          await Route.updateOne(
            { route_code },
            { route_code, start_station, end_station, prices },
            { upsert: true },
          )

          successRoutes.push(route_code)
        } catch (error) {
          console.log(error)
          failedRoutes.push(route_code)
        }
      }
    }
    const response = {
      created: successRoutes.length,
      routes: successRoutes,
      failed: failedRoutes,
    }

    return response
  }
}
