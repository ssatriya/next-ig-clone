"use client";

import { User } from "lucia";
import Image from "next/image";
import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { follow } from "@/actions/follow";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ExtendedPost, ExtendedUser } from "@/types/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type ProfileInfoProps = {
  userPosts: ExtendedPost[];
  userByUsername: ExtendedUser;
  loggedInUser: User | null;
};

const ProfileInfo = ({
  userPosts,
  userByUsername,
  loggedInUser,
}: ProfileInfoProps) => {
  const [isPending, startTransition] = useTransition();
  const myProfile = loggedInUser
    ? loggedInUser.id === userByUsername.id
    : false;

  const isFollowing = userByUsername.followers.find(
    (user) => user.followingsId === loggedInUser?.id
  );

  const { data: userProfileData } = useQuery({
    queryKey: ["userProfileQuery", userByUsername.username],
    queryFn: async () => {
      const req = await fetch(
        `/api/user/by-username?username=${userByUsername.username}`
      );
      const data = await req.json();

      return data as ExtendedUser;
    },
  });

  const followHandler = () => {
    startTransition(() => {
      follow(userByUsername.id).then((data) => {
        if (data.success) {
          // setStatus("success");
        }
        if (data.error) {
          // setStatus("error");
        }
      });
    });
  };

  return (
    <div className="flex">
      <div className="w-[316px] flex justify-center">
        <Avatar className="h-[150px] w-[150px] border-[3px] border-transparent flex items-center justify-center mr-[30px]">
          <AvatarImage src={userByUsername.image || ""} asChild>
            <Image
              src={userByUsername.image || ""}
              width={150}
              height={150}
              priority
              alt="avatar"
            />
          </AvatarImage>
          <AvatarFallback>ss</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-6">
          <span className="text-xl leading-[25px]">
            {userByUsername.username}
          </span>
          <div className="flex items-center gap-2">
            {myProfile && (
              <Button
                variant="nav"
                className="px-4 h-8 bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80 text-sm rounded-lg font-semibold"
              >
                Edit profile
              </Button>
            )}
            {myProfile && (
              <Button
                variant="nav"
                className="px-4 h-8 bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80 text-sm rounded-lg font-semibold"
              >
                View archive
              </Button>
            )}
            {myProfile && (
              <Button variant="text" size="icon" className="h-fit w-fit ml-2">
                <Icons.options />
              </Button>
            )}
            {!myProfile && (
              <Button
                onClick={followHandler}
                variant="nav"
                className={cn(
                  "px-4 h-8 text-sm rounded-lg",
                  !!isFollowing
                    ? "bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80"
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
                ) : !isPending && !!isFollowing ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </Button>
            )}
            {!myProfile && (
              <Button
                variant="nav"
                className="px-4 h-8 bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80 text-sm rounded-lg"
              >
                Message
              </Button>
            )}
            {!myProfile && (
              <Button variant="text" size="icon" className="h-fit w-fit ml-2">
                <Icons.moreCircleLarge />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-12 items-center">
          <span className="text-base font-bold">
            {userPosts.length}
            <span className="font-normal"> posts</span>
          </span>
          <Link href={`/${userByUsername.username}/followers`}>
            <Button variant="text" className="h-fit w-fit p-0">
              <span className="text-base font-bold">
                {userByUsername.followers.length}
                <span className="font-normal"> followers</span>
              </span>
            </Button>
          </Link>

          <Link href={`/${userByUsername.username}/following`}>
            <Button
              variant="text"
              className="h-fit w-fit p-0 text-base font-normal"
            >
              <span className="text-base font-bold">
                {userByUsername.followings.length}
                <span className="font-normal"> following</span>
              </span>
            </Button>
          </Link>
        </div>
        <span className="text-sm font-semibold">{userByUsername.name}</span>
      </div>
    </div>
  );
};
export default ProfileInfo;
