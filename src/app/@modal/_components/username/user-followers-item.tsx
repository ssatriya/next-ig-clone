"use client";

import { follow } from "@/actions/follow";
import PostUserTooltip from "@/components/post-user-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FollowersSelectType,
  PostSelectType,
  UserSelectType,
} from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import {
  ExtendedUser,
  LikeWithUserAndFollowersWithIsFollowing,
  UserLikedPost,
} from "@/types/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

type UserWithFollowersAndPost = UserSelectType & {
  followers: FollowersSelectType[];
  followings: FollowersSelectType[];
  post: PostSelectType[];
};

type UserFollowersItemItemProps = {
  user: UserWithFollowersAndPost;
};

const UserFollowersItem = ({ user }: UserFollowersItemItemProps) => {
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
          <Link href={`/${user?.username}`}>
            <span className="text-sm font-bold">{user?.username}</span>
          </Link>
          <span className="text-sm">{user?.name}</span>
        </div>
      </div>
      <Button
        variant="nav"
        className="px-4 h-8 text-sm rounded-lgdark:text-primary dark:bg-igSecondaryTextV2/30 dark:hover:bg-igSecondaryTextV2/15 bg-igSecondaryTextV2/30 hover:bg-igSecondaryTextV2/60"
      >
        Remove
      </Button>
    </div>
  );
};
export default UserFollowersItem;
