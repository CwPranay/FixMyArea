import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Issue from "@/models/issue";

export async function GET() {
  try {
    await connectDB();

    const allIssues = await Issue.find();

    // For now, simulate feedback based on resolution status
    // In future, you can add a feedback/rating field to Issue model
    const resolvedIssues = allIssues.filter(i => i.status === "resolved");
    const totalIssues = allIssues.length;

    // Simulate positive/negative feedback
    const positiveCount = resolvedIssues.length;
    const negativeCount = allIssues.filter(i => i.status === "open" || i.status === "in_progress").length;

    const feedbackData = [
      { name: "Positive", value: positiveCount, color: "#10b981" },
      { name: "Negative", value: negativeCount, color: "#ef4444" },
    ];

    // Calculate satisfaction score (0-100)
    const satisfactionScore = totalIssues > 0 
      ? Math.round((positiveCount / totalIssues) * 100)
      : 50;

    // Generate recent feedback (simulated from resolved issues)
    const recentResolved = allIssues
      .filter(i => i.status === "resolved")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    const recentFeedback = recentResolved.map((issue, index) => {
      const timeAgo = getTimeAgo(new Date(issue.updatedAt));
      const rating = 4 + Math.floor(Math.random() * 2); // 4 or 5 stars for resolved

      return {
        id: issue._id.toString(),
        name: issue.createdByName || "Anonymous",
        rating,
        comment: `Issue resolved: ${issue.title.substring(0, 50)}${issue.title.length > 50 ? '...' : ''}`,
        date: timeAgo
      };
    });

    // Add some pending issues as negative feedback
    const pendingIssues = allIssues
      .filter(i => i.status === "open" || i.status === "in_progress")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, 1);

    pendingIssues.forEach(issue => {
      const timeAgo = getTimeAgo(new Date(issue.createdAt));
      recentFeedback.push({
        id: issue._id.toString(),
        name: issue.createdByName || "Anonymous",
        rating: 2,
        comment: `Still waiting: ${issue.title.substring(0, 50)}${issue.title.length > 50 ? '...' : ''}`,
        date: timeAgo
      });
    });

    return NextResponse.json({
      feedbackData,
      satisfactionScore,
      recentFeedback: recentFeedback.slice(0, 3)
    });

  } catch (error) {
    console.error("Error fetching feedback data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
