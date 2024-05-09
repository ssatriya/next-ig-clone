"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import loadingSVG from "../../../../public/assets/loading-spinner.svg";
import loadingSVGDark from "../../../../public/assets/loading-spinner-dark.svg";

type FollowingButtonProps = {
  followHandler: () => void;
  isLoading: boolean;
  buttonLabel: string;
};

const FollowingButton = ({
  followHandler,
  isLoading,
  buttonLabel,
}: FollowingButtonProps) => {
  const { theme } = useTheme();

  return (
    <Button
      onClick={() => followHandler()}
      variant="nav"
      className={cn(
        "relative px-4 h-8 w-[96px] text-sm rounded-lg bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80"
      )}
    >
      <Image
        src={theme === "light" ? loadingSVGDark : loadingSVG}
        alt="Loading"
        className={cn(
          "animate-spin w-[18px] h-[18px] absolute",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      />
      {buttonLabel}
    </Button>
  );
};

export default FollowingButton;
