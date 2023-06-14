import { useState } from "react";
import {
  UserGroupIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { withAuth } from "~/middlewares";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { match } from "ts-pattern";
import { MESSAGE_LIMIT } from "~/constants";
import Navbar from "~/components/Navbar";

import type { ChangeEvent, FC } from "react";
import type { User, ChatStatus, MessageType } from "@prisma/client";
import type { NextPage } from "next";

const Chat: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const { id } = router.query;

  const { data: chat } = api.chat.getChat.useQuery({
    id: typeof id === "string" ? id : "",
  });

  if (!chat) {
    return <div>Loading...</div>;
  }

  const {
    status,
    creator,
    joiner,
    leftTopic,
    rightTopic,
    description,
    creatorSelectedTopic,
    joinerSelectedTopic,
  } = chat;

  const isCreator = creator.id === session.data?.user.id;

  if (typeof id !== "string") {
    return <div>Invalid Chat</div>;
  }

  return (
    <>
      {match<[ChatStatus, boolean]>([status, isCreator])
        .with(["PENDING", true], () => (
          <CreatorChatBox
            id={id}
            creator={creator}
            joiner={joiner}
            leftTopic={leftTopic}
            rightTopic={rightTopic}
            description={description}
            status={status}
          />
        ))
        .with(["ACCEPTED", true], () => (
          <CreatorChatBox
            id={id}
            creator={creator}
            joiner={joiner}
            leftTopic={leftTopic}
            rightTopic={rightTopic}
            description={description}
            status={status}
          />
        ))
        .with(["ACCEPTED", false], () => (
          <JoinerChatBox
            id={id}
            creator={creator}
            joiner={joiner}
            leftTopic={leftTopic}
            rightTopic={rightTopic}
            description={description}
          />
        ))
        .with(["ON_GOING", true], () => (
          <ChatMessage
            id={id}
            isCreator={isCreator}
            creator={creator}
            joiner={joiner}
            description={description}
            creatorSelectedTopic={creatorSelectedTopic}
            joinerSelectedTopic={joinerSelectedTopic}
          />
        ))
        .with(["ON_GOING", false], () => (
          <ChatMessage
            id={id}
            isCreator={isCreator}
            creator={creator}
            joiner={joiner}
            description={description}
            creatorSelectedTopic={creatorSelectedTopic}
            joinerSelectedTopic={joinerSelectedTopic}
          />
        ))
        .with(["DONE", true], () => <>Done - isCreator</>)
        .with(["DONE", false], () => <>Done - isJoiner</>)
        .run()}
    </>
  );
};

interface CreatorChatBoxProps {
  id: string;
  creator: User;
  joiner: User | null;
  leftTopic: string;
  rightTopic: string;
  description: string;
  status: ChatStatus;
}

const CreatorChatBox: FC<CreatorChatBoxProps> = ({
  id,
  creator,
  joiner,
  leftTopic,
  rightTopic,
  description,
  status,
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
      <Navbar currentPage={"discussion"} />
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
            {/* Waiting for another person... */}
            {match(status)
              .with("PENDING", () => "Waiting for another person...")
              .with("ACCEPTED", () => "Waiting for person to accept")
              .run()}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

interface JoinerChatBoxProps {
  id: string;
  creator: User;
  joiner: User | null;
  leftTopic: string;
  rightTopic: string;
  description: string;
}

const JoinerChatBox: FC<JoinerChatBoxProps> = ({
  id,
  creator,
  joiner,
  leftTopic,
  rightTopic,
  description,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { mutate: startChat } = api.chat.startChat.useMutation();

  const handleStartChat = () => {
    if (selectedTopic === null) {
      return;
    }

    startChat({
      id,
      joinerSelectedTopic: selectedTopic,
    });
  };

  const selectLeftTopic = () => {
    setSelectedTopic(leftTopic);
  };

  const selectRightTopic = () => {
    setSelectedTopic(rightTopic);
  };

  const isLeftSelected = selectedTopic === leftTopic;
  const isRightSelected = selectedTopic === rightTopic;

  const peopleCount = joiner ? 2 : 1;

  return (
    <>
      <div className="flex px-10 py-20">
        <div className="w-3/12">
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
          {/* text for choose a top */}
          <div className="mt-5 rounded-3xl p-4 text-white">Choose a side: </div>
          <div className="rounded-3xl p-4 text-white">
            Description: {description}
          </div>
          <div
            className={`my-5 cursor-pointer rounded-lg bg-white p-4 ${
              isLeftSelected ? "bg-white/40" : ""
            }`}
            onClick={selectLeftTopic}
          >
            <div className="flex items-center">
              <div className="text-lg font-medium">{leftTopic}</div>
            </div>
          </div>
          <div
            className={`my-5 cursor-pointer rounded-lg bg-white p-4 ${
              isRightSelected ? "bg-white/40" : ""
            }`}
            onClick={selectRightTopic}
          >
            <div className="flex items-center">
              <div className="text-lg font-medium">{rightTopic}</div>
            </div>
          </div>
          <button
            disabled={selectedTopic === null}
            className="mb-2 rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={handleStartChat}
          >
            Join
          </button>
        </div>

        <div className="ml-4 flex h-96 w-9/12 justify-center rounded-lg border border-white bg-white p-4">
          <div className="my-auto text-center text-gray-500">
            Waiting for you to join
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

interface ChatMessageProps {
  id: string;
  isCreator: boolean;
  creator: User;
  joiner: User | null;
  description: string;
  creatorSelectedTopic?: string | null;
  joinerSelectedTopic?: string | null;
}

type MessageDetails = {
  position: string;
  color: string;
};

const ChatMessage: FC<ChatMessageProps> = ({
  id,
  isCreator,
  creator,
  joiner,
  description,
  creatorSelectedTopic,
  joinerSelectedTopic,
}) => {
  const utils = api.useContext();

  const [message, setMessage] = useState<string>("");

  const { data: chatMessages, isLoading: isMessagesLoading } =
    api.chat.getMessages.useQuery({
      id,
    });
  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      setMessage("");
      await utils.chat.getMessages.invalidate({ id });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage({ id, message });
  };

  if (isMessagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {chatMessages && (
        <div className="m-10 flex h-screen flex-row items-center justify-center gap-5 bg-primary-100">
          <div className="my-20 flex h-screen w-full max-w-5xl flex-col overflow-y-scroll rounded-lg bg-gray-900 shadow-xl">
            <div className="flex items-center bg-primary-200 px-10 py-5">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-medium text-white">
                  {joiner?.name}
                </div>
              </div>
              <div className="mx-4 flex-1 text-center text-lg font-medium text-white">
                {description}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                <UserCircleIcon className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-medium text-white">
                {creator.name}
              </div>
            </div>

            <div className="flex flex-grow flex-col overflow-y-auto p-4">
              {chatMessages.map((chatMessage) => {
                const messagePattern = match<
                  [boolean, MessageType],
                  MessageDetails
                >([isCreator, chatMessage.type])
                  .with([true, "CREATOR"], () => ({
                    position: "justify-end",
                    color: "bg-blue-500",
                  }))
                  .with([true, "JOINER"], () => ({
                    position: "justify-start",
                    color: "bg-gray-700",
                  }))
                  .with([false, "CREATOR"], () => ({
                    position: "justify-start",
                    color: "bg-gray-700",
                  }))
                  .with([false, "JOINER"], () => ({
                    position: "justify-end",
                    color: "bg-blue-500",
                  }))
                  .exhaustive();

                return (
                  <div
                    key={chatMessage.id}
                    className={`mb-4 flex ${messagePattern.position}`}
                  >
                    <div
                      className={`${messagePattern.color} max-w-2/3 rounded-lg px-3 py-2 text-white`}
                    >
                      {chatMessage.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  className="flex-grow rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`This chat has ${
                    MESSAGE_LIMIT - chatMessages.length
                  } messages left.`}
                />
                <button
                  type="submit"
                  className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-50"
                  disabled={message.length === 0}
                  onClick={handleSendMessage}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex h-screen flex-col items-center rounded-lg bg-gray-900 p-10">
            <div className="mb-4 rounded-lg border bg-white p-4">
              <div className="mb-2 rounded-lg border p-2">
                <div className="text-sm text-gray-500">
                  Joiner Selected Topic
                </div>
              </div>
              <div className="flex h-full items-center justify-center">
                <div className="mb-5 text-2xl font-bold text-blue-500">
                  {joinerSelectedTopic}
                </div>
              </div>
            </div>

            <div className="mb-4 rounded-lg border bg-white p-4">
              <div className="mb-2 rounded-lg border p-2">
                <div className="text-sm text-gray-500">
                  Creator Selected Topic
                </div>
              </div>
              <div className="flex h-full items-center justify-center">
                <div className="mb-5 text-2xl font-bold text-red-500">
                  {creatorSelectedTopic}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="rounded-md bg-red-500 px-4 py-2 text-white">
                End Discussion
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default withAuth(Chat);
