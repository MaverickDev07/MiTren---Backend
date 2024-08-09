import { Document, model, Schema } from 'mongoose';

/**
 * Type to model the Role Schema for TypeScript.
 * @param role_name:string
 */
interface IRole extends Document {
  role_name: string;
}

const RoleSchema = new Schema<IRole>({
  role_name: { type: String, required: true }
});

const Role = model<IRole>('Role', RoleSchema);
export default Role;
