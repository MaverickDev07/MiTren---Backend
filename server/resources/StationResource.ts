import BaseResource from './BaseResource'
import { StationAttributes, StationEntity } from '../database/models/Station'

class StationResource extends BaseResource<StationAttributes, StationEntity>() {
  item() {
    const stationResource: StationEntity = {
      id: this.instance.id,
      station_name: this.instance.station_name,
      location: this.instance.location,
      status: this.instance.status,
      line_id: this.instance.line_id,
    }

    return stationResource
  }
}

export default StationResource
