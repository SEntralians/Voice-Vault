import React, { useState } from "react";
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum} from "openai";


const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const ChatGPT: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: ChatCompletionRequestMessageRoleEnum; content: string }>>([]);
  const [inputText, setInputText] = useState("");

  console.log(ChatCompletionRequestMessageRoleEnum)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(() => e.target.value);
    console.log(e.target.value)
  }

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
        { role: ChatCompletionRequestMessageRoleEnum.System, content: "Instructions" },
        ...newMessages
      ],
    });

    console.log(completion)

    const botReply = completion?.data?.choices[0]?.message?.content;

    // Check if botReply is defined before adding it to the messages array
    if (botReply) {
      const updatedMessages = [
        ...newMessages,
        { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: botReply },
      ];
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="message-container flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === "user" ? "user" : "assistant"}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container p-4 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatGPT;
