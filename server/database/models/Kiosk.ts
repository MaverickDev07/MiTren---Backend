import { Schema, model, Document } from 'mongoose'

export type KioskEntity = {
  id?: string | any
  kiosk_code: string
  station_id: Schema.Types.ObjectId
}

export interface KioskAttributes extends KioskEntity, Document {}

const KioskSchema = new Schema<KioskAttributes>({
  kiosk_code: {
    type: String,
    required: true,
  },
  station_id: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
})

const Kiosk = model<KioskAttributes>('Kiosk', KioskSchema)

export default Kiosk
