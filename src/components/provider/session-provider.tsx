"use client";

import { createContext, useContext, useState, useTransition } from "react";

import { UserSession } from "@/types/auth";
import { validateSession } from "@/actions/validate-session";

type AuthContext = {
  session: UserSession;
  refreshSessionData: () => Promise<void>;
};

const authContext: AuthContext = {
  session: {
    user: null,
    session: null,
  },
  refreshSessionData: async () => {},
};

const AuthContext = createContext<AuthContext>(authContext);

type SessionProviderProps = {
  children: React.ReactNode;
  session: UserSession;
};

const SessionProvider = ({ children, session }: SessionProviderProps) => {
  const [_, startTransition] = useTransition();
  const [authSession, setAuthSession] = useState<UserSession>(session);

  const refreshSessionData = async () => {
    startTransition(() => {
      validateSession().then((data) => {
        setAuthSession(data);
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session: authSession,
        refreshSessionData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default SessionProvider;

export const useCurrentSession = () => {
  return useContext(AuthContext);
};
