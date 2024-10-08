import { Schema, model, Document } from 'mongoose'

export type LineEntity = {
  id?: string | any
  line_name: string
  // status: string
}

export interface LineAttributes extends LineEntity, Document {}

const LineSchema = new Schema<LineAttributes>(
  {
    line_name: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    /*status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      uppercase: true,
      trim: true,
      default: 'ACTIVE',
    },*/
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Line = model<LineAttributes>('Line', LineSchema)

export default Line
