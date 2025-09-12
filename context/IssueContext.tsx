"use client";
import { set } from "mongoose";
import React, { Children, createContext, useContext, useEffect, useState } from "react";

interface Issue {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  images: string[];
  createdById?: string;
  createdByType: "user" | "anonymous";
  createdByName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

    

interface IssueContextType {
    issues: Issue[];
    loading: boolean;
    refreshIssues: () => void;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider =({ children }:{children:React.ReactNode})=>{
 const[issues ,setIssue] =useState<Issue[]>([]);
 const[loading,setLoading] =useState(true);

 const refreshIssues = async()=>{
    try{
        setLoading(true);
        const res =await fetch("/api/issues",{
            method:"GET",
            credentials:"include",
            headers:{"Cache-Control":"no-cache"}
        });

        if(!res.ok) throw new Error("Failed to Fetch Issues");
        const data = await res.json();
        setIssue(data.issues || []);

    }
    catch(error){
        console.error("Failed to fetch issues:",error);
        setIssue([]);
    }
    finally{
        setLoading(false);
    }

 }
 useEffect(()=>{    
    refreshIssues();
    },[]);

    return (
    <IssueContext.Provider value={{ issues ,loading, refreshIssues }}>
        {children}
    </IssueContext.Provider>
);
}


export const useIssues =()=>{
    const context =useContext(IssueContext);
    if(context ===undefined){
        throw new Error("useIssues must be used within an IssueProvider");
    }
    return context;
}