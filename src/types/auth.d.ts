import { Session, User } from "lucia";

import { lucia } from "@/lib/auth";
import { UserRole } from "@/types";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name: string;
  username: string;
  email: string;
  role: UserRole;
  bio: string;
  isOauth: boolean;
  image: string;
}

export type UserSession =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };
