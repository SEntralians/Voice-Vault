import type { FC } from "react";

interface Props {
  currentPage: string;
}

const NavBar: FC<Props> = ({ currentPage }) => {
  return (
    <>
      <nav className="relative bg-white shadow  dark:bg-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-white"> Voice Vault </h3>
            </div>

            <div className="absolute inset-x-0 z-20 w-full bg-white px-6 py-4 transition-all duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:top-0 lg:mt-0 lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:bg-transparent  lg:p-0 lg:opacity-100">
              <div className="-mx-6 flex flex-col lg:mx-8 lg:flex-row lg:items-center">
                <a
                  href="home"
                  className={`mx-3 mt-2 transform rounded-md px-3 py-2 text-gray-700 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
                    currentPage === "home" ? "underline" : ""
                  }`}
                >
                  My Mental Space
                </a>
                <a
                  href="discussion"
                  className={`mx-3 mt-2 transform rounded-md px-3 py-2 text-gray-700 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
                    currentPage === "discussion" ? "underline" : ""
                  }`}
                >
                  Discussions
                </a>
                <a
                  href="challenges"
                  className={`mx-3 mt-2 transform rounded-md px-3 py-2 text-gray-700 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
                    currentPage === "challenges" ? "underline" : ""
                  }`}
                >
                  Challenges
                </a>
              </div>

              <div className="mt-4 flex items-center lg:mt-0">
                <button
                  className="mx-4 hidden transform text-gray-600 transition-colors duration-300 hover:text-gray-700 focus:text-gray-700 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 dark:focus:text-gray-400 lg:block"
                  aria-label="show notifications"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  aria-label="toggle profile dropdown"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-400"></div>

                  <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">
                    Khatab wedaa
                  </h3>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
