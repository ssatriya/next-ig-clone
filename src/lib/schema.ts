import { z } from "zod";

export const LoginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(4, { message: "Username is required" })
    .or(z.string().email().min(4, { message: "Email is required" })),
  password: z.string().min(6, { message: "Password is required" }),
});
export type LoginPayload = z.infer<typeof LoginSchema>;

export const CreatePostSchema = z.object({
  caption: z.string().optional(),
  images: z.string(),
});
export type CreatePostPayload = z.infer<typeof CreatePostSchema>;

export const CreateCommentSchema = z.object({
  comment: z.string(),
  postId: z.string(),
  userId: z.string(),
});
export type CreateCommentPayload = z.infer<typeof CreateCommentSchema>;

export const CreateLikeSchema = z.object({
  postId: z.string(),
});
export type CreateLikePaylod = z.infer<typeof CreateLikeSchema>;
