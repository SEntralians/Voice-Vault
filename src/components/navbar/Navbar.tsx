import type { FC } from "react";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

interface Props {
  currentPage: string;
  userImage: string;
}

const Navbar: FC<Props> = ({ currentPage, userImage }) => {
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
    <nav className="bg-primary-100 h-20 flex items-center">
      <div className="mx-4 px-4 w-full flex justify-between items-center">
        <div className="flex items-center">
          <img className="h-16 w-16 bg-background-100 rounded-full" src="images/logo_transparent.svg"></img>
          <h1 className="text-white text-3xl font-bold ml-4">VoiceVault</h1>
        </div>

             <div className="mx-6 flex flex-col lg:mx-8 text-white text-xl font-serif lg:flex-row absolute inset-x-0 z-20  duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:top-0 lg:mt-0 lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:bg-transparent  lg:p-0 lg:opacity-100">
               <a
                  href="home"
                  className={`mx-3 mt-2 transform rounded-md px-3 py-2 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
                    currentPage === "home" ? "underline" : ""
                  }`}
                >
                  My Mental Space
                </a>
                <a
                  href="discussion"
                  className={`mx-3 mt-2 transform rounded-md px-3 py-2 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
                    currentPage === "discussion" ? "underline" : ""
                  }`}
                >
                  Discussions
                </a>
                <a
                  href="challenges"
                  className={`mx-3 mt-2 transform rounded-md px-3 py-2 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
                    currentPage === "challenges" ? "underline" : ""
                  }`}
                >
                  Challenges
                </a>

                <div className="mt-4 ml-96 first-letter:flex items-center lg:mt-0">
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
                  <img className="h-16 w-16 overflow-hidden bg-background-100 rounded-full" src={userImage}></img>
                </button>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
    </nav>
  );
};

export default Navbar;