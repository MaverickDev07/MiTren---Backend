import { Document, model, Schema, Types } from 'mongoose'

/**
 * Type to model the Station Schema for TypeScript.
 * @param station_name:string
 * @param zone_id:ref => Zone._id
 */
interface IStation extends Document {
  station_name: string
  zone_id: Types.ObjectId
}

const StationSchema = new Schema<IStation>({
  station_name: { type: String, required: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', required: true },
})

const Station = model<IStation>('Station', StationSchema)
export default Station
'Estación 1', 'Estación 2'
