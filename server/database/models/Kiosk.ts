import { Schema, model, Document } from 'mongoose'
import { StationEntity } from './Station'

export type KioskEntity = {
  id?: string | any
  kiosk_code: string
  status?: string
  station_id?: Schema.Types.ObjectId
  station?: StationEntity
  createdAt?: Date
  updatedAt?: Date
}

export interface KioskAttributes extends KioskEntity, Document {}

const KioskSchema = new Schema<KioskAttributes>({
  kiosk_code: {
    type: String,
    uppercase: true,
    trim: true,
    unique: true,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
    uppercase: true,
    trim: true,
    default: 'ACTIVE',
  },
  station_id: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
})

const Kiosk = model<KioskAttributes>('Kiosk', KioskSchema)

export default Kiosk
