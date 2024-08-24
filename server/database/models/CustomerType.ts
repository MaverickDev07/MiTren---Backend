import { Schema, model, Document } from 'mongoose'

export type CustomerTypeEntity = {
  id?: string | any
  customer_type: string
}

export interface CustomerTypeAttributes extends CustomerTypeEntity, Document {}

const CustomerTypeSchema = new Schema<CustomerTypeAttributes>(
  {
    customer_type: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const CustomerType = model<CustomerTypeAttributes>('CustomerType', CustomerTypeSchema)

export default CustomerType
