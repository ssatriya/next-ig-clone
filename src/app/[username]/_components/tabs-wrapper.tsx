"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { ExtendedUser } from "@/types/db";
import { Icons } from "@/components/icons";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type TabsWrapperProps = {
  children: React.ReactNode;
  userByUsername: ExtendedUser;
};

const TabsWrapper = ({ children, userByUsername }: TabsWrapperProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex gap-10 justify-center w-full border-t-[1px] h-[53px]">
        <Link href={`/${userByUsername.username}`}>
          <Button
            variant="nav"
            className={cn(
              "hover:bg-transparent rounded-none border-t-[1px] border-t-transparent w-fit px-1 h-full",
              pathname === `/${userByUsername.username}` &&
                "border-t-[1px] border-t-foreground"
            )}
          >
            <Icons.grid className="mr-1" />
            <span className="uppercase font-semibold text-xs tracking-wider">
              Posts
            </span>
          </Button>
        </Link>
        <Link href={`/${userByUsername.username}/saved`}>
          <Button
            variant="nav"
            className={cn(
              "hover:bg-transparent rounded-none border-t-[1px] border-t-transparent w-fit px-1 h-full",
              pathname === `/${userByUsername.username}/saved` &&
                "border-t-[1px] border-t-foreground"
            )}
          >
            <Icons.savedSmall className="mr-1" />
            <span className="uppercase font-semibold text-xs tracking-wider">
              Saved
            </span>
          </Button>
        </Link>
        <Link href={`/${userByUsername.username}/tagged`}>
          <Button
            variant="nav"
            className={cn(
              "hover:bg-transparent rounded-none border-t-[1px] border-t-transparent w-fit px-1 h-full",
              pathname === `/${userByUsername.username}/tagged` &&
                "border-t-[1px] border-t-foreground"
            )}
          >
            <Icons.tagged className="mr-1" />
            <span className="uppercase font-semibold text-xs tracking-wider">
              Tagged
            </span>
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
};
export default TabsWrapper;
