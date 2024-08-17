import { Schema, model, Document } from 'mongoose'

export type ZoneEntity = {
  id?: string | any
  zone_code: string
  zone_name: string
  stations?: Array<string> | []
  lines: Array<Schema.Types.ObjectId> | []
}

export interface ZoneAttributes extends ZoneEntity, Document {}

const ZoneSchema = new Schema<ZoneAttributes>(
  {
    zone_code: { type: String, required: true },
    zone_name: { type: String, required: true },
    stations: { type: [String] },

    lines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Line',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Zone = model<ZoneAttributes>('Zone', ZoneSchema)

export default Zone
