import { Document, model, Schema, Types } from 'mongoose'

/**
 * Type to model the User Schema for TypeScript.
 * @param role_id:ref => Role._id
 * @param email:string
 * @param password:string
 * @param name:string
 * @param lastname:string
 * @param doc_type:string
 * @param doc_number:string
 * @param status:string
 */
interface IUser extends Document {
  role_id: Types.ObjectId
  email: string
  password: string
  name: string
  lastname: string
  doc_type: string
  doc_number: string
  status: string
}

const UserSchema = new Schema<IUser>({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  doc_type: { type: String, required: true },
  doc_number: { type: String, required: true },
  status: { type: String, required: true },
})

const User = model<IUser>('User', UserSchema)
export default User
