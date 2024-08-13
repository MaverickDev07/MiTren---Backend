import { Schema, model, Document } from 'mongoose'

// Interface para definir los atributos de Line
interface LineAttributes extends Document {
  line_name: string
  created_at: Date
  updated_at: Date
}

// Definición del esquema de Mongoose para el modelo Line
const LineSchema = new Schema<LineAttributes>({
  line_name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // Autoestablecer la fecha de creación al momento de insertar
  },
  updated_at: {
    type: Date,
    default: Date.now, // Autoestablecer la fecha de actualización al momento de insertar o actualizar
  },
})

// Middleware para actualizar `updated_at` automáticamente en cada `save`
LineSchema.pre('save', function (next) {
  this.updated_at = new Date()
  next()
})

// Creación y exportación del modelo
const Line = model<LineAttributes>('Line', LineSchema)

export default Line
