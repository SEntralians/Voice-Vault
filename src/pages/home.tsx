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
import { AnimationLoader } from "~/components/loaders";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";
import { getFirstDayOfWeek, getLastDayOfWeek } from "~/helpers/dates";
import { withAuth } from "~/middlewares";
import { api } from "~/utils/api";
import Navbar from "~/components/navbar";
import { Loader } from "~/components/loaders";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import quotes from "~/utils/quotes";

import type { NextPage } from "next";
import type { RouterOutputs } from "~/utils/api";

type Chat = RouterOutputs["chat"]["getChats"][number];

const Home: NextPage = () => {
  const router = useRouter();
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { data: userChats } = api.chat.getChats.useQuery();
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToChat = (chatId: string) => () =>
    void router.push(`/chat/${chatId}`);

  const openModal = (chat: Chat) => () => {
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  if (!userDetails || !userChats) {
    return <AnimationLoader />;
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
                      Serch Your Ideas
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-row gap-5">
                <BookmarkSquareIcon className="h-10 w-10" />
                <h3 className="my-auto font-semibold">Latest Debates</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {userChats.map((chat) => (
                  <div
                    className="col-span-1"
                    key={chat.id}
                    onClick={openModal(chat)}
                  >
                    <div className="flex w-56 cursor-pointer flex-row gap-3 rounded-md bg-secondary-100 px-4 py-2 hover:opacity-50">
                      <CloudIcon className="h-10 w-10" />
                      <h5 className="my-auto">{chat.description}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-5 text-xl font-bold leading-6 text-gray-900"
                  >
                    Chat Details
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <p className="text-sm text-gray-500">
                      Topic: {selectedChat?.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Chat Creator: {selectedChat?.creator.name} - Topic:{" "}
                      {selectedChat?.creatorSelectedTopic}
                    </p>
                    <p className="text-sm text-gray-500">
                      Chat Joiner: {selectedChat?.joiner?.name} - Topic:{" "}
                      {selectedChat?.joinerSelectedTopic}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-400 px-4 py-2 text-sm font-medium text-white hover:bg-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2"
                      onClick={goToChat(selectedChat?.id ?? "")}
                    >
                      Go to Chat
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default withAuth(Home);
