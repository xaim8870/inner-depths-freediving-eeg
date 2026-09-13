import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);

    return Response.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        status: "error",
        database: "disconnected",
      },
      {
        status: 500,
      }
    );
  }
}