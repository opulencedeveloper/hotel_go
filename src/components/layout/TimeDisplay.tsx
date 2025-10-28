"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(time);
    };

    // Set initial time
    updateTime();

    // Update every second for real-time display
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex items-center space-x-2">
      <Clock className="w-4 h-4" />
      <span>{currentTime || "--:-- --"}</span>
    </div>
  );
}
