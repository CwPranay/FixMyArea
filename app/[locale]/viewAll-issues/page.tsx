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

export default function ViewAllIssuesRoute() {
  const { issues, loading, refreshIssues } = useIssues();
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const locations = ["All", ...new Set(
    issues
      .map((i: Issue) => i.location?.address)
      .filter((address): address is string => Boolean(address))
  )];

  const filteredIssues = issues.filter((i: Issue) => {
    const matchesLocation = selectedLocation === "All" || i.location.address === selectedLocation;
    const matchsSearch = i.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || i.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesLocation && matchsSearch && matchesStatus;
  });

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  function getInitial(name?: string) {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'resolved': return 'bg-green-50 text-green-700 border border-green-200';
      case 'closed': return 'bg-gray-50 text-gray-700 border border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  }

  function GridIssueCard({ issue }: { issue: Issue }) {
    return (
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={issue.images[0]}
            alt={issue.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 capitalize line-clamp-2 pr-2">
              {issue.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap ${getStatusColor(issue.status)}`}>
              {issue.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
          
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{issue.location.address}</span>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
              {getInitial(issue.createdByName || "A")}
            </div>
            <span className="text-xs text-gray-700 font-medium truncate">
              {issue.createdByName || "Anonymous"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function ListIssueCard({ issue }: { issue: Issue }) {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden">
              <Image
                src={issue.images[0]}
                alt={issue.title}
                fill
                sizes="(max-width: 640px) 100vw, 160px"
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 mb-3">
              <h3 className="text-lg font-medium text-gray-900 capitalize">
                {issue.title}
              </h3>
              <span className={`px-2.5 py-1 text-sm font-medium rounded-md w-fit ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {issue.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{issue.location.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                  {getInitial(issue.createdByName || "A")}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {issue.createdByName || "Anonymous"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading issues...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl [font-family:var(--font-poppins)] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">All Issues</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'} found
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden xs:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden xs:inline">List</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white text-sm"
            >
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc === "All" ? "All Locations" : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Display */}
      {filteredIssues.length > 0 ? (
        <div className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            : "space-y-4"
        }>
          {filteredIssues.map((issue) =>
            viewMode === "grid" ? (
              <GridIssueCard key={issue._id} issue={issue} />
            ) : (
              <ListIssueCard key={issue._id} issue={issue} />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Try adjusting your search criteria or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}