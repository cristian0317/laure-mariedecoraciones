import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { message: 'ID de proyecto no proporcionado' },
      { status: 400 }
    );
  }

  await connectDB();
  try {
    const { title, description, category, images } = await request.json();
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, category, images },
      { new: true }
    );
    if (!updatedProject) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado para actualizar' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error al actualizar el proyecto (query param):', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Error en el servidor al actualizar el proyecto' },
      { status: 500 }
    );
  }
}
