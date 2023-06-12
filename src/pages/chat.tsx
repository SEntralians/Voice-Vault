import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { withAuth } from "~/middlewares";

import type { ChangeEvent, FormEvent } from "react";
import type { NextPage } from "next";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
}

const Chat: NextPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

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

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-primary-100">
      <div className="my-20 flex h-screen w-full max-w-5xl flex-col rounded-lg bg-gray-900 shadow-xl">
        <div className="border-b p-4">
          <h1 className="text-2xl font-bold text-white">Messenger</h1>
        </div>
        <div className="flex flex-grow flex-col overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              <div
                className={`${
                  message.sender === "user" ? "bg-blue-500" : "bg-gray-700"
                } max-w-2/3 rounded-lg px-3 py-2 text-white`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form className="p-4" onSubmit={handleSendMessage}>
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="flex-grow rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-50"
              disabled={!message}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(Chat);
