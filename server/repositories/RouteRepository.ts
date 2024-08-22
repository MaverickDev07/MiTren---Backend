import Route, { RouteAttributes } from '../database/models/Route'
import BaseRepository from './BaseRepository'

export default class RouteRepository extends BaseRepository<RouteAttributes> {
  protected allowedSortByFields = ['route_code', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['route_code']

  constructor() {
    super(Route)
  }
}
