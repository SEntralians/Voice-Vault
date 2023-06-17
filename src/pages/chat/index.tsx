import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { withAuth } from "~/middlewares";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import type { NextPage } from "next";

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
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="m-10 flex h-screen flex-row items-center justify-center gap-5 bg-primary-100">
        <div className="my-20 flex h-screen w-full max-w-5xl flex-col overflow-y-scroll rounded-lg bg-gray-900 shadow-xl">
          <div className="flex items-center bg-primary-200 px-10 py-5">
            <div className="mx-4 flex-1 text-center text-lg font-medium text-white">
              Therapy Chat Bot
            </div>
          </div>

          <div className="flex flex-grow flex-col overflow-y-auto p-4">
            {conversations.map((conversation) => {
              return (
                <>
                  <div key={conversation.id} className="mb-4 flex justify-end">
                    <div className="w-96 rounded-lg bg-blue-500 px-3 py-2 text-white">
                      {conversation.userInput}
                    </div>
                  </div>
                  <div
                    key={conversation.id}
                    className="mb-4 flex justify-start"
                  >
                    <div className="w-96 rounded-lg bg-gray-700 px-3 py-2 text-white">
                      {conversation.aiReply}
                    </div>
                  </div>
                </>
              );
            })}
            {temporaryMessage && (
              <div className="mb-4 flex justify-end">
                <div className="w-96 rounded-lg bg-blue-500 px-3 py-2 text-white">
                  {temporaryMessage}
                </div>
              </div>
            )}
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-lg bg-gray-700 px-3 py-2 text-white">
                  <div className="animate-pulse">Vivi is typing...</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                className="flex-grow rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-50"
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
    </>
  );
};

export default withAuth(AIChatPage);
