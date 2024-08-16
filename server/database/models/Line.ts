import { Schema, model } from 'mongoose'

import { LineAttributes } from '../../utils/types'

// Definición del esquema de Mongoose para el modelo Line
const LineSchema = new Schema<LineAttributes>(
  {
    line_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Middleware para actualizar `updated_at` automáticamente en cada `save`
/*LineSchema.pre('save', function (next) {
  this.updated_at = new Date()
  next()
})*/

// Creación y exportación del modelo
const Line = model<LineAttributes>('Line', LineSchema)

export default Line
