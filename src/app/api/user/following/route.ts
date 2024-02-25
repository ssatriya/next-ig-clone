import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import { ExtendedUser } from "@/types/db";

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
