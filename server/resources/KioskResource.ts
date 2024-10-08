import BaseResource from './BaseResource'
import { KioskAttributes, KioskEntity } from '../database/models/Kiosk'

class KioskResource extends BaseResource<KioskAttributes, KioskEntity>() {
  item() {
    const kioskResource: KioskEntity = {
      id: this.instance.id,
      kiosk_code: this.instance.kiosk_code,
      station_id: this.instance.station_id,
      status: this.instance.status,
      createdAt: this.instance.createdAt,
      updatedAt: this.instance.updatedAt,
    }

    return kioskResource
  }
}

export default KioskResource
