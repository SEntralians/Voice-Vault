import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { withAuth } from "~/middlewares";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Modal, MiniModal } from "~/components/modals";
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
      {chatMessages &&
        ifUserHasOffered !== undefined &&
        pendingRequest &&
        chatAnalysis && (
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
                      onClick={() => openModal(chatMessage)}
                    >
                      <div
                        className={`${messagePattern.color} w-96 cursor-pointer rounded-lg px-3 py-2 text-white`}
                      >
                        {chatMessage.text}
                      </div>
                    </div>
                  );
                })}
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

              {/*  eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <Modal description={chatAnalysis.analysis ?? ""} />
            </div>
          </div>
        )}
      {isModalOpen && (
        <>
          <MiniModal
            chatMessage={{
              id: selectedChatMessage?.id ?? "",
              text: `${selectedChatMessage?.fallacyPrediction ?? ""} - ${
                selectedChatMessage?.fallacyScore ?? ""
              }   ${selectedChatMessage?.toxicityPrediction ?? ""} - ${
                selectedChatMessage?.toxicityScore ?? ""
              }`,
            }}
            closeModal={closeModal}
          />
        </>
      )}
      <Toaster />
    </>
  );
};

export default withAuth(AnalysisPage);
