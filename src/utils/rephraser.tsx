/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

interface RephraseToolProps {
  text: string;
}

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default function Rephraser({ text }: RephraseToolProps): JSX.Element {
  const [rephrasedText, setRephrasedText] = useState<string>("");

  async function rephrase(text: string) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Rephrase this to something appropriate and nicer: ${text}/nrephrased:`,
      temperature: 0.7,
      max_tokens: 963,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    setRephrasedText(response?.data?.choices[0]?.text ?? "");
    console.log(response.data.choices[0]?.text);
  }

  return (
    <div className="block w-full px-4 py-2 text-left text-sm text-gray-700">
      <p> {text} may not be appropriate, do you want to rephrase? </p>
      <button
        className="ml-4 mt-2 inline-flex justify-center rounded-md border border-blue-300 bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => rephrase(text)}
      >
        rephrase
      </button>
      {rephrasedText && <p>Rephrased text: {rephrasedText}</p>}
    </div>
  );
}
