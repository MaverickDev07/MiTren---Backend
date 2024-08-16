import { Document, model, Schema, Types } from 'mongoose'

/**
 * Type to model the Customer Schema for TypeScript.
 * @param type_id:ref => CustomerType._id
 * @param email:string
 * @param name:string
 * @param lastname:string
 * @param doc_type:string
 * @param doc_number:string
 * @param status:string
 */
interface ICustomer extends Document {
  type_id: Types.ObjectId
  email: string
  name: string
  lastname: string
  doc_type: string
  doc_number: string
  status: string
}

const CustomerSchema = new Schema<ICustomer>({
  type_id: { type: Schema.Types.ObjectId, ref: 'CustomerType', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  doc_type: { type: String, required: true },
  doc_number: { type: String, required: true },
  status: { type: String, required: true },
})

const Customer = model<ICustomer>('Customer', CustomerSchema)
export default Customer
