import { Schema, model, Document } from 'mongoose'

type Location = {
  latitude: number
  longitude: number
}

export type StationEntity = {
  id?: string | any
  station_name: string
  location: Location
  status: string
  line_id: Array<Schema.Types.ObjectId>
  createdAt?: Date
  updatedAt?: Date
}

export interface StationAttributes extends StationEntity, Document {}

const StationSchema = new Schema<StationAttributes>(
  {
    station_name: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    location: {
      type: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      uppercase: true,
      trim: true,
      default: 'ACTIVE',
    },
    line_id: {
      type: [Schema.Types.ObjectId],
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
