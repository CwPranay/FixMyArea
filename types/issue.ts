// types/issue.ts
export interface Location {
  type: "Point";
  coordinates: [number, number];
  address: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  images: string[];
  createdById?: string;
  createdByType: "user" | "anonymous";
  createdByName: string;
  location: Location;
  createdAt?: string;
  updatedAt?: string;
}

export interface IssueContextType {
  issues: Issue[];
  loading: boolean;
  refreshIssues: () => Promise<void>;
}