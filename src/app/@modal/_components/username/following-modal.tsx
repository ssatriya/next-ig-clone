"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import UserItemSkeleton from "@/app/_components/content/liked/user-item-skeleton";
import { useQuery } from "@tanstack/react-query";

import UserFollowingItem from "./user-following-item";
import { UserFollowersPostWithIsFollowing } from "@/types/db";
import { useEffect, useState } from "react";

type FollowingModalProps = {
  username: string;
  loggedInUserId: string;
  reload: boolean;
};

const FollowingModal = ({
  username,
  loggedInUserId,
  reload,
}: FollowingModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const { data: userFollowingData, isLoading } = useQuery({
    queryKey: ["getFollowingData"],
    queryFn: async () => {
      const req = await fetch(`/api/user/following?username=${username}`);
      const data = await req.json();
      return data as UserFollowersPostWithIsFollowing[];
    },
  });

  const onDismiss = () => {
    if (reload) {
      router.push(`/${username}`);
      return;
    }
    router.back();
    setOpen(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open={open} defaultOpen>
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
            userFollowingData.map((following) => (
              <UserFollowingItem
                key={following.id}
                user={following}
                loggedInUserId={loggedInUserId}
                setOpen={setOpen}
              />
            ))}
        </div>
        {userFollowingData && userFollowingData.length === 0 && (
          <div className="max-h-[400px] text-center mb-4">
            <span className="text-sm">You aren&apos;t following anyone</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default FollowingModal;
