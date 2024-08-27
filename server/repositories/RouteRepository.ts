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
      .sort({ station_code: 1 })
      .lean()
      .exec()

    const route_code = 'route_code'
    /*const start_code = start_station.station_name
      .toUpperCase()
      .split(' ')
      .map((item: string) => item[0])
      .join('')
    const end_code = end_station.station_name
      .toUpperCase()
      .split(' ')
      .map((item: string) => item[0])
      .join('')

    // Generar el route_code
    const route_code = [start_code, end_code].join('-')*/

    // Crear la ruta en la base de datos

    return { route_code, stations: filteredStations, prices }
  }
}
