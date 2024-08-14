import { Document, model, Schema } from 'mongoose'

/**
 * Type to model the CustomerType Schema for TypeScript.
 * @param customer_type:string
 */
interface ICustomerType extends Document {
  customer_type: string
}

const CustomerTypeSchema = new Schema<ICustomerType>({
  customer_type: { type: String, required: true },
})

const CustomerType = model<ICustomerType>('CustomerType', CustomerTypeSchema)
export default CustomerType
