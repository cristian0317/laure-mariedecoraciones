import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { message: 'ID de proyecto no proporcionado' },
      { status: 400 }
    );
  }

  await connectDB();
  console.log('ID para eliminar (query param):', id); // LOGGING
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'PROYECTO ELIMINADO CORRECTAMENTE (via query param)' });
  } catch (error) {
    console.error('Error al eliminar el proyecto (query param):', error);
    return NextResponse.json(
      { message: 'Error en el servidor al eliminar el proyecto' },
      { status: 500 }
    );
  }
}
