"use client";

import { follow } from "@/actions/follow";
import PostUserTooltip from "@/components/post-user-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LikeWithUserAndFollowersWithIsFollowing,
  UserLikedPost,
} from "@/types/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

type UserItemProps = {
  like: LikeWithUserAndFollowersWithIsFollowing;
  userSession: User | null;
};

const UserItem = ({ like, userSession }: UserItemProps) => {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const followHandler = () => {
    startTransition(() => {
      if (!like.userId) return;
      follow(like.userId).then((data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ["getLikedUsers"] });
        }
        if (data.error) {
          // setStatus("error");
        }
      });
    });
  };

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <div className="flex gap-3 items-center">
        <Avatar className="h-11 w-11">
          <AvatarImage src={like.user?.image || ""} asChild>
            <Image
              src={like.user?.image || ""}
              priority
              alt={`${like.user?.username} avatar`}
              height={44}
              width={44}
            />
          </AvatarImage>
          <AvatarFallback>ss</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/${like.user?.username}`}>
            <span className="text-sm font-bold">{like.user?.username}</span>
          </Link>
          <span className="text-sm">{like.user?.name}</span>
        </div>
      </div>
      <Button
        onClick={followHandler}
        variant="nav"
        className={cn(
          "px-4 h-8 text-sm rounded-lg",
          like.isFollowing
            ? "dark:text-primary dark:bg-igSecondaryTextV2/30 dark:hover:bg-igSecondaryTextV2/15 bg-igSecondaryTextV2/30 hover:bg-igSecondaryTextV2/60"
            : "dark:text-primary bg-igPrimary hover:bg-igPrimaryHover text-background"
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
        ) : !isPending && like.isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
};
export default UserItem;
