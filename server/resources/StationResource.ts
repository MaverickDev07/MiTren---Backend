import BaseResource from './BaseResource'
import { StationAttributes, StationEntity } from '../database/models/Station'

class StationResource extends BaseResource<StationAttributes, StationEntity>() {
  item() {
    const stationResource: StationEntity = {
      id: this.instance.id,
      station_name: this.instance.station_name,
      zone_id: this.instance.zone_id,
    }

    return stationResource
  }
}

export default StationResource