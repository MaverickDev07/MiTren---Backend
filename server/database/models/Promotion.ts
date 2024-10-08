import { Schema, model, Document } from 'mongoose'

export type PromotionEntity = {
  id?: string | any
  title: string
  description: string
  discount: number
  start_date: Date
  end_date: Date
  active: boolean
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface PromotionAttributes extends PromotionEntity, Document {}

const PromotionSchema = new Schema<PromotionAttributes>(
  {
    title: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      uppercase: true,
      trim: true,
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Promotion = model<PromotionAttributes>('Promotion', PromotionSchema)

export default Promotion
