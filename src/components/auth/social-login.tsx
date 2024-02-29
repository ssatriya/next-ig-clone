"use client";

import { Button } from "@/components/ui/button";

const SocialLogin = () => {
  const onClick = (providers: "google" | "github") => {
    if (providers === "google") {
      window.location.replace("/api/login/google");
    } else if (providers === "github") {
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onClick("google")}
        className="w-full bg-primary text-xs"
        size="sm"
        aria-label="Login with Google"
      >
        Log in with Google
      </Button>
      <Button
        disabled
        onClick={() => onClick("github")}
        className="w-full bg-primary text-xs"
        size="sm"
        aria-label="Login with Github"
      >
        Log in with Github
      </Button>
    </div>
  );
};
export default SocialLogin;
