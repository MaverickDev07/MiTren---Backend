import Zone from '../database/models/Zone'
import BaseRepository from './BaseRepository'
import { ZoneAttributes } from '../utils/types'

export default class ZoneRepository extends BaseRepository<ZoneAttributes> {
  protected allowedSortByFields = ['zone_code', 'zone_name', 'createdAt', 'updatedAt']

  protected allowedFilterByFields = ['line_name', 'zone_name']

  constructor() {
    super(Zone)
  }
}
