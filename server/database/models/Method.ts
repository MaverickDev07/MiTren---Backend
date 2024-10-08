import { Schema, model, Document } from 'mongoose'

export type MethodEntity = {
  id?: string | any
  method_name: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface MethodAttributes extends MethodEntity, Document {}

const MethodSchema = new Schema<MethodAttributes>(
  {
    method_name: {
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

const Method = model<MethodAttributes>('Method', MethodSchema)

export default Method
