import type { FC } from "react";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

interface Props {
  currentPage: string;
}

const Navbar: FC<Props> = ({ currentPage }) => {
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const goToRoot = () => {
    void router.push("/");
  };

  return (
    <>
      <nav className="relative bg-white shadow  dark:bg-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center justify-between">
              <h3
                className="cursor-pointer text-3xl font-bold text-white"
                onClick={goToRoot}
              >
                Voice Vault
              </h3>
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
                  {/* Add your notification icon here */}
                </button>

                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  aria-label="toggle profile dropdown"
                  onClick={handleDropdownToggle}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-400"></div>
                  <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">
                    Khatab wedaa
                  </h3>
                </button>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-20 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                        onClick={() => void signOut()}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
