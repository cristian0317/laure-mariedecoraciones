import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error("MONGODB_URI no está definida en las variables de entorno de Vercel.");
      throw new Error("Configuración de base de datos incompleta (Falta MONGODB_URI en Vercel)");
    }
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("Conexión a MongoDB exitosa");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
