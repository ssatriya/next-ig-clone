"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";

import { Icons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ExtendedPost } from "@/types/db";
import { PostSelectType } from "@/lib/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type PostUserTooltipProps = {
  children: React.ReactNode;
  userId: string;
  post: ExtendedPost;
};

type TemporaryType = {
  posts: PostSelectType[];
};

const PostUserTooltip = ({ post, userId, children }: PostUserTooltipProps) => {
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
      <Tooltip open={open} onOpenChange={setOpen} defaultOpen={false}>
        <TooltipTrigger
          ref={(ref) => {
            if (!ref) return;
            ref.onfocus = (e) => {
              e.preventDefault();
              e.stopPropagation();
            };
          }}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={6}
          align="start"
          className="w-96 h-fit border-none space-y-4 px-0"
        >
          <div className="px-2 py-3">
            <div className="flex gap-3 items-center">
              <Link
                href={`/${post.user.username}`}
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
                  <AvatarImage src={post.user.image || ""} asChild>
                    <Image
                      src={post.user.image || ""}
                      width={64}
                      height={64}
                      alt={post.user.username || ""}
                    />
                  </AvatarImage>
                  <AvatarFallback>ss</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/${post.user.username}`}
                  className="font-bold text-sm"
                >
                  {post.user.username}
                </Link>
                <span className="text-xs font-semibold text-igSecondaryText">
                  {post.user.name}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 mt-4">
              <div className="flex flex-col items-center">
                {data ? (
                  <span className="font-bold">{data.posts.length}</span>
                ) : (
                  <Skeleton className="h-5 w-3" />
                )}
                <span>posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{post.user.followers.length}</span>
                <span>followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{post.user.followings.length}</span>
                <span>following</span>
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-1">
            {!slicedPost && (
              <>
                <Skeleton className="h-[125px] w-[124px]" />
                <Skeleton className="h-[125px] w-[124px]" />
                <Skeleton className="h-[125px] w-[124px]" />
              </>
            )}
            {slicedPost &&
              slicedPost.map((post) => {
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
export default PostUserTooltip;
