import { NextResponse } from "next/server";
import {
  getFeedbackAgg,
  getGlobalTotals,
  getSkillStats,
} from "@/lib/stats-server";

export async function GET() {
  const [totals, skillStats, feedback] = await Promise.all([
    getGlobalTotals(),
    getSkillStats(),
    getFeedbackAgg(),
  ]);

  return NextResponse.json({
    totals,
    skillStats,
    feedback,
  });
}
