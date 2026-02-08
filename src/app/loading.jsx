"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <h2 className="text-xl font-bold text-primary-foreground animate-pulse">
          Loading...
        </h2>
      </div>
    </div>
  );
}
