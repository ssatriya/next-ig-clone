import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 201 });
    }

    const following = await db.query.followers.findMany({
      where: (followers, { eq }) => eq(followers.followingsId, user.id),
    });

    const followingsArray = following.map(
      (user) => user.followersId || user.id
    );
    const followingsSet = new Set([...followingsArray, user.id]);

    if (followingsArray.length === 0) {
      const usersQuery = await db.query.users.findMany({
        where: (users, { ne }) => ne(users.id, user.id),
        limit: 5,
      });
      return new Response(JSON.stringify(usersQuery));
    } else {
      const usersQuery = await db.query.users.findMany({
        where: (users, { notInArray }) =>
          notInArray(users.id, Array.from(followingsSet)),
        limit: 5,
      });
      return new Response(JSON.stringify(usersQuery));
    }
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
