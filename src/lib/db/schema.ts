import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { generateId } from "lucia";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).unique(),
    image: text("image"),
    bio: varchar("bio", { length: 255 }),
    isOauth: boolean("is_oauth").default(false),
  },
  (table) => {
    return {
      usernameIdx: index("username_idx").on(table.username),
    };
  }
);

export type UserSelectType = InferSelectModel<typeof users>;

export const userRelations = relations(users, ({ many }) => ({
  post: many(posts),
  comment: many(comments),
  likes: many(likes),
  followers: many(followers, { relationName: "followers" }),
  followings: many(followers, { relationName: "followings" }),
}));

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
    };
  }
);

export const posts = pgTable("post", {
  id: text("id")
    .$defaultFn(() => generateId(16))
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caption: text("caption"),
  images: text("images").notNull(),
  aspectRatio: text("aspectRatio").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PostSelectType = InferSelectModel<typeof posts>;

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comment: many(comments),
  like: many(likes),
}));

// Try to use composite primary-key later, seems to be a good idea
export const followers = pgTable("followers", {
  id: text("id")
    .$defaultFn(() => generateId(16))
    .primaryKey(),
  followersId: text("followersId").references(() => users.id, {
    onDelete: "cascade",
  }),
  followingsId: text("followingsId").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export type FollowersSelectType = InferSelectModel<typeof followers>;

export const followerRelations = relations(followers, ({ one }) => ({
  followers: one(users, {
    fields: [followers.followersId],
    references: [users.id],
    relationName: "followers",
  }),
  followings: one(users, {
    fields: [followers.followingsId],
    references: [users.id],
    relationName: "followings",
  }),
}));

export const comments = pgTable("comments", {
  id: text("id")
    .$defaultFn(() => generateId(16))
    .primaryKey(),
  comment: text("comment").notNull(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CommentsSelectType = InferSelectModel<typeof comments>;

export const commentRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const likes = pgTable("likes", {
  id: text("id")
    .$defaultFn(() => generateId(16))
    .primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type LikesSelectType = InferSelectModel<typeof likes>;

export const likeRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));
