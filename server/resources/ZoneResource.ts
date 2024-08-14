import BaseResource from './BaseResource'
import { ZoneAttributes } from '../utils/types'

class ZoneResource extends BaseResource<ZoneAttributes, ZoneEntity>() {
  item() {
    const zoneResource: ZoneEntity = {
      id: this.instance.id,
      zone_code: this.instance.zone_code,
      zone_name: this.instance.zone_name,
    }

    return zoneResource
  }
}

export default ZoneResource
