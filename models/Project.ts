import { Schema, model, models } from 'mongoose';

// Esquema de Project
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
  },
  images: {
    type: [String], // Arreglo de strings para URLs de imágenes
    default: [],
  },
}, {
  timestamps: true, // Habilita createdAt y updatedAt
});

// Evitar la recompilación del modelo en entornos serverless
const Project = models.Project || model('Project', ProjectSchema);

export default Project;
