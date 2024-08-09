import { Document, model, Schema } from 'mongoose';

/**
 * Type to model the Line Schema for TypeScript.
 * @param line_name:string
 */
interface ILine extends Document {
  line_name: string;
}

const LineSchema = new Schema<ILine>({
  line_name: { type: String, required: true }
});

const Line = model<ILine>('Line', LineSchema);
export default Line;
