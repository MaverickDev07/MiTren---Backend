import Station, { StationAttributes } from '../database/models/Station'
import BaseRepository from './BaseRepository'

export default class StationRepository extends BaseRepository<StationAttributes> {
  protected allowedSortByFields = ['staion_name', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['station_name']

  constructor() {
    super(Station)
  }
}
