import {
  PencilIcon,
  CalendarDaysIcon,
  InboxIcon,
  BookmarkSquareIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getFirstDayOfWeek, getLastDayOfWeek } from "~/helpers/dates";
import { withAuth } from "~/middlewares";
import Navbar from "~/components/navbar";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();

  return (
    <div className="h-screen w-screen bg-background-100 absolute top-0">
      <Navbar currentPage="home" />
      <div className="px-20 py-10">
        <h1 className="text-3xl font-bold text-white">
          What&apos;s on your mind, Hans?
        </h1>

        <div className="mt-10 grid grid-cols-12 gap-4">
          <div className="col-span-4 flex flex-col justify-center gap-20 text-white">
            <PencilIcon className="w-3h-36 h-36" />
            <div className="flex flex-col gap-5">
              <div>Your takes on:</div>
              <ul className="ml-10 list-none">
                <li>Chemistry</li>
                <li>Physics</li>
                <li>Math</li>
                <li>English</li>
                <li>History</li>
              </ul>
            </div>
          </div>
          <div className="col-span-8 flex flex-col gap-10 text-white">
            <div className="flex flex-row gap-5">
              <CalendarDaysIcon className="h-10 w-10" />
              <h3 className="my-auto">
                The week&apos;s summary ({firstDayOfWeek} - {lastDayOfWeek})
              </h3>
            </div>
            <div>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni
              sint nesciunt, obcaecati unde reprehenderit sapiente quis aliquam
              optio placeat nulla asperiores deserunt sed eligendi fuga ullam
              commodi soluta rerum non!
            </div>
            <div className="flex flex-row gap-10">
              <InboxIcon className="h-10 w-10" />
              <Link href="/mind-dump">
                <button className="rounded-lg bg-secondary-100 px-5 py-2 font-semibold text-black hover:opacity-80">
                  Mind Dump Here
                </button>
              </Link>
            </div>
            <div className="flex flex-row gap-5">
              <BookmarkSquareIcon className="h-10 w-10" />
              <h3 className="my-auto">Latest thoughts</h3>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-1">
                <div className="flex w-56 cursor-pointer flex-row gap-3 bg-primary-200 px-4 py-2 hover:opacity-50">
                  <CloudIcon className="h-10 w-10" />
                  <h5 className="my-auto">Long Quiz Chemistry</h5>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex w-56 cursor-pointer flex-row gap-3 bg-primary-200 px-4 py-2 hover:opacity-50">
                  <CloudIcon className="h-10 w-10" />
                  <h5 className="my-auto">Long Quiz Chemistry</h5>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex w-56 cursor-pointer flex-row gap-3 bg-primary-200 px-4 py-2 hover:opacity-50">
                  <CloudIcon className="h-10 w-10" />
                  <h5 className="my-auto">Long Quiz Chemistry</h5>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex w-56 cursor-pointer flex-row gap-3 bg-primary-200 px-4 py-2 hover:opacity-50">
                  <CloudIcon className="h-10 w-10" />
                  <h5 className="my-auto">Long Quiz Chemistry</h5>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex w-56 cursor-pointer flex-row gap-3 bg-primary-200 px-4 py-2 hover:opacity-50">
                  <CloudIcon className="h-10 w-10" />
                  <h5 className="my-auto">Long Quiz Chemistry</h5>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex w-56 cursor-pointer flex-row gap-3 bg-primary-200 px-4 py-2 hover:opacity-50">
                  <CloudIcon className="h-10 w-10" />
                  <h5 className="my-auto">Long Quiz Chemistry</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Home);
