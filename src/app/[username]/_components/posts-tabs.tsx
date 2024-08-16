"use client";

import { User } from "lucia";

import { ExtendedPost, ExtendedUser } from "@/types/db";
import GeneralProfilePosts from "./general-profile/general-profile-posts";
import PersonalProfilePosts from "./personal-profile/personal-profile-posts";

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
