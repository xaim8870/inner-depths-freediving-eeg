import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { dives, trainingSessions } from "@/db/schema";

export type ProgressActivity =
  | {
      kind: "dive";
      id: string;
      date: string;
      createdAt: Date;
      discipline: typeof dives.$inferSelect.discipline;
      depthMeters: number;
      durationSeconds: number;
    }
  | {
      kind: "training";
      id: string;
      date: string;
      createdAt: Date;
      sessionType: string;
      durationMinutes: number;
      difficulty: number | null;
    };

export async function getProgressDashboard(userId: string) {
  const [diveRows, trainingRows] = await Promise.all([
    db
      .select({
        id: dives.id,
        date: dives.diveDate,
        discipline: dives.discipline,
        depthMeters: dives.depthMeters,
        durationSeconds: dives.durationSeconds,
        comfort: dives.comfort,
        createdAt: dives.createdAt,
      })
      .from(dives)
      .where(eq(dives.userId, userId))
      .orderBy(asc(dives.diveDate), asc(dives.createdAt)),
    db
      .select({
        id: trainingSessions.id,
        date: trainingSessions.sessionDate,
        sessionType: trainingSessions.sessionType,
        durationMinutes: trainingSessions.durationMinutes,
        difficulty: trainingSessions.difficulty,
        createdAt: trainingSessions.createdAt,
      })
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, userId))
      .orderBy(asc(trainingSessions.sessionDate), asc(trainingSessions.createdAt)),
  ]);

  const today = new Date();
  const thirtyDayStart = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() - 29,
  )).toISOString().slice(0, 10);

  const totalDiveTimeSeconds = diveRows.reduce((sum, dive) => sum + dive.durationSeconds, 0);
  const deepestDive = diveRows.length > 0
    ? Math.max(...diveRows.map((dive) => dive.depthMeters))
    : null;
  const averageDepth = diveRows.length > 0
    ? diveRows.reduce((sum, dive) => sum + dive.depthMeters, 0) / diveRows.length
    : null;
  const ratedDives = diveRows.filter((dive) => dive.comfort !== null);
  const averageComfort = ratedDives.length > 0
    ? ratedDives.reduce((sum, dive) => sum + (dive.comfort ?? 0), 0) / ratedDives.length
    : null;

  const disciplineCounts = new Map<string, number>();
  for (const dive of diveRows) {
    disciplineCounts.set(dive.discipline, (disciplineCounts.get(dive.discipline) ?? 0) + 1);
  }

  const trainingTypeCounts = new Map<string, number>();
  const monthlyTrainingCounts = new Map<string, number>();
  for (const session of trainingRows) {
    trainingTypeCounts.set(
      session.sessionType,
      (trainingTypeCounts.get(session.sessionType) ?? 0) + 1,
    );
    const month = session.date.slice(0, 7);
    monthlyTrainingCounts.set(month, (monthlyTrainingCounts.get(month) ?? 0) + 1);
  }

  const mostFrequentTrainingType = [...trainingTypeCounts.entries()]
    .sort(([typeA, countA], [typeB, countB]) => countB - countA || typeA.localeCompare(typeB))[0]
    ?.[0] ?? null;

  const trainingFrequency: Array<{ month: string; count: number }> = [];
  if (trainingRows.length > 0) {
    const firstMonth = trainingRows[0].date.slice(0, 7);
    const lastMonth = trainingRows.at(-1)?.date.slice(0, 7) ?? firstMonth;
    const end = new Date(`${lastMonth}-01T00:00:00Z`);
    const start = new Date(`${firstMonth}-01T00:00:00Z`);
    const twelveMonthStart = new Date(Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth() - 11,
      1,
    ));
    if (start < twelveMonthStart) start.setTime(twelveMonthStart.getTime());

    for (const cursor = new Date(start); cursor <= end; cursor.setUTCMonth(cursor.getUTCMonth() + 1)) {
      const month = cursor.toISOString().slice(0, 7);
      trainingFrequency.push({ month, count: monthlyTrainingCounts.get(month) ?? 0 });
    }
  }

  const recentActivity: ProgressActivity[] = [
    ...diveRows.map((dive) => ({
      kind: "dive" as const,
      id: dive.id,
      date: dive.date,
      createdAt: dive.createdAt,
      discipline: dive.discipline,
      depthMeters: dive.depthMeters,
      durationSeconds: dive.durationSeconds,
    })),
    ...trainingRows.map((session) => ({
      kind: "training" as const,
      id: session.id,
      date: session.date,
      createdAt: session.createdAt,
      sessionType: session.sessionType,
      durationMinutes: session.durationMinutes,
      difficulty: session.difficulty,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return {
    diveMetrics: {
      totalDives: diveRows.length,
      deepestDive,
      averageDepth,
      totalDiveTimeSeconds,
      divesLast30Days: diveRows.filter((dive) => dive.date >= thirtyDayStart).length,
      averageComfort,
    },
    trainingMetrics: {
      totalTrainingSessions: trainingRows.length,
      trainingSessionsLast30Days: trainingRows.filter((session) => session.date >= thirtyDayStart).length,
      totalTrainingMinutes: trainingRows.reduce(
        (sum, session) => sum + session.durationMinutes,
        0,
      ),
      mostFrequentTrainingType,
    },
    depthSeries: diveRows.map((dive) => ({
      id: dive.id,
      date: dive.date,
      value: dive.depthMeters,
    })),
    comfortSeries: ratedDives.map((dive) => ({
      id: dive.id,
      date: dive.date,
      value: dive.comfort as number,
    })),
    trainingFrequency,
    disciplineBreakdown: [...disciplineCounts.entries()]
      .map(([discipline, count]) => ({
        discipline: discipline as typeof dives.$inferSelect.discipline,
        count,
      }))
      .sort((a, b) => b.count - a.count || a.discipline.localeCompare(b.discipline)),
    recentActivity,
  };
}

export type ProgressDashboard = Awaited<ReturnType<typeof getProgressDashboard>>;
