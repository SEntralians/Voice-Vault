import { useRouter } from "next/router";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { UNAUTHORIZED, NOT_LOGGED_IN } from "~/constants/errors";

import type { FC } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthContainer: FC<Props> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const errorQuery = router.query.error as string;
    if (errorQuery) {
      const errorMessage = getErrorMessage(errorQuery);
      toast.error(errorMessage);
    }
  }, [router.query.error]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

const getErrorMessage = (error: string) => {
  switch (error) {
    case UNAUTHORIZED:
      return "You are not authorized to view this page";
    case NOT_LOGGED_IN:
      return "You are not logged in";
    default:
      return "An error occurred";
  }
};

export default AuthContainer;
