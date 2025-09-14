// context/IssueContext.tsx
"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Issue, IssueContextType } from "@/types/issue";

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/issue", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch issues");

      const data = await res.json();
      console.log("API Response:", data);
      console.log("Response type:", typeof data);
      console.log("Is array?", Array.isArray(data));
      
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setIssues(data);
      } else if (data && Array.isArray(data.issues)) {
        setIssues(data.issues);
      } else if (data && Array.isArray(data.data)) {
        setIssues(data.data);
      } else {
        console.warn("Unexpected API response structure:", data);
        setIssues([]);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <IssueContext.Provider value={{ issues, loading, refreshIssues }}>
      {children}
    </IssueContext.Provider>
  );
}

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error("useIssues must be used within an IssueProvider");
  }
  return context;
};