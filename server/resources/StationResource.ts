import BaseResource from './BaseResource'
import { StationAttributes, StationEntity } from '../database/models/Station'

class StationResource extends BaseResource<StationAttributes, StationEntity>() {
  item() {
    const stationResource: StationEntity = {
      id: this.instance.id,
      station_code: this.instance.station_code,
      station_name: this.instance.station_name,
      line_id: this.instance.line_id,
    }

    return stationResource
  }
}

export default StationResource
