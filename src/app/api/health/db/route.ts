import { db } from "@/db";
import { dives, profiles, trainingSessions, users } from "@/db/schema";

export async function GET() {
  try {
    // Reading zero or one row from each table verifies the migrated schema
    // without exposing any stored data in the response.
    await Promise.all([
      db.select({ id: users.id }).from(users).limit(1),
      db.select({ id: profiles.id }).from(profiles).limit(1),
      db.select({ id: dives.id }).from(dives).limit(1),
      db.select({ id: trainingSessions.id }).from(trainingSessions).limit(1),
    ]);

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
