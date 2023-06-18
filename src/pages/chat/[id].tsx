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
import { DonePage } from "~/components/chat";
import Navbar from "~/components/navbar";
import { AnimationLoader } from "~/components/loaders";

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
    return <AnimationLoader />;
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
    <div className="h-full w-full bg-background-100">
      <Navbar currentPage="discussion" />
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
            chatId={id}
            userId={session.data?.user.id ?? ""}
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
            chatId={id}
            userId={session.data?.user.id ?? ""}
            isCreator={isCreator}
            creator={creator}
            joiner={joiner}
            description={description}
            creatorSelectedTopic={creatorSelectedTopic}
            joinerSelectedTopic={joinerSelectedTopic}
          />
        ))
        .with(["DONE", true], () => (
          <DonePage chatId={id} userId={session.data?.user.id ?? ""} />
        ))
        .with(["DONE", false], () => (
          <DonePage chatId={id} userId={session.data?.user.id ?? ""} />
        ))
        .run()}
    </div>
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
      <div className="flex bg-background-100 px-10 py-20">
        <div className="w-3/12">
          <button
            className="mb-2 rounded-md bg-primary-100 px-4 py-2 text-white hover:opacity-80"
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
  const utils = api.useContext();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { mutate: startChat } = api.chat.startChat.useMutation({
    onSuccess: async () => {
      await utils.chat.invalidate();
    },
  });

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
      <div className="flex bg-background-100 px-10 py-20">
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
          <div className="mt-5 rounded-3xl p-4 text-black">Choose a side: </div>
          <div className="rounded-3xl p-4 text-black">Topic: {description}</div>
          <div
            className={`my-5 cursor-pointer rounded-lg p-4 ${
              isLeftSelected ? "bg-primary-100" : "bg-white"
            }`}
            onClick={selectLeftTopic}
          >
            <div className="flex items-center">
              <div className="text-lg font-medium">{leftTopic}</div>
            </div>
          </div>
          <div
            className={`my-5 cursor-pointer rounded-lg p-4 ${
              isRightSelected ? "bg-primary-100" : "bg-white"
            }`}
            onClick={selectRightTopic}
          >
            <div className="flex items-center">
              <div className="text-lg font-medium">{rightTopic}</div>
            </div>
          </div>
          <button
            disabled={selectedTopic === null}
            className="mb-2 rounded-md bg-primary-100 px-4 py-2 text-white"
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
  chatId: string;
  userId: string;
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
  chatId,
  userId,
  isCreator,
  creator,
  joiner,
  description,
  creatorSelectedTopic,
  joinerSelectedTopic,
}) => {
  const utils = api.useContext();
  const [message, setMessage] = useState<string>("");

  const { data: ifUserHasOffered, isLoading: isOfferLoading } =
    api.endRequest.getIfUserHasOffered.useQuery({
      userId,
      chatId,
    });

  const { data: pendingRequest, isLoading: isPendingRequestLoading } =
    api.endRequest.getPendingEndRequests.useQuery({
      userId,
      chatId,
    });

  const { data: chatMessages, isLoading: isMessagesLoading } =
    api.chat.getMessages.useQuery({
      id: chatId,
    });

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      setMessage("");
      await utils.chat.getMessages.invalidate({
        id: chatId,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: offerEndDiscussion } = api.endRequest.offer.useMutation({
    onSuccess: async () => {
      await utils.endRequest.getIfUserHasOffered.invalidate({
        userId,
        chatId,
      });
      await utils.endRequest.getPendingEndRequests.invalidate({
        userId,
        chatId,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: acceptEndDiscussion } = api.endRequest.answer.useMutation({
    onSuccess: async () => {
      await utils.endRequest.getIfUserHasOffered.invalidate({
        userId,
        chatId,
      });
      await utils.endRequest.getPendingEndRequests.invalidate({
        userId,
        chatId,
      });
      await utils.chat.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage({ id: chatId, message });
  };

  const acceptOrReject = (answer: "ACCEPTED" | "REJECTED") => {
    acceptEndDiscussion({
      answer,
      chatId,
      userId,
    });
  };

  const handleOfferEndDiscussion = () => {
    offerEndDiscussion({
      chatId,
      userId,
    });
  };

  if (isMessagesLoading || isOfferLoading || isPendingRequestLoading) {
    return <AnimationLoader />;
  }

  return (
    <>
      {chatMessages && ifUserHasOffered !== undefined && pendingRequest && (
        <div className="m-10 flex h-full flex-row items-center justify-center gap-5 bg-background-100">
          <div className="my-20 flex h-screen w-full max-w-5xl flex-col overflow-y-scroll rounded-lg bg-white shadow-xl">
            <div className="flex items-center bg-primary-300 px-10 py-5">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-profile-left">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-medium text-black">
                  {joiner?.name}
                </div>
              </div>
              <div className="mx-4 flex-1 text-center text-lg font-extrabold text-black">
                {description}
              </div>
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-profile-right">
                <UserCircleIcon className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-medium text-black">
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
                    color: "bg-primary-100 text-white",
                  }))
                  .with([true, "JOINER"], () => ({
                    position: "justify-start",
                    color: "bg-primary-300 text-black",
                  }))
                  .with([false, "CREATOR"], () => ({
                    position: "justify-start",
                    color: "bg-primary-300 text-black",
                  }))
                  .with([false, "JOINER"], () => ({
                    position: "justify-end",
                    color: "bg-primary-100 text-white",
                  }))
                  .exhaustive();

                return (
                  <div
                    key={chatMessage.id}
                    className={`mb-4 flex ${messagePattern.position}`}
                  >
                    <div
                      className={`${messagePattern.color} w-96 rounded-lg px-3 py-2`}
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
                  className="flex-grow rounded-md bg-gray-300 px-3 py-2 text-black outline-none focus:ring-1 focus:ring-primary-100"
                  placeholder={`This chat has ${
                    MESSAGE_LIMIT - chatMessages.length
                  } messages left.`}
                />
                <button
                  type="submit"
                  className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-white disabled:opacity-50"
                  disabled={message.length === 0}
                  onClick={handleSendMessage}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex h-screen flex-col items-center rounded-lg bg-primary-300 px-5 py-10">
            <div className="mb-4 w-full rounded-lg border bg-white p-4">
              <div className="flex h-full flex-row gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-profile-left">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-bold">{joinerSelectedTopic}</div>
                  <div className="text-sm">{joiner?.name ?? "N/A"}</div>
                </div>
              </div>
            </div>

            <div className="mb-4 w-full rounded-lg border bg-white p-4">
              <div className="flex h-full flex-row gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-profile-right">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-bold">
                    {creatorSelectedTopic}
                  </div>
                  <div className="text-sm">{creator.name}</div>
                </div>
              </div>
            </div>

            {pendingRequest.length > 0 && (
              <div className="mb-4 flex flex-row justify-center rounded-lg border bg-white p-4">
                <div className="text-sm text-gray-500">
                  You have a pending request to end the discussion
                </div>
                <div className="mr-2">
                  <button
                    className="rounded-md bg-green-500 px-4 py-2 text-white hover:opacity-80"
                    onClick={() => acceptOrReject("ACCEPTED")}
                  >
                    Accept
                  </button>
                </div>
                <div className="ml-2">
                  <button
                    className="rounded-md bg-red-500 px-4 py-2 text-white hover:opacity-80"
                    onClick={() => acceptOrReject("REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              {!ifUserHasOffered && (
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-white hover:opacity-80"
                  onClick={handleOfferEndDiscussion}
                >
                  Offer End Discussion
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default withAuth(Chat);
