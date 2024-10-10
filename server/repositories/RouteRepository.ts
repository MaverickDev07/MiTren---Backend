import Route, { RouteAttributes } from '../database/models/Route'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'

export default class RouteRepository extends BaseRepository<RouteAttributes> {
  protected allowedSortByFields = ['status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['line_id', 'stations']

  constructor() {
    super(Route)
  }

  async getPagedStationsByLine(params: PagedStationsParams): Promise<PaginationResult<any> | null> {
    const { id, limit, page } = params
    const route = await Route.findOne({ line_id: id }, { stations: 1 }).exec()
    if (!route) {
      throw new ApiError({
        name: 'MODEL_NOT_FOUND_ERROR',
        message: 'No se encontró la línea',
        status: 400,
        code: 'ERR_MNF',
      })
    }

    // Realizar la paginación manualmente
    const totalDocs = route.stations.length
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const hasPrevPage = page > 1
    const hasNextPage = endIndex < totalDocs
    const prevPage = hasPrevPage ? page - 1 : null
    const nextPage = hasNextPage ? page + 1 : null

    const paginated = route.stations.slice(startIndex, endIndex)

    // Devolver paginación
    const paginacion = {
      docs: paginated,
      totalDocs,
      limit,
      totalPages: Math.ceil(totalDocs / limit),
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    }

    return paginacion
  }

  /*async createByStationRange(body: Record<string, any>) {
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
  }*/
}
