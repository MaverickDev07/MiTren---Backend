import { RouteAttributes, RouteEntity } from '../database/models/Route'
import BaseResource from './BaseResource'

class RouteResource extends BaseResource<RouteAttributes, RouteEntity>() {
  item() {
    const routeResource: RouteEntity = {
      id: this.instance.id,
      route_code: this.instance.route_code,
      start_station: this.instance.start_station,
      end_station: this.instance.end_station,
      prices: this.instance.prices,
    }

    return routeResource
  }
}

export default RouteResource
