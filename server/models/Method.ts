import { Document, model, Schema } from 'mongoose';

/**
 * Type to model the Method Schema for TypeScript.
 * @param method_name:string
 */
interface IMethod extends Document {
  method_name: string;
}

const MethodSchema = new Schema<IMethod>({
  method_name: { type: String, required: true }
});

const Method = model<IMethod>('Method', MethodSchema);
export default Method;
