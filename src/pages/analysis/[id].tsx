import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { withAuth } from "~/middlewares";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Modal, MiniModal } from "~/components/modals";
import Navbar from "~/components/navbar/Navbar";
import { match } from "ts-pattern";

import type { FC } from "react";
import type { User, MessageType, Message } from "@prisma/client";
import type { NextPage } from "next";

const AnalysisPage: NextPage = () => {
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
    creator,
    joiner,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatMessage, setSelectedChatMessage] =
    useState<Message | null>(null);

  const openModal = (chatMessage: Message) => {
    setSelectedChatMessage(chatMessage);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { data: chatAnalysis, isLoading: isChatAnalysisLoading } =
    api.analysis.getChatAnalysis.useQuery({
      id: chatId,
    });
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

  if (
    isMessagesLoading ||
    isOfferLoading ||
    isPendingRequestLoading ||
    isChatAnalysisLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar currentPage="analysis" />
      {chatMessages &&
        ifUserHasOffered !== undefined &&
        pendingRequest &&
        chatAnalysis && (
          <div className="m-10 flex h-screen flex-row items-center justify-center gap-5">
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
                      onClick={() => openModal(chatMessage)}
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
            </div>
            <div className="flex h-screen flex-col items-center rounded-lg bg-primary-300 px-5 py-10">
              <div className="mb-4 w-full rounded-lg border bg-white p-4">
                <div className="flex h-full flex-row gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-profile-left">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold">
                      {joinerSelectedTopic}
                    </div>
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

              <Modal description={chatAnalysis.analysis ?? ""} />
            </div>
          </div>
        )}
      {isModalOpen && (
        <>
          <MiniModal
            chatMessage={selectedChatMessage?.analysis ?? "No analysis yet."}
            closeModal={closeModal}
          />
        </>
      )}
      <Toaster />
    </>
  );
};

export default withAuth(AnalysisPage);
