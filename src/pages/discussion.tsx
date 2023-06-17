/* eslint-disable @typescript-eslint/no-misused-promises */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "~/components/navbar";
import PostFilter from "~/components/forum/elements-select-option";
import Post from "~/components/forum/elements-discussion-post";
import Pagination from "~/components/forum/elements-page-options";
import Advertisement from "~/components/forum/sections-advertisement";
import Topics from "~/components/forum/sections-topics-list";
import { posts } from "~/data/forum";

import toast, { Toaster } from "react-hot-toast";

type FormData = {
  leftTopic: string;
  rightTopic: string;
  description: string;
};

const DiscussionsPage: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");

  const { mutate: createChat } = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      const { id } = data;
      reset({
        leftTopic: "",
        rightTopic: "",
        description: "",
      });
      toast.success("Chat created!");
      setTimeout(() => {
        void router.push(`/chat/${id}`);
      }, 2000);
    },
  });

  const { mutate: joinChat } = api.chat.joinChat.useMutation({
    onSuccess: (data) => {
      const { id } = data;
      toast.success("Chat joined!");
      void router.push(`/chat/${id}`);
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset,
  } = useForm<FormData>();

  const handleCreateChat = handleSubmitCreate((data) => {
    createChat(data);
  });

  const handleJoinChat = () => {
    joinChat({ id: roomId });
  };

  return (
    <div>
      <Navbar currentPage="discussion" />

      <div className="flex h-screen flex-col ">
        <div className="font-roboto bg-background-100">
          <div className="px-6 py-8">
            <div className="container mx-auto flex justify-between">
              <div className="w-full lg:w-8/12">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-700 md:text-2xl">
                    Post
                  </h1>
                  <PostFilter />
                </div>
                <div className="mt-6">
                  {posts.map((post) => (
                    <div className="mt-6" key={post.id}>
                      <Post data={post} />
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination />
                </div>
              </div>
              <div className="-mx-8 hidden w-4/12 lg:block">
                <div className="mt-10 px-8">
                  <h1 className="mb-4 text-xl font-bold text-gray-700">
                    Topics
                  </h1>
                  <Topics />
                </div>
                <div className="mt-10 px-8">
                  <h1 className="mb-4 text-xl font-bold text-gray-700">
                    Advertisement
                  </h1>
                  <Advertisement data={[]} />
                </div>
                <div className="mt-10">
                  <h1 className="mb-4 ml-10 text-xl font-bold text-gray-700">
                    Debate
                  </h1>
                  <div className="mx-auto max-w-sm">
                    <div className="rounded-lg bg-white shadow-md">
                      <div className="flex items-center justify-center">
                        <div className="w-full">
                          <div className="p-8">
                            <form onSubmit={handleCreateChat}>
                              <div className="mb-4">
                                <input
                                  type="text"
                                  {...registerCreate("leftTopic")}
                                  className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
                                  placeholder="Enter left topic"
                                />
                              </div>
                              <div className="mb-4">
                                <input
                                  type="text"
                                  {...registerCreate("rightTopic")}
                                  className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
                                  placeholder="Enter right topic"
                                />
                              </div>
                              <div className="mb-4">
                                <textarea
                                  {...registerCreate("description")}
                                  className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
                                  placeholder="Enter description"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              >
                                Create Chat
                              </button>
                            </form>
                          </div>
                          <div className="rounded-b-lg bg-blue-500 px-8 py-4">
                            <h1 className="mb-4 text-lg font-bold text-white">
                              Join Room
                            </h1>
                            <div className="mb-4">
                              <input
                                type="text"
                                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
                                placeholder="Enter room id"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                              />
                            </div>
                            <button
                              onClick={handleJoinChat}
                              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                              Join Room
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default DiscussionsPage;
