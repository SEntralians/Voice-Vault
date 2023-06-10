import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NOT_LOGGED_IN } from "~/constants/errors";
import type { NextPage } from "next";

const withAuth = <P extends Record<string, unknown>>(
  WrappedComponent: NextPage<P>
) => {
  const WithAuth: NextPage<P> = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if the session is loading
    if (status === "loading") {
      return <div>Loading...</div>;
    }

    // Redirect to index if not logged in
    if (!session) {
      void router.push({
        pathname: "/",
        query: {
          error: NOT_LOGGED_IN,
        },
      });
      return null;
    }

    // Render the wrapped component if logged in
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
