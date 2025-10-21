"use client";

import { useState,useEffect } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  onClick: () => void;
  text: string;
  className?: string;
  loadingText?: string;
}

export default function LoadingButton({ 
  onClick, 
  text, 
  className = "",
  loadingText
}: LoadingButtonProps) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleClick = () => {
    if (loading) return;
    
    setLoading(true);
    // Small delay to show loading state before navigation
    setTimeout(() => {
      onClick();
    }, 200);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);


  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 transition ${
        loading ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? loadingText : text}
    </button>
  );
}
