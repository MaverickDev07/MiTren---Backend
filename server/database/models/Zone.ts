import { Schema, model } from 'mongoose'
import { ZoneAttributes } from '../../utils/types'

const ZoneSchema = new Schema<ZoneAttributes>({
  zone_code: { type: String, required: true },
  zone_name: { type: String, required: true },
  stations: { type: [String] },

  line_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Line',
      required: true,
    },
  ],
})

const Zone = model<ZoneAttributes>('Zone', ZoneSchema)

export default Zone
