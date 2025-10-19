import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Issue from "@/models/issue";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Get all issues
    const allIssues = await Issue.find();

    // This week's resolved issues
    const thisWeekResolved = await Issue.countDocuments({
      status: "resolved",
      updatedAt: { $gte: oneWeekAgo }
    });

    // Last week's resolved issues
    const lastWeekResolved = await Issue.countDocuments({
      status: "resolved",
      updatedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    // Calculate efficiency trend
    const efficiencyTrend = lastWeekResolved > 0 
      ? Math.round(((thisWeekResolved - lastWeekResolved) / lastWeekResolved) * 100)
      : 0;

    const totalIssues = allIssues.length;
    const resolvedCount = allIssues.filter(i => i.status === "resolved").length;
    const efficiency = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;

    // Most reported category (extract from title/description)
    const categoryCount: Record<string, number> = {};
    const categories = ["road", "garbage", "waste", "streetlight", "light", "water", "drainage", "pothole"];
    
    allIssues.forEach(issue => {
      const text = (issue.title + " " + issue.description).toLowerCase();
      categories.forEach(cat => {
        if (text.includes(cat)) {
          const key = cat === "light" ? "streetlight" : cat === "waste" ? "garbage" : cat;
          categoryCount[key] = (categoryCount[key] || 0) + 1;
        }
      });
    });

    const mostReported = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0] || ["Others", 0];

    // Top hotspots (by location address)
    const locationCount: Record<string, number> = {};
    allIssues.forEach(issue => {
      if (issue.location?.address) {
        const area = issue.location.address.split(",")[0].trim();
        locationCount[area] = (locationCount[area] || 0) + 1;
      }
    });

    const hotspots = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area]) => area);

    // Average response time
    const resolvedIssues = allIssues.filter(i => i.status === "resolved" && i.createdAt && i.updatedAt);
    const avgResponseTime = resolvedIssues.length > 0
      ? resolvedIssues.reduce((sum, issue) => {
          const days = (new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / resolvedIssues.length
      : 0;

    // Last week's average
    const lastWeekResolvedIssues = allIssues.filter(i => 
      i.status === "resolved" && 
      i.updatedAt && 
      new Date(i.updatedAt) >= twoWeeksAgo && 
      new Date(i.updatedAt) < oneWeekAgo
    );

    const lastWeekAvgTime = lastWeekResolvedIssues.length > 0
      ? lastWeekResolvedIssues.reduce((sum, issue) => {
          const days = (new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / lastWeekResolvedIssues.length
      : avgResponseTime;

    const timeTrend = lastWeekAvgTime > 0
      ? Math.round(((avgResponseTime - lastWeekAvgTime) / lastWeekAvgTime) * 100)
      : 0;

    // Overdue issues (>7 days old and not resolved)
    const overdueIssues = await Issue.countDocuments({
      status: { $in: ["open", "in_progress"] },
      createdAt: { $lt: oneWeekAgo }
    });

    return NextResponse.json({
      efficiency: {
        value: efficiency,
        trend: efficiencyTrend,
        improved: efficiencyTrend >= 0
      },
      mostReported: {
        category: mostReported[0].charAt(0).toUpperCase() + mostReported[0].slice(1),
        count: mostReported[1]
      },
      hotspots: hotspots.length > 0 ? hotspots : ["No data yet"],
      avgResponseTime: {
        value: parseFloat(avgResponseTime.toFixed(1)),
        trend: timeTrend,
        improved: timeTrend <= 0
      },
      overdueIssues
    });

  } catch (error) {
    console.error("Error fetching KPI data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
