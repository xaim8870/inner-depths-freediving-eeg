import "server-only";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { dives, profiles } from "@/db/schema";
import { getHomeDiveDashboard } from "@/db/dives";
import { getHomeTrainingSummary } from "@/db/training-sessions";
import { getTrainingGoalsForUser } from "@/db/training-goals";
import { getWhoopConnectionStatus } from "@/db/whoop-connections";
import { getLatestPerformanceAssessment } from "@/db/performance-assessments";

export async function getHomeDashboard(userId: string) {
  const [profileRows, dive, training, goals, whoop, overallFeelSeries, performanceProfile] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1),
    getHomeDiveDashboard(userId),
    getHomeTrainingSummary(userId),
    getTrainingGoalsForUser(userId),
    getWhoopConnectionStatus(userId),
    db.select({ id: dives.id, date: dives.diveDate, value: dives.overallFeel })
      .from(dives)
      .where(and(eq(dives.userId, userId), isNotNull(dives.overallFeel)))
      .orderBy(desc(dives.diveDate), desc(dives.createdAt))
      .limit(12),
    getLatestPerformanceAssessment(userId),
  ]);
  return {
    profile: profileRows[0] ?? null,
    dive,
    training,
    goals,
    whoopConnected: Boolean(whoop),
    performanceProfile: performanceProfile ? {
      completedAt: performanceProfile.completedAt,
      focus: performanceProfile.result.pathways.blend ? "Balanced profile" : performanceProfile.result.dominant.label,
    } : null,
    overallFeelSeries: overallFeelSeries.filter((point): point is typeof point & { value: number } => point.value !== null).reverse(),
  };
}
