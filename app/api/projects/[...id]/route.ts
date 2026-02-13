import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

// Removed Context interface definition

export async function GET(
  request: NextRequest,
  context: any // Use any for context to bypass type error
) {
  const id = context.params.id[0];
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
    console.error(error);
    return NextResponse.json(
      { message: 'Error al obtener el proyecto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: any // Use any for context to bypass type error
) {
  const id = context.params.id[0];
  await connectDB();
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
  request: NextRequest,
  context: any // Use any for context to bypass type error
) {
  const id = context.params.id[0];
  await connectDB();
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
