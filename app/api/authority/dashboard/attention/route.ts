import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Issue from "@/models/issue";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get overdue issues (>7 days old and not resolved)
    const overdueIssues = await Issue.find({
      status: { $in: ["open", "in_progress"] },
      createdAt: { $lt: sevenDaysAgo }
    }).sort({ createdAt: 1 }).limit(10);

    // Get recent open issues (potential critical)
    const recentOpenIssues = await Issue.find({
      status: "open",
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 }).limit(5);

    const attentionItems: Array<{
      id: string;
      title: string;
      category: string;
      reason: "overdue" | "critical" | "low-rating" | "unassigned";
      days?: number;
      rating?: number;
    }> = [];

    // Add overdue issues
    overdueIssues.forEach(issue => {
      const daysOld = Math.floor((now.getTime() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine category
      const text = (issue.title + " " + issue.description).toLowerCase();
      let category = "Others";
      if (text.includes("road") || text.includes("pothole")) category = "Road Damage";
      else if (text.includes("garbage") || text.includes("waste")) category = "Waste Management";
      else if (text.includes("light")) category = "Streetlights";
      else if (text.includes("water")) category = "Water Supply";

      attentionItems.push({
        id: issue._id.toString(),
        title: issue.title,
        category,
        reason: "overdue" as const,
        days: daysOld
      });
    });

    // Add some recent critical issues (if title contains urgent/critical keywords)
    recentOpenIssues.forEach(issue => {
      const text = (issue.title + " " + issue.description).toLowerCase();
      const isCritical = text.includes("urgent") || text.includes("critical") || 
                        text.includes("emergency") || text.includes("danger");
      
      if (isCritical && attentionItems.length < 15) {
        let category = "Others";
        if (text.includes("road") || text.includes("pothole")) category = "Road Damage";
        else if (text.includes("garbage") || text.includes("waste")) category = "Waste Management";
        else if (text.includes("light")) category = "Streetlights";
        else if (text.includes("water")) category = "Water Supply";

        attentionItems.push({
          id: issue._id.toString(),
          title: issue.title,
          category,
          reason: "critical" as const
        });
      }
    });

    return NextResponse.json(attentionItems.slice(0, 10));

  } catch (error) {
    console.error("Error fetching attention items:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
