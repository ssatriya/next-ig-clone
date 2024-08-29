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
      <div className="flex justify-between w-full ">
        <div className="flex justify-center mx-auto">
          <Suspense fallback={<FeedLoading />}>
            <FeedWrapper user={user} />
          </Suspense>
          <RightSidebar user={user} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-full">
      <LoginForm />
    </div>
  );
}
