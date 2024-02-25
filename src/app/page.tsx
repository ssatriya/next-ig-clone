import { Suspense } from "react";

import db from "@/lib/db";
import { ExtendedPost } from "@/types/db";
import FeedLoading from "./feed-loading";
import Feed from "./_components/content/feed";
import LoginForm from "@/components/auth/login-form";
import { validateRequest } from "@/lib/auth/validate-request";
import RightSidebar from "./_components/sidebar/right/right-sidebar";
import FeedWrapper from "./feed-wrapper";

export default async function HomePage() {
  const { user } = await validateRequest();

  if (user) {
    return (
      <>
        <Suspense fallback={<FeedLoading />}>
          <FeedWrapper user={user} />
        </Suspense>
        <RightSidebar user={user} />
      </>
    );
  }
  return (
    <div className="h-full flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
