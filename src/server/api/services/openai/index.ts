import { env } from "~/env.mjs";
import {
  Configuration,
  OpenAIApi,
  type ChatCompletionRequestMessage,
} from "openai";

const configuration = new Configuration({
  apiKey: env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export const askChatGpt = async (input: string) => {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "assistant", content: input }],
  });

  return chatCompletion?.data.choices[0]?.message?.content;
};

type Conversations = {
  userInput: string;
  aiReply: string;
}[];

export const covnverseWithChatGpt = async (
  systemInput: string,
  historyConversations: Conversations,
  newUserInput: string
) => {
  const formattedConversations: ChatCompletionRequestMessage[] =
    historyConversations.flatMap((conversation) => [
      { role: "system", content: conversation.userInput },
      { role: "assistant", content: conversation.aiReply },
    ]);

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemInput },
      ...formattedConversations,
      { role: "user", content: newUserInput },
    ],
  });

  return chatCompletion?.data.choices[0]?.message?.content;
};
