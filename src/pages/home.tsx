import {
  PencilIcon,
  CalendarDaysIcon,
  InboxIcon,
  BookmarkSquareIcon,
  CloudIcon,
  PaperAirplaneIcon,
  ChatBubbleBottomCenterIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getFirstDayOfWeek, getLastDayOfWeek } from "~/helpers/dates";
import { withAuth } from "~/middlewares";
import { api } from "~/utils/api";
import Navbar from "~/components/navbar";
import { Loader } from "~/components/loaders";
import toast, { Toaster } from "react-hot-toast";
import quotes from "~/utils/quotes";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();

  const { data: userDetails, refetch: refetchUserDetails } =
    api.user.getUserDetails.useQuery();
  const { mutate: generateWeeklyReports, isLoading: isGeneratingReports } =
    api.journal.generateWeeklyReports.useMutation({
      onSuccess: async () => {
        await refetchUserDetails();
        toast.success("Weekly Report Generated!");
      },
    });

  const handleGenerateWeeklyReports = () => {
    generateWeeklyReports();
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <>
      <div className="bg-background-100">
        <Navbar currentPage="home" />
        <div className="px-20 py-10">
          <h1 className="text-3xl font-bold text-black">
            What&apos;s on your mind, Hans?
          </h1>

          <div className="mt-10 grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col justify-center gap-20 text-black">
              <PencilIcon className="w-3h-36 h-36" />
              <div className="rounded-lg bg-white p-5">
                <div className="flex flex-col gap-5">
                  <div>{randomQuote}</div>
                </div>
              </div>
            </div>
            <div className="col-span-8 flex flex-col gap-10 text-black">
              <div className="flex flex-row gap-5">
                <CalendarDaysIcon className="h-10 w-10 text-black" />
                <h2
                  className="my-auto"
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  The week&apos;s summary ({firstDayOfWeek} - {lastDayOfWeek})
                </h2>
              </div>
              <div>{userDetails.weeklyReport ?? "No Weekly Report Yet!!!"}</div>
              <button
                className="max-w-xs flex-none rounded-lg bg-secondary-100 px-5 py-2 font-semibold text-black hover:opacity-80"
                onClick={handleGenerateWeeklyReports}
              >
                {isGeneratingReports && <Loader />}
                Generate Weekly Report
              </button>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-row gap-10">
                  <InboxIcon className="h-10 w-10" />
                  <Link href="/mind-dump">
                    <button className="rounded-lg bg-secondary-100 px-5 py-2 font-semibold text-black hover:opacity-80">
                      Mind Dump Here
                    </button>
                  </Link>
                </div>
                <div className="flex flex-row gap-10">
                  <ChatBubbleBottomCenterIcon className="h-10 w-10" />
                  <Link href="/chat">
                    <button className="rounded-lg bg-secondary-100 px-5 py-2 font-semibold text-black hover:opacity-80">
                      Talk with Vivi
                    </button>
                  </Link>
                </div>
                <div className="flex flex-row gap-10">
                  <PaperAirplaneIcon className="h-10 w-10" />
                  <Link href="/rants">
                    <button className="rounded-lg bg-secondary-100 px-5 py-2 font-semibold text-black hover:opacity-80">
                      Unleash Your Rants
                    </button>
                  </Link>
                </div>
                <div className="flex flex-row gap-10">
                  <MagnifyingGlassCircleIcon className="h-10 w-10" />
                  <Link href="/ideas">
                    <button className="rounded-lg bg-secondary-100 px-5 py-2 font-semibold text-black hover:opacity-80">
                      Search Your Ideas
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-row gap-5">
                <BookmarkSquareIcon className="h-10 w-10" />
                <h3 className="my-auto font-semibold">Latest Debates</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                    <CloudIcon className="h-10 w-10" />
                    <h5 className="my-auto ">Long Quiz Chemistry</h5>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                    <CloudIcon className="h-10 w-10" />
                    <h5 className="my-auto">Long Quiz Chemistry</h5>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                    <CloudIcon className="h-10 w-10" />
                    <h5 className="my-auto">Long Quiz Chemistry</h5>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                    <CloudIcon className="h-10 w-10" />
                    <h5 className="my-auto">Long Quiz Chemistry</h5>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                    <CloudIcon className="h-10 w-10" />
                    <h5 className="my-auto">Long Quiz Chemistry</h5>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                    <CloudIcon className="h-10 w-10" />
                    <h5 className="my-auto">Long Quiz Chemistry</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default withAuth(Home);
