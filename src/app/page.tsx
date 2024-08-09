import { Suspense } from "react";

import FeedLoading from "./feed-loading";
import FeedWrapper from "./feed-wrapper";
import LoginForm from "@/components/auth/login-form";
import { validateRequest } from "@/lib/auth/validate-request";
import RightSidebar from "./_components/sidebar/right/right-sidebar";

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
