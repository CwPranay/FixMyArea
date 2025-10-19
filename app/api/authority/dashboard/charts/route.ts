import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Issue from "@/models/issue";

export async function GET() {
  try {
    await connectDB();

    const allIssues = await Issue.find();

    // Category data
    const categoryCount: Record<string, number> = {
      "Road Damage": 0,
      "Garbage": 0,
      "Streetlights": 0,
      "Water Supply": 0,
      "Others": 0
    };

    allIssues.forEach(issue => {
      const text = (issue.title + " " + issue.description).toLowerCase();
      if (text.includes("road") || text.includes("pothole")) {
        categoryCount["Road Damage"]++;
      } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash")) {
        categoryCount["Garbage"]++;
      } else if (text.includes("light") || text.includes("street") || text.includes("lamp")) {
        categoryCount["Streetlights"]++;
      } else if (text.includes("water") || text.includes("drainage") || text.includes("leak")) {
        categoryCount["Water Supply"]++;
      } else {
        categoryCount["Others"]++;
      }
    });

    const categoryData = [
      { name: "Road Damage", value: categoryCount["Road Damage"], color: "#3b82f6" },
      { name: "Garbage", value: categoryCount["Garbage"], color: "#10b981" },
      { name: "Streetlights", value: categoryCount["Streetlights"], color: "#f59e0b" },
      { name: "Water Supply", value: categoryCount["Water Supply"], color: "#8b5cf6" },
      { name: "Others", value: categoryCount["Others"], color: "#6b7280" },
    ];

    // Weekly trend data (last 4 weeks)
    const now = new Date();
    const weeklyData = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

      const newIssues = allIssues.filter(issue => {
        const created = new Date(issue.createdAt);
        return created >= weekStart && created < weekEnd;
      }).length;

      const resolvedIssues = allIssues.filter(issue => {
        const updated = new Date(issue.updatedAt);
        return issue.status === "resolved" && updated >= weekStart && updated < weekEnd;
      }).length;

      weeklyData.push({
        week: `Week ${4 - i}`,
        new: newIssues,
        resolved: resolvedIssues
      });
    }

    // Department performance (simulated based on categories)
    const departmentData = [
      { 
        dept: "Roads", 
        resolved: categoryCount["Road Damage"],
        avgTime: 3.2
      },
      { 
        dept: "Sanitation", 
        resolved: categoryCount["Garbage"],
        avgTime: 2.8
      },
      { 
        dept: "Electricity", 
        resolved: categoryCount["Streetlights"],
        avgTime: 4.1
      },
      { 
        dept: "Water", 
        resolved: categoryCount["Water Supply"],
        avgTime: 3.5
      },
    ];

    return NextResponse.json({
      categoryData,
      weeklyData,
      departmentData
    });

  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
