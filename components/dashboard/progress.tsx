"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressBar({ loading }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  return <Progress value={progress} className="w-[60%]" />;
}
