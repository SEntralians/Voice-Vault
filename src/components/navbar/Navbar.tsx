import type { FC } from "react";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  currentPage: string;
}

const Navbar: FC<Props> = ({ currentPage }) => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const userImage = sessionData?.user.image ?? "images/logo_opaque.svg";

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
    <nav className="flex h-20 items-center bg-primary-100">
      <div className="mx-4 flex w-full items-center justify-between px-4">
        <div className="flex cursor-pointer items-center" onClick={goToRoot}>
          <Image
            className="h-16 w-16 rounded-full bg-background-100"
            src="/images/logo_transparent.svg"
            alt="VoiceVault Logo"
            height={64}
            width={64}
          />
          <h1 className="ml-4 text-3xl font-bold text-white">VoiceVault</h1>
        </div>

        <div className="absolute inset-x-0 z-20 mx-6 flex flex-col text-xl text-white duration-300 ease-in-out  dark:bg-gray-800 lg:relative lg:top-0 lg:mx-8 lg:mt-0 lg:flex lg:w-auto lg:translate-x-0 lg:flex-row lg:items-center lg:bg-transparent  lg:p-0 lg:opacity-100">
          <a
            href="home"
            className={`mx-3 mt-2 transform rounded-md px-3 py-2 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
              currentPage === "home" ? "underline font-bold" : ""
            }`}
          >
            My Mental Space
          </a>
          <a
            href="discussion"
            className={`mx-3 mt-2 transform rounded-md px-3 py-2 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
              currentPage === "discussion" ? "underline font-bold" : ""
            }`}
          >
            Discussions
          </a>
          <a
            href="challenges"
            className={`mx-3 mt-2 transform rounded-md px-3 py-2 transition-colors duration-300 dark:text-gray-200 lg:mt-0 ${
              currentPage === "challenges" ? "underline font-bold" : ""
            }`}
          >
            Challenges
          </a>
        </div>
        <div className="mx-4 mt-4 items-center first-letter:flex lg:mt-0">
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-16 w-16 overflow-hidden rounded-full bg-background-100"
                src={userImage}
                alt="User Image"
                height={64}
                width={64}
              />
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
    </nav>
  );
};

export default Navbar;
