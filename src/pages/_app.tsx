import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AuthContainer from "~/containers/AuthContainer";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthContainer>
        <Component {...pageProps} />
      </AuthContainer>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
