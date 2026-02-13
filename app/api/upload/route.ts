import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const uploadToCloudinary = (file: File) => {
  return new Promise(async (resolve, reject) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio_projects',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

export async function POST(request: Request) {
  try {
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Faltan variables de entorno de Cloudinary' },
        { status: 500 }
      );
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: 'No se han subido archivos' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(uploadToCloudinary);
    const results = await Promise.all(uploadPromises);

    return NextResponse.json(results);

  } catch (error) {
    console.error('Error al subir a Cloudinary:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al subir las imágenes' },
      { status: 500 }
    );
  }
}
