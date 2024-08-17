import Line, { LineAttributes } from '../database/models/Line'
import BaseRepository from './BaseRepository'

export default class LineRepository extends BaseRepository<LineAttributes> {
  protected allowedSortByFields = ['line_name']
  protected allowedFilterByFields = ['line_name']

  constructor() {
    super(Line)
  }
}
