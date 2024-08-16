import { Document, Types } from 'mongoose'

export interface LineAttributes extends Document {
  id: string
  line_name: string
  created_at: Date
  updated_at: Date
}

export interface ZoneAttributes extends Document {
  zone_code: string
  zone_name: string
  stations: Array<string> | []
  line_id: Array<Types.ObjectId> | []
}
