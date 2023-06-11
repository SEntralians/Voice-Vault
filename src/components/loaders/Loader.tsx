import type { FC } from "react";

const Loader: FC = () => {
  return (
    <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8"
      ></path>
    </svg>
  );
};

export default Loader;
