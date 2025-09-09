"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

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
    

}