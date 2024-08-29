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
  // add hover post like personal profile for public non login user
  if (!loggedInUser?.id) return <GeneralProfilePosts userPosts={userPosts} />;

  return userByUsername.id === loggedInUser.id ? (
    <PersonalProfilePosts userPosts={userPosts} />
  ) : (
    <GeneralProfilePosts userPosts={userPosts} />
  );
};
export default PostsTabs;
