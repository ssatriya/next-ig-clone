"use client";

import { useTheme } from "next-themes";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { PostSelectType, UserSelectType } from "@/lib/db/schema";
import Link from "next/link";
import { ExtendedComment, ExtendedPost } from "@/types/db";
import { Skeleton } from "./ui/skeleton";

type UserTooltipProps = {
  children: React.ReactNode;
  userId: string;
  comment: ExtendedComment;
};

type TemporaryType = {
  posts: PostSelectType[];
};

const CommentUserTooltip = ({
  comment,
  userId,
  children,
}: UserTooltipProps) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["userPostsQuery", userId],
    queryFn: async () => {
      const res = await fetch(`/api/post/by-id?id=${userId}`, {
        method: "GET",
      });
      const data = await res.json();

      return data as TemporaryType;
    },
    enabled: open,
    gcTime: 60 * 1000,
  });

  const slicedPost = data?.posts.slice(0, 3);

  const stories = false;

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={6}
          align="start"
          className="w-96 h-fit border-none space-y-4 px-0"
        >
          <div className="px-2 py-3">
            <div className="flex gap-3 items-center">
              <Link
                href={
                  stories
                    ? `/stories/${comment.user.username}`
                    : `/${comment.user.username}`
                }
                className={cn(
                  "h-[68px] w-[68px] flex items-center justify-center p-3 rounded-full",
                  stories
                    ? "bg-gradient-to-br from-yellow-400 to-pink-500"
                    : "bg-transparent"
                )}
              >
                <Avatar
                  className={cn(
                    "h-16 w-16 border-[3px] flex items-center justify-center",
                    theme === "light" ? "border-white" : "border-black"
                  )}
                >
                  <AvatarImage src={comment.user.image || ""} asChild>
                    <Image
                      src={comment.user.image || ""}
                      width={64}
                      height={64}
                      alt={comment.user.username || ""}
                    />
                  </AvatarImage>
                  <AvatarFallback>ss</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/${comment.user.username}`}
                  className="font-bold text-sm"
                >
                  {comment.user.username}
                </Link>
                <span className="text-xs font-semibold text-igSecondaryText">
                  {comment.user.name}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 mt-4">
              <div className="flex flex-col items-center">
                {!isFetching && !isLoading && (
                  <span className="font-bold">{data?.posts.length}</span>
                )}
                <span>posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">
                  {comment.user.followers.length}
                </span>
                <span>followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">
                  {comment.user.followings.length}
                </span>
                <span>following</span>
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-1">
            {isFetching && isLoading && (
              <>
                <Skeleton className="h-[125px] w-[124px]" />
                <Skeleton className="h-[125px] w-[124px]" />
                <Skeleton className="h-[125px] w-[124px]" />
              </>
            )}
            {!isFetching &&
              !isLoading &&
              slicedPost?.map((post) => {
                const postImages = post.images.split(",");
                return (
                  <div key={post.id} className="relative h-[125px] w-[125px]">
                    <Image
                      src={postImages[0]}
                      fill
                      alt="post image"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                );
              })}
          </div>
          <div className="flex gap-2 w-full px-4 pb-3">
            <Button variant="primary" className="rounded-lg w-full h-8">
              <Icons.message className="mr-2" />
              Message
            </Button>
            <Button
              variant="text"
              className="bg-igElevatedSeparatorV2 hover:bg-igSeparator rounded-lg w-full h-8"
            >
              Following
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default CommentUserTooltip;
