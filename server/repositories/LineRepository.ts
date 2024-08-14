import Line from '../database/models/Line'
import BaseRepository from './BaseRepository'
import { LineAttributes } from '../utils/types'

export default class LineRepository extends BaseRepository<LineAttributes> {
  protected allowedSortByFields = ['line_name']

  protected allowedFilterByFields = ['line_name']

  constructor() {
    super(Line)
  }
}
