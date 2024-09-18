import { RouteAttributes, RouteEntity } from '../database/models/Route'
import BaseResource from './BaseResource'

class RouteResource extends BaseResource<RouteAttributes, RouteEntity>() {
  item() {
    const routeResource: RouteEntity = {
      id: this.instance.id,
      line_id: this.instance.line_id,
      stations: this.instance.stations,
    }

    return routeResource
  }
}

export default RouteResource
