import { Schema, model, Document } from 'mongoose'

export type StationEntity = {
  id?: string | any
  station_name: string
  zone_id: Schema.Types.ObjectId
}

export interface StationAttributes extends StationEntity, Document {}

const StationSchema = new Schema<StationAttributes>(
  {
    station_name: { type: String, required: true },

    zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Station = model<StationAttributes>('Station', StationSchema)

export default Station
