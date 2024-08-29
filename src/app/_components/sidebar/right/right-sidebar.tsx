"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import SuggestedUser from "./suggested-user";
import { User } from "lucia";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { UserSelectType } from "@/lib/db/schema";

type RightSidebarProps = {
  user: User;
};

const RightSidebar = ({ user }: RightSidebarProps) => {
  const { data: suggestedUser } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      const res = await fetch("/api/user/unfollowed");
      const data = await res.json();

      return data as UserSelectType[];
    },
  });

  return (
    // <div className="bg-blue-800 w-[383px] pl-16 pt-4 shrink-0">
    // <div className="pt-4 pl-16 shrink-0 w-[383px] max-[1264px]:w-[373px] hidden md:block">

    <div className="pt-4 pl-16 shrink-0 w-[383px] hidden xl:block">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Avatar className="w-11 h-11">
              <AvatarImage src={user.image} asChild>
                <Image
                  src={user.image}
                  height={44}
                  width={44}
                  alt={`${user.name} avatar`}
                />
              </AvatarImage>
              <AvatarFallback>ss</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{user.username}</p>
              <p className="text-sm font-medium text-igSecondaryText">
                {user.name}
              </p>
            </div>
          </div>
          <Button
            variant="text"
            className="p-0 text-xs font-medium text-igPrimary"
          >
            Switch
          </Button>
        </div>
        <div className="flex justify-between mt-3 mb-4">
          <p className="text-sm font-semibold text-igSecondaryText">
            Suggested for you
          </p>
          <p className="text-sm font-semibold">See All</p>
        </div>
        <div className="space-y-3">
          {suggestedUser &&
            suggestedUser.map((user) => (
              <SuggestedUser key={user.id} user={user} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightSidebar;
