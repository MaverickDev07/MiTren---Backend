import Kiosk, { KioskAttributes } from '../database/models/Kiosk'
import BaseRepository from './BaseRepository'

export default class KioskRepository extends BaseRepository<KioskAttributes> {
  protected allowedSortByFields = ['kiosk_code', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['kiosk_code']

  constructor() {
    super(Kiosk)
  }
}
