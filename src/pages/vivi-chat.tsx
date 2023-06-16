import React, { useState } from "react";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const ChatGPT: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{ role: ChatCompletionRequestMessageRoleEnum; content: string }>
  >([]);
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(() => e.target.value);
    console.log(e.target.value);
  };

  const handleSendMessage = async () => {
    const newMessages = [
      ...messages,
      { role: ChatCompletionRequestMessageRoleEnum.User, content: inputText },
    ];
    setMessages(() => newMessages);
    setInputText("");

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: "Instructions",
        },
        ...newMessages,
      ],
    });

    console.log(completion);

    const botReply = completion?.data?.choices[0]?.message?.content;

    // Check if botReply is defined before adding it to the messages array
    if (botReply) {
      const updatedMessages = [
        ...newMessages,
        {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: botReply,
        },
      ];
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="message-container flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user" : "assistant"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container flex items-center p-4">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
        />
        <button
          onClick={void handleSendMessage}
          className="ml-4 rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatGPT;
