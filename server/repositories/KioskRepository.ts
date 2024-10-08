import { Types } from 'mongoose'
import Kiosk, { KioskAttributes } from '../database/models/Kiosk'
import BaseRepository from './BaseRepository'

export default class KioskRepository extends BaseRepository<KioskAttributes> {
  protected allowedSortByFields = ['kiosk_code', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['kiosk_code']

  constructor() {
    super(Kiosk)
  }

  async getStationByKioskId(id: string | Types.ObjectId): Promise<KioskAttributes | null> {
    return this.model.findById(id).populate('station_id').lean().exec()
  }
}
