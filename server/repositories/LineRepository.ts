import { Document } from 'mongoose'
import Line from '../database/models/Line'
import BaseRepository from './BaseRepository'

interface LineAttributes extends Document {
  line_name: string
  created_at: Date
  updated_at: Date
}

export default class LineRepository extends BaseRepository<LineAttributes> {
  protected allowedSortByFields = ['line_name']

  protected allowedFilterByFields = ['line_name']

  constructor() {
    super(Line)
  }
}
