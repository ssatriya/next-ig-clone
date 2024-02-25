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
    <div className="w-[383px] pl-16 pt-4 shrink-0">
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
              <p className="font-semibold text-sm">{user.username}</p>
              <p className="text-sm font-medium text-igSecondaryText">
                {user.name}
              </p>
            </div>
          </div>
          <Button
            variant="text"
            className="text-igPrimary text-xs font-medium p-0"
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
