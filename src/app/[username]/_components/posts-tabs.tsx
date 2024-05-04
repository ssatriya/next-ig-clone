"use client";

import { ExtendedPost, ExtendedUser } from "@/types/db";
import { User } from "lucia";
import PersonalProfilePosts from "./personal-profile/personal-profile-posts";
import GeneralProfilePosts from "./general-profile/general-profile-posts";
import { useMemo } from "react";

type PostsTabsProps = {
  userPosts: ExtendedPost[];
  userByUsername: ExtendedUser;
  loggedInUser: User | null;
};

const PostsTabs = ({
  userPosts,
  userByUsername,
  loggedInUser,
}: PostsTabsProps) => {

  return userByUsername.id === loggedInUser?.id ? (
    <PersonalProfilePosts userPosts={userPosts} />
  ) : (
    <GeneralProfilePosts userPosts={userPosts} />
  );
};
export default PostsTabs;
