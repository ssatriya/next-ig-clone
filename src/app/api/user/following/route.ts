import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import { followers } from "@/lib/db/schema";
import { ExtendedUser } from "@/types/db";
import { and, eq } from "drizzle-orm";

export async function GET() {
  try {
    const { user: userSession } = await validateRequest();

    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user: ExtendedUser | undefined = await db.query.users.findFirst({
      with: {
        followers: true,
        followings: true,
      },
      where: (users, { eq }) => eq(users.id, userSession.id),
    });

    return new Response(JSON.stringify(user));
  } catch (error) {
    return new Response("Failed to fetch following data", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response("User id is missing", { status: 422 });
    }

    await db
      .delete(followers)
      .where(
        and(
          eq(followers.followersId, userId),
          eq(followers.followingsId, user.id)
        )
      );

    return new Response("User un-followed", { status: 200 });
  } catch (error) {
    return new Response("Failed to modify user", { status: 500 });
  }
}
