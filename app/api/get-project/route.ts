import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(request: Request) {
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
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto (query param):', error);
    return NextResponse.json(
      { message: 'Error en el servidor al obtener el proyecto' },
      { status: 500 }
    );
  }
}
