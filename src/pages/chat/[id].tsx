import { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { withAuth } from "~/middlewares";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";

import type { ChangeEvent, FormEvent } from "react";
import type { User } from "@prisma/client";
import type { NextPage } from "next";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
}

const Chat: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: chat, isLoading: isChatLoading } = api.chat.getChat.useQuery({
    id: typeof id === "string" ? id : "",
  });

  if (!chat) {
    return <div>Loading...</div>;
  }

  const { status, creator, joiner, leftTopic, rightTopic, description } = chat;

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();

    if (message.trim() !== "") {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: "user",
      };

      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  if (typeof id !== "string") {
    return <div>Invalid Chat</div>;
  }

  return (
    <CreatorChatBox
      id={id}
      creator={creator}
      joiner={joiner}
      leftTopic={leftTopic}
      rightTopic={rightTopic}
      description={description}
    />

    // <div className="flex h-screen flex-col items-center justify-center bg-primary-100">
    //   <div className="my-20 flex h-screen w-full max-w-5xl flex-col rounded-lg bg-gray-900 shadow-xl">
    //     <div className="border-b p-4">
    //       <h1 className="text-2xl font-bold text-white">Messenger</h1>
    //     </div>
    //     <div className="flex flex-grow flex-col overflow-y-auto p-4">
    //       {messages.map((message) => (
    //         <div
    //           key={message.id}
    //           className={`mb-4 flex ${
    //             message.sender === "user" ? "justify-end" : ""
    //           }`}
    //         >
    //           <div
    //             className={`${
    //               message.sender === "user" ? "bg-blue-500" : "bg-gray-700"
    //             } max-w-2/3 rounded-lg px-3 py-2 text-white`}
    //           >
    //             {message.text}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //     <form className="p-4" onSubmit={handleSendMessage}>
    //       <div className="flex items-center">
    //         <input
    //           type="text"
    //           value={message}
    //           onChange={handleMessageChange}
    //           className="flex-grow rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
    //           placeholder="Type your message..."
    //         />
    //         <button
    //           type="submit"
    //           className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-50"
    //           disabled={!message}
    //         >
    //           <PaperAirplaneIcon className="h-5 w-5" />
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

interface CreatorChatBoxProps {
  id: string;
  creator: User;
  joiner: User | null;
  leftTopic: string;
  rightTopic: string;
  description: string;
}

const CreatorChatBox: React.FC<CreatorChatBoxProps> = ({
  id,
  creator,
  joiner,
  leftTopic,
  rightTopic,
  description,
}) => {
  const peopleCount = joiner ? 2 : 1;

  const copyCode = () => {
    const text = `This is a debate room about ${leftTopic} vs ${rightTopic} with description ${description} created by ${
      creator.name ?? "N/A"
    }.\n\nJoin the debate here: ${id}`;

    void navigator.clipboard.writeText(text);
    toast.success("Code copied!");
  };

  return (
    <>
      <div className="flex px-10 py-20">
        <div className="w-3/12">
          <button
            className="mb-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:opacity-80"
            onClick={copyCode}
          >
            Share
          </button>
          <div className="my-5 rounded-lg border border-white bg-white p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-500" />
              <div className="ml-4 text-lg font-medium">
                {creator.name} - Creator
              </div>
            </div>
          </div>
          {joiner && (
            <div className="my-5 rounded-lg border border-white bg-white p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-500" />
                <div className="ml-4 text-lg font-medium">
                  {joiner.name} - Joiner
                </div>
              </div>
            </div>
          )}
          <div className="my-5 rounded-lg border border-white bg-white p-4">
            <div className="flex items-center">
              <UserGroupIcon className="mr-2 h-6 w-6 text-gray-500" />
              <div className="text-lg font-medium">{peopleCount}</div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex h-96 w-9/12 justify-center rounded-lg border border-white bg-white p-4">
          <div className="my-auto text-center text-gray-500">
            Waiting for another person...
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default withAuth(Chat);
