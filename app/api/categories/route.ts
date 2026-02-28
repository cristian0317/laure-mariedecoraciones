import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

// GET all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ message: 'Server error: ' + (error.message || 'Error desconocido') }, { status: 500 });
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'El nombre es obligatorio' }, { status: 400 });
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return NextResponse.json({ message: 'La categoría ya existe' }, { status: 409 });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json({ message: 'Server error: ' + (error.message || 'Error desconocido') }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(request: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ message: 'ID de categoría no proporcionado' }, { status: 400 });
      }
  
      const deletedCategory = await Category.findByIdAndDelete(id);
  
      if (!deletedCategory) {
        return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error: any) {
      console.error('Error al eliminar categoría:', error);
      return NextResponse.json({ message: 'Server error: ' + (error.message || 'Error desconocido') }, { status: 500 });
    }
  }
