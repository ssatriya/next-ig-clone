"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FollowersSelectType,
  PostSelectType,
  UserSelectType,
} from "@/lib/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

type UserWithFollowersAndPost = UserSelectType & {
  followers: FollowersSelectType[];
  followings: FollowersSelectType[];
  post: PostSelectType[];
};

type UserFollowingItemProps = {
  user: UserWithFollowersAndPost;
};

const UserFollowingItem = ({ user }: UserFollowingItemProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["mutateFollowing"],
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/user/following?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFollowingData"] });
      queryClient.invalidateQueries({
        queryKey: ["userProfileQuery", user.username],
      });
    },
  });

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
          <Link href={`/${user?.username}`}>
            <span className="text-sm font-bold">{user?.username}</span>
          </Link>
          <span className="text-sm">{user?.name}</span>
        </div>
      </div>
      <Button
        onClick={followHandler}
        variant="nav"
        className="px-4 h-8 text-sm rounded-lg dark:text-primary dark:bg-igSecondaryTextV2/30 dark:hover:bg-igSecondaryTextV2/15 bg-igSecondaryTextV2/30 hover:bg-igSecondaryTextV2/60"
      >
        {isPending ? (
          <Image
            src="/assets/loading-spinner.svg"
            height={18}
            width={18}
            alt="Loading"
            className="animate-spin"
          />
        ) : (
          "Following (not checked)"
        )}
      </Button>
    </div>
  );
};
export default UserFollowingItem;
