"use client";

import { LoadingSpinnerProps } from "@/types/common";

export default function LoadingSpinner({ title }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      {title}
    </div>
  );
}
