"use client";
import { useIssues } from "@/context/IssueContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTranslations,useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface Issue {
  _id: string;
  title: string;
  description: string;
  status: string;
  images: string[];
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  createdByName?: string;
}

export default function ViewAllIssuesRoute() {
  const t = useTranslations("myIssues");
  const router = useRouter();
  const locale = useLocale();
  const { issues, loading, refreshIssues } = useIssues();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredIssues = issues.filter((i: Issue) => {
    if (!user) return false;
    if (i.createdByName !== user.name) return false;
    const matchesSearch = i.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || i.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'in-progress': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'resolved': return 'bg-green-50 text-green-700 border border-green-200';
      case 'closed': return 'bg-gray-50 text-gray-700 border border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  }

  function GridIssueCard({ issue }: { issue: Issue }) {
    const hasImage = issue.images && issue.images.length > 0;
    const [lng, lat] = issue.location.coordinates;

    return (
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {hasImage ? (
            <Image
              src={issue.images[0]}
              alt={issue.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">{t("noImageUploaded") || "No image uploaded"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Title and status */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 capitalize line-clamp-2 pr-2">
              {issue.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap ${getStatusColor(issue.status)}`}>
              {issue.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Address */}
          <div className="flex items-center text-xs text-gray-500 mt-auto">
            <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-600 hover:underline block w-full"
              title="Open in Google Maps"
            >
              {issue.location.address}
            </a>
          </div>
        </div>
      </div>
    );
  }

  function ListIssueCard({ issue }: { issue: Issue }) {
    const hasImage = issue.images && issue.images.length > 0;
    const [lng, lat] = issue.location.coordinates;

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-gray-100">
              {hasImage ? (
                <Image
                  src={issue.images[0]}
                  alt={issue.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-10 h-10 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-400">{t("noImageUploaded") || "No image"}</p>
                  </div>
                </div>
              )}
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

            <div className="flex items-center text-sm text-gray-500 min-w-0">
              <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-600 hover:underline block w-full"
                title="Open in Google Maps"
              >
                {issue.location.address}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-48 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 hidden md:flex bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 animate-pulse"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl [font-family:var(--font-poppins)] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {t("issuesFound", { count: filteredIssues.length })}
          </p>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === "grid"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden xs:inline">{t("gridView")}</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === "list"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden xs:inline">{t("listView")}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("searchLocation")}</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("status")}</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white text-sm"
            >
              <option value="All">{t("allStatuses")}</option>
              <option value="open">{t("open")}</option>
              <option value="in-progress">{t("inProgress")}</option>
              <option value="resolved">{t("resolved")}</option>
              <option value="closed">{t("closed")}</option>
            </select>
          </div>
        </div>
      </div>

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
          <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("noIssuesFound")}</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            {t("noIssuesDescription")}
          </p>
          <button
            onClick={() => router.push(`/${locale}/report-issue`)}
            className="inline-flex items-center gap-2 px-6 py-3 btn-primary-gradient text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("reportNewIssue") || "Report New Issue"}
          </button>
        </div>
      )}
    </div>
  );
}