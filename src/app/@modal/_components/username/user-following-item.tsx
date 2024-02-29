"use client";

import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  UserFollowersPost,
  UserFollowersPostWithIsFollowing,
} from "@/types/db";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import PostUserTooltip from "@/components/post-user-tooltip";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UserFollowingItemProps = {
  user: UserFollowersPostWithIsFollowing;
  loggedInUserId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UserFollowingItem = ({
  user,
  loggedInUserId,
  setOpen,
}: UserFollowingItemProps) => {
  const queryClient = useQueryClient();
  const [localIsFollowing, setLocalIsFollowing] = useState(user.isFollowing);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["mutateFollowing"],
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/user/following?userId=${userId}`, {
        method: "PATCH",
      });

      return res;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["getFollowingData"] });
      queryClient.invalidateQueries({
        queryKey: ["userProfileQuery"],
      });
    },
  });

  useEffect(() => {
    if (isSuccess && !user.isFollowing) {
      setLocalIsFollowing((prev) => !prev);
    } else if (isSuccess && user.isFollowing) {
      setLocalIsFollowing((prev) => !prev);
    }
  }, [isSuccess, user]);

  const followHandler = () => {
    mutate(user.id);
  };

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <div className="flex gap-3 items-center">
        <Avatar className="h-11 w-11">
          <AvatarImage src={user?.image || ""} asChild>
            <Image
              src={user?.image || ""}
              priority
              alt={`${user?.username} avatar`}
              height={44}
              width={44}
            />
          </AvatarImage>
          <AvatarFallback>ss</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/${user?.username}`} onClick={() => setOpen(false)}>
            <span className="text-sm font-bold">{user?.username}</span>
          </Link>
          <span className="text-sm">{user?.name}</span>
        </div>
      </div>
      {user?.id !== loggedInUserId && (
        <Button
          onClick={followHandler}
          variant="nav"
          className={cn(
            "px-4 h-8 text-sm rounded-lg",
            localIsFollowing
              ? "dark:text-primary dark:bg-igSecondaryTextV2/30 dark:hover:bg-igSecondaryTextV2/15 bg-igSecondaryTextV2/30 hover:bg-igSecondaryTextV2/60"
              : "bg-igPrimary hover:bg-igPrimaryHover"
          )}
        >
          {isPending ? (
            <Image
              src="/assets/loading-spinner.svg"
              height={18}
              width={18}
              alt="Loading"
              className="animate-spin"
            />
          ) : !isPending && localIsFollowing ? (
            "Following"
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </div>
  );
};
export default UserFollowingItem;
