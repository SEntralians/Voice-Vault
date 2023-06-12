/* eslint-disable @typescript-eslint/no-misused-promises */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

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
      setTimeout(() => {
        void router.push(`/chat/${id}`);
      }, 2000);
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
    <>
      <div className="flex h-screen">
        <div className="w-4/12 rounded-l-lg border-r py-4">
          <div className="h-1/2 rounded-t-lg border-b px-8 pb-4">
            <h1 className="mb-4 text-lg font-bold text-white">Create Chat</h1>
            <form onSubmit={handleCreateChat}>
              <div className="mb-4 flex">
                <input
                  type="text"
                  {...registerCreate("leftTopic")}
                  className="w-1/2 rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter left topic"
                />
                <input
                  type="text"
                  {...registerCreate("rightTopic")}
                  className="w-1/2 rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
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
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:opacity-80"
              >
                Create Chat
              </button>
            </form>
          </div>
          <div className="h-1/2 rounded-b-lg border-t px-8 pt-4">
            <h1 className="mb-4 text-lg font-bold text-white">Join Room</h1>
            <div className="mb-4">
              <input
                type="text"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-blue-500"
                placeholder="Enter room id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />

              <button
                onClick={handleJoinChat}
                className="mt-5 rounded-md bg-blue-500 px-4 py-2 text-white hover:opacity-80"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
      <Toaster />
    </>
  );
};

export default DiscussionsPage;
