import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response("Username is missing", { status: 422 });
    }

    const userByUsername = await db.query.users.findFirst({
      with: {
        followers: true,
        followings: true,
      },
      where: (users, { eq }) => eq(users.username, username),
    });

    return new Response(JSON.stringify(userByUsername));
  } catch (error) {
    return new Response("Failed to fetch user profile", { status: 500 });
  }
}
