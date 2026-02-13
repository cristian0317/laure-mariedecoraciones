import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await context.params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error al obtener el proyecto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;
  console.log('ID para actualizar:', id); // LOGGING
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
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Error al actualizar el proyecto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;
  console.log('ID para eliminar:', id); // LOGGING
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'PROYECTO ELIMINADO CORRECTAMENTE' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error al eliminar el proyecto' },
      { status: 500 }
    );
  }
}
