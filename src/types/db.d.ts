import {
  PostSelectType,
  UserSelectType,
  FollowersSelectType,
  CommentsSelectType,
  LikesSelectType,
} from "@/lib/db/schema";

export type ExtendedUser = UserSelectType & {
  followers: FollowersSelectType[];
  followings: FollowersSelectType[];
};

export type ExtendedComment = CommentsSelectType & {
  user: ExtendedUser & { post: PostSelectType[] };
};

export type ExtendedPost = PostSelectType & {
  user: ExtendedUser;
  comment: CommentsSelectType[];
  like: Array<LikesSelectType & { user: UserSelectType | null }>;
};

export type UserLikedPost = LikesSelectType & {
  user:
    | (UserSelectType & {
        followers: FollowersSelectType[];
        followings: FollowersSelectType[];
      })
    | null;
};

export type LikeWithUser = LikesSelectType & { user: UserSelectType | null };

export type LikeWithUserAndFollowers = LikesSelectType & {
  post: PostSelectType | null;
  user:
    | (UserSelectType & {
        followers: FollowersSelectType[];
        followings: FollowersSelectType[];
      })
    | null;
};

export type LikeWithUserAndFollowersWithIsFollowing =
  LikeWithUserAndFollowers & { isFollowing: boolean };

export type UserFollowersPost = UserSelectType & {
  followers: FollowersSelectType[];
  followings: FollowersSelectType[];
  post: PostSelectType[];
};

export type UserFollowersPostWithIsFollowing = UserFollowersPost & {
  isFollowing: boolean;
};
