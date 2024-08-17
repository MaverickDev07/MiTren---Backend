import { ZoneAttributes, ZoneEntity } from '../database/models/Zone'
import BaseResource from './BaseResource'

class ZoneResource extends BaseResource<ZoneAttributes, ZoneEntity>() {
  item() {
    const zoneResource: ZoneEntity = {
      id: this.instance.id,
      zone_code: this.instance.zone_code,
      zone_name: this.instance.zone_name,
      lines: this.instance.lines,
    }

    return zoneResource
  }
}

export default ZoneResource
