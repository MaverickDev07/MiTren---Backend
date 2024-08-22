import Route, { RouteAttributes } from '../database/models/Route'
import BaseRepository from './BaseRepository'

export default class RouteRepository extends BaseRepository<RouteAttributes> {
  protected allowedSortByFields = ['route_code', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['route_code']

  constructor() {
    super(Route)
  }

  createByStationRange(body: Record<string, any>) {
    const { stations } = body
    const route_code = stations.map((item: any) => item.station_code).join('-')

    /*stations.map((station_code, station_name) => {
    })*/

    console.log(route_code)
    return body
  }
}
