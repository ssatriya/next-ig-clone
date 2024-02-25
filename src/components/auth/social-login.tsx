"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
        className="w-full bg-primary"
        size="sm"
        aria-label="Login with Google"
      >
        <Image
          src="/assets/google.svg"
          height={20}
          width={20}
          alt="Google logo"
        />
      </Button>
      <Button
        disabled
        onClick={() => onClick("github")}
        className="w-full bg-primary"
        size="sm"
        aria-label="Login with Github"
      >
        <Image
          src="/assets/github.svg"
          height={20}
          width={20}
          alt="Github logo"
        />
      </Button>
    </div>
  );
};
export default SocialLogin;
