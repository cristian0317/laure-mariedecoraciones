import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function GET() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    return NextResponse.json({ message: "Pinged your deployment. You successfully connected to MongoDB!" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to connect to MongoDB", error: (error as Error).message }, { status: 500 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
