import Route, { RouteAttributes } from '../database/models/Route'
import Station from '../database/models/Station'
import BaseRepository from './BaseRepository'

export default class RouteRepository extends BaseRepository<RouteAttributes> {
  protected allowedSortByFields = ['route_code', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['route_code']

  constructor() {
    super(Route)
  }

  async createByStationRange(body: Record<string, any>) {
    const { stations, prices } = body
    const [startStation, endStation] = stations

    // Obtener la línea a la que pertenecen las estaciones
    const line = await Station.findOne({ station_code: startStation.station_code })
      .select('line_id')
      .lean()
      .exec()

    if (!line) {
      throw new Error('La estación de inicio no pertenece a ninguna línea')
    }

    // Obtener todas las estaciones de la línea ordenadas por station_code de forma ascendente
    const filteredStations = await Station.find({
      line_id: line.line_id,
      station_code: { $in: [startStation.station_code, endStation.station_code] },
    })
      .sort({ station_code: 1 })
      .lean()
      .exec()

    console.log(filteredStations)

    // Generar el route_code
    const route_code = filteredStations.map(station => station.station_code).join('-')

    // Crear la ruta en la base de datos
    /*const newRoute = await this.create({
      route_code,
      stations: filteredStations,
      prices,
    })*/

    return { route_code, stations: filteredStations, prices }
  }
}
