import { Schema, model, Document } from 'mongoose'

export type StationEntity = {
  id?: string | any
  station_code: string
  station_name: string
  line_id: Schema.Types.ObjectId
}

export interface StationAttributes extends StationEntity, Document {}

const StationSchema = new Schema<StationAttributes>(
  {
    station_code: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    station_name: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },

    line_id: {
      type: Schema.Types.ObjectId,
      ref: 'Line',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Station = model<StationAttributes>('Station', StationSchema)

export default Station
