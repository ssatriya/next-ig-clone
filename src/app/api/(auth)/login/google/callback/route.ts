import { generateId } from "lucia";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";

import db from "@/lib/db";
import { google, lucia } from "@/lib/auth";
import { oauthAccounts, users } from "@/lib/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const codeVerifier = cookies().get("code_verifier")?.value ?? null;
  const storedState = cookies().get("google_oauth_state")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response("No code verifier", {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUserResult: GoogleUser = await googleUserResponse.json();
    const [existingAccount] = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.providerId, "google"),
          eq(oauthAccounts.providerUserId, googleUserResult.sub)
        )
      );

    if (existingAccount) {
      const session = await lucia.createSession(existingAccount.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUserResult.email));

    if (existingUser.length > 0) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/login?error=OAuthEmailTaken",
        },
      });
    }

    const userId = generateId(16);
    // await db.transaction(async (tx) => {
    await db.insert(users).values({
      id: userId,
      name: googleUserResult.name,
      username: `${googleUserResult.given_name.toLowerCase()}`,
      email: googleUserResult.email,
      isOauth: true,
      image: googleUserResult.picture,
    });
    await db.insert(oauthAccounts).values({
      providerId: "google",
      providerUserId: googleUserResult.sub,
      userId: userId,
    });
    // });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
