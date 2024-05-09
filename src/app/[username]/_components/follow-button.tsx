"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import loadingSVG from "../../../../public/assets/loading-spinner.svg";

type FollowButtonProps = {
  followHandler: () => void;
  isLoading: boolean;
  buttonLabel: string;
};

const FollowButton = ({
  followHandler,
  isLoading,
  buttonLabel,
}: FollowButtonProps) => {
  return (
    <Button
      onClick={() => followHandler()}
      variant="nav"
      className={cn(
        "relative w-[75px] px-4 h-8 text-sm rounded-lg  bg-igPrimary hover:bg-igPrimaryHover text-white"
      )}
    >
      <Image
        src={loadingSVG}
        height={18}
        width={18}
        priority
        alt="Loading"
        className={cn(
          "animate-spin absolute",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      />
      {buttonLabel}
    </Button>
  );
};

export default FollowButton;
