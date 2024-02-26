"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import UserItemSkeleton from "@/app/_components/content/liked/user-item-skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  FollowersSelectType,
  PostSelectType,
  UserSelectType,
} from "@/lib/db/schema";
import UserFollowersItem from "./user-followers-item";
import { useTransition } from "react";
import { follow } from "@/actions/follow";
import UserFollowingItem from "./user-following-item";

type UserWithFollowersAndPost = UserSelectType & {
  followers: FollowersSelectType[];
  followings: FollowersSelectType[];
  post: PostSelectType[];
};

type FollowingModalProps = {
  username: string;
};

const FollowingModal = ({ username }: FollowingModalProps) => {
  const router = useRouter();

  const { data: userFollowingData, isLoading } = useQuery({
    queryKey: ["getFollowingData"],
    queryFn: async () => {
      const req = await fetch(
        `/api/user/profile/follow-count?username=${username}&type=following`
      );
      const userProfile = await req.json();

      return userProfile as UserWithFollowersAndPost[];
    },
  });

  const onDismiss = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen>
      <DialogContent
        onInteractOutside={onDismiss}
        className="w-[400px] border-none dark:bg-igSeparator bg-background p-0 sm:rounded-xl gap-0"
      >
        <div className="flex w-full h-[43px] items-center justify-between border-b-[1px] dark:border-igElevatedSeparatorV2 border-igElevatedSeparator">
          <div className="h-[43] w-[48px] block bg-transparent"></div>
          <span className="font-bold">Following</span>
          <Button
            onClick={onDismiss}
            variant="text"
            size="icon"
            className="h-[43] w-[48px]"
          >
            <XIcon />
          </Button>
        </div>
        <div className="my-2 overflow-y-auto max-h-[400px]">
          {isLoading && (
            <>
              <UserItemSkeleton />
              <UserItemSkeleton />
              <UserItemSkeleton />
            </>
          )}
          {!isLoading &&
            userFollowingData &&
            userFollowingData?.map((following) => (
              <UserFollowingItem key={following.id} user={following} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default FollowingModal;
