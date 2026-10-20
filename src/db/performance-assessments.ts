import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { performanceAssessments } from "@/db/schema";
import type { PerformanceProfileResult } from "@/lib/performance-profile/scoring";

export async function getLatestPerformanceAssessment(userId: string) {
  const [assessment] = await db
    .select()
    .from(performanceAssessments)
    .where(and(eq(performanceAssessments.userId, userId), eq(performanceAssessments.status, "completed")))
    .orderBy(desc(performanceAssessments.completedAt), desc(performanceAssessments.createdAt))
    .limit(1);
  return assessment ? { ...assessment, result: assessment.result as PerformanceProfileResult } : null;
}

export async function getOwnedPerformanceAssessment(userId: string, assessmentId: string) {
  const [assessment] = await db
    .select()
    .from(performanceAssessments)
    .where(and(eq(performanceAssessments.id, assessmentId), eq(performanceAssessments.userId, userId)))
    .limit(1);
  return assessment ? { ...assessment, result: assessment.result as PerformanceProfileResult } : null;
}

