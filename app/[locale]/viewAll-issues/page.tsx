"use client";
import { useIssues } from "@/context/IssueContext";
import { useEffect, useState } from "react";
import Image from "next/image";


interface Issue {
  _id: string;
  title: string;
  description: string;
  status: string;
  images: string[];
  location: {
    address: string;
  };
  createdByName?: string;
}

export default function ViewAllIssuesRoute({
  _id,
  title,
  description,
  status,
  images,
  location,
  createdByName

}: Issue) {
  const { issues, loading, refreshIssues } = useIssues();
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const locations = ["All", ...new Set(
    issues
      .map((i: Issue) => i.location?.address)
      .filter((address): address is string => Boolean(address))
  )];

  const filteredIssues = issues.filter((i: Issue) => {
    const matchesLocation = selectedLocation ==="All" || i.location.address === selectedLocation;

    const matchsSearch = i.location.address.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) 
    

    return matchesLocation && matchsSearch;
  })

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  function getInitial(name?: string) {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  }

  function IssueCard({ issue }: { issue: Issue }) {
    return (
      <div

        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 text-left flex flex-col justify-between h-full"
      >
        <Image
          src={issue.images[0]}
          alt={issue.title}
          width={300}
          height={300}
          loading="lazy"
          className="rounded-lg object-cover w-full h-[300px] mb-4"
        />
        <h3 className="text-lg capitalize  font-semibold text-gray-800 mb-1">
          {issue.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2 leading-snug">
          {issue.description}
        </p>
        <span className="text-xs text-gray-500 mb-3 block">
          📍 {issue.location.address}
        </span>

        <div className=" items-center gap-2 mt-auto pt-2 border-t border-gray-100">
          
          {/* Avatar Circle (WhatsApp-style) */}
          <span className="text-xs  bg-green-200 text-green-800 px-2 py-1 rounded">
           Status: {issue.status}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold text-white shadow">
            {getInitial(issue.createdByName || "A")}
          </div>
          <span className="text-xs text-gray-700 font-medium">
            {issue.createdByName || "Anonymous"}
          </span>
          </div>
          
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-black">Loading issues...</div>;

  return (
    <div>
      <input
      type="text"
      placeholder="Search City..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border text-black border-gray-500 rounded p-2 mb-4 w-full"
      />

      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="border text-black border-gray-500 rounded p-2"
      >
        {locations.map((loc, idx) => (
          <option key={idx} value={loc}>
            {loc}
          </option>
        ))}


      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredIssues.length>0 ? (
          filteredIssues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))
        ) : (
          <div className="text-black col-span-full">No issues found for the selected location.</div>
        )}
      </div>


    </div>

  );
}
