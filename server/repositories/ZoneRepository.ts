import Zone, { ZoneAttributes } from '../database/models/Zone'
import BaseRepository from './BaseRepository'

export default class ZoneRepository extends BaseRepository<ZoneAttributes> {
  protected allowedSortByFields = ['zone_code', 'zone_name', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['zone_code', 'zone_name']

  constructor() {
    super(Zone)
  }
}
