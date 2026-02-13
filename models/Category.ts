import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio.'],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

// Avoid model re-compilation
const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
