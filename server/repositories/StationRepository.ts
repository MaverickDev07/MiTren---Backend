import Station, { StationAttributes } from '../database/models/Station'
import BaseRepository from './BaseRepository'

export default class StationRepository extends BaseRepository<StationAttributes> {
  protected allowedSortByFields = ['staion_name', 'location', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['station_name', 'status', 'line_id']

  constructor() {
    super(Station)
  }
}
