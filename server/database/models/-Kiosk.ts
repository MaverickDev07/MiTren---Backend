import { Document, model, Schema, Types } from 'mongoose'

/**
 * Type to model the Kiosk Schema for TypeScript.
 * @param kiosk_code:string
 * @param station_id:ref => Station._id
 */
interface IKiosk extends Document {
  kiosk_code: string
  station_id: Types.ObjectId
}

const KioskSchema = new Schema<IKiosk>({
  kiosk_code: { type: String, required: true },
  station_id: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
})

const Kiosk = model<IKiosk>('Kiosk', KioskSchema)
export default Kiosk
