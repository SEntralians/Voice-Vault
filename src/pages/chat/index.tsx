import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { withAuth } from "~/middlewares";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import type { NextPage } from "next";
import Navbar from "~/components/navbar/Navbar";
import { AnimationLoader } from "~/components/loaders";

const AIChatPage: NextPage = () => {
  const utils = api.useContext();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [temporaryMessage, setTemporaryMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const { data: conversations } = api.aiChat.getAiConversations.useQuery();
  const { mutate: postMessage } = api.aiChat.chatAi.useMutation({
    onSuccess: () => {
      setIsTyping(false);
      setTemporaryMessage(null);
      void utils.aiChat.getAiConversations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onMutate: (newMessage) => {
      setIsTyping(true);
      setMessage("");
      setTemporaryMessage(newMessage.userInput);
    },
  });

  const handleUserInput = () => {
    postMessage({ userInput: message });
  };

  if (!conversations) {
    return <AnimationLoader />;
  }

  return (
    <>
      <body className="top-0 bg-background-100">
        <Navbar currentPage="chat" />
        <div className="flex h-screen flex-row items-center justify-center gap-5">
          <div className="flex h-screen w-full max-w-5xl flex-col overflow-y-scroll rounded-lg bg-white shadow-lg">
            <div className="flex items-center bg-background-100 px-10 py-5"></div>

            <div className="flex flex-grow flex-col overflow-y-auto bg-background-100 p-4">
              <div className="mb-4 flex justify-start">
                <div className="w-full max-w-lg rounded-lg bg-gray-100 px-6 py-4 font-semibold text-gray-800">
                  Hey Hans! How was your day? Did something interesting happen
                  today? Tell me!
                </div>
              </div>
              {conversations.map((conversation) => {
                return (
                  <>
                    <div
                      key={`${conversation.id}_user`}
                      className="mb-4 flex justify-end"
                    >
                      <div className="text-primary-800 w-full max-w-lg rounded-lg  bg-green-500 px-6 py-4">
                        {conversation.userInput}
                      </div>
                    </div>
                    <div
                      key={`${conversation.id}_ai`}
                      className="mb-4 flex justify-start"
                    >
                      <div className="w-full max-w-lg rounded-lg bg-gray-100 px-6 py-4 text-gray-800">
                        {conversation.aiReply}
                      </div>
                    </div>
                  </>
                );
              })}
              {temporaryMessage && (
                <div className="mb-4 flex justify-end">
                  <div className="text-primary-800 w-full max-w-lg rounded-lg bg-green-500 px-6 py-4">
                    {temporaryMessage}
                  </div>
                </div>
              )}
              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="w-full max-w-lg rounded-lg bg-gray-100 px-6 py-4 text-gray-800">
                    <div className="animate-pulse">Vivi is typing...</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-background-100 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  className="focus:ring-primary-500 flex-grow rounded-md bg-gray-200 px-3 py-2 text-gray-800 outline-none focus:ring-1"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white disabled:opacity-50"
                  disabled={message.length === 0}
                  onClick={handleUserInput}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </body>
    </>
  );
};

export default withAuth(AIChatPage);
