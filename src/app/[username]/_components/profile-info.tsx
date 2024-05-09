"use client";

import { User } from "lucia";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ExtendedPost, ExtendedUser } from "@/types/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import FollowingButton from "./following-button";
import FollowButton from "./follow-button";

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
  const [isLoading, setIsLoading] = useState(false);
  const myProfile = useMemo(
    () => (loggedInUser ? loggedInUser.id === userByUsername.id : false),
    [loggedInUser, userByUsername]
  );

  const { data: userProfileData, refetch } = useQuery({
    queryKey: ["userProfileQuery", userByUsername.username],
    queryFn: async () => {
      const req = await fetch(
        `/api/user/by-username?username=${userByUsername.username}`
      );
      const data = await req.json();

      return data as ExtendedUser;
    },
  });

  const profileData = userProfileData ?? userByUsername;
  const isFollowing =
    userProfileData?.followers.find(
      (user) => user.followingsId === loggedInUser?.id
    ) ??
    userByUsername.followers.find(
      (user) => user.followingsId === loggedInUser?.id
    );

  const [isFollowingLocal, setIsFollowingLocal] = useState(!!isFollowing);

  const { mutate: followHandler } = useMutation({
    mutationKey: ["follow"],
    mutationFn: async () => {
      setIsLoading(true);

      const req = await fetch(
        `/api/user/followtest?targetId=${userByUsername.id}`,
        { method: "PUT" }
      );
      return req.ok;
    },
    onSuccess: () => {
      setIsLoading(false);
      setIsFollowingLocal((prev) => !prev);
    },
    onSettled: () => {
      refetch();
    },
    onError: () => {
      setIsLoading(false);
      setIsFollowingLocal((prev) => prev);
    },
  });

  let isFollowingLabel = "";

  if (!isLoading && !isFollowingLocal) {
    isFollowingLabel = "Follow";
  } else if (!isLoading && isFollowingLocal) {
    isFollowingLabel = "Following";
  }

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
              <>
                {isFollowingLocal && (
                  <FollowingButton
                    followHandler={followHandler}
                    isLoading={isLoading}
                    buttonLabel={isFollowingLabel}
                  />
                )}
                {!isFollowingLocal && (
                  <FollowButton
                    followHandler={followHandler}
                    isLoading={isLoading}
                    buttonLabel={isFollowingLabel}
                  />
                )}
              </>
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
          <span className="text-base font-bold tabular-nums">
            {userPosts.length}
            <span className="font-normal"> posts</span>
          </span>
          <Link href={`/${userByUsername.username}/followers`}>
            <Button variant="text" className="h-fit w-fit p-0">
              <span className="text-base font-bold tabular-nums">
                {/* {userByUsername.followers.length} */}
                {profileData.followers.length}
                <span className="font-normal"> followers</span>
              </span>
            </Button>
          </Link>
          <Link href={`/${userByUsername.username}/following`}>
            <Button
              variant="text"
              className="h-fit w-fit p-0 text-base font-normal"
            >
              <span className="text-base font-bold tabular-nums">
                {/* {userByUsername.followings.length} */}
                {profileData.followings.length}
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
