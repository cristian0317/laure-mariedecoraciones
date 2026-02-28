import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json(
      { message: 'Error al obtener los proyectos: ' + (error.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { title, description, category, images } = await request.json();
    const newProject = new Project({
      title,
      description,
      category,
      images,
    });
    const savedProject = await newProject.save();
    return NextResponse.json(savedProject, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear proyecto:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Error al crear el proyecto: ' + (error.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  return NextResponse.json({ message: 'DEBUG: DELETE request received at /api/projects' });
}
