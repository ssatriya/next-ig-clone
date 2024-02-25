"use client";

import { Next13ProgressBar } from "next13-progressbar";

const ProgressbarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Next13ProgressBar
        height="3px"
        color="linear-gradient(90deg, rgba(249,206,52,1) 0%, rgba(238,42,123,1) 50%, rgba(98,40,215,1) 100%)"
        options={{ showSpinner: false }}
        showOnShallow
      />
    </>
  );
};

export default ProgressbarProvider;
