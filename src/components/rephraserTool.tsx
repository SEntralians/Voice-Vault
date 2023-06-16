/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState, useEffect } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import useDebounce from "~/utils/debouncer";
import Rephraser from "~/utils/rephraser";

const RephraseTool = (): JSX.Element => {
  const [model, setModel] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const debouncedText = useDebounce(text, 3000);

  useEffect(() => {
    toxicity
      .load(0.9, [
        "identity_attack",
        "insult",
        "obscene",
        "severe_toxicity",
        "sexual_explicit",
        "threat",
        "toxicity",
      ])
      .then((loadedModel) => {
        setModel(loadedModel);
      });
  }, []);

  useEffect(() => {
    if (model && text) {
      model.classify([text]).then((results: any) => {
        const open = results.some(
          (prediction: any) => prediction.results[0].match === true
        );
        setIsOpen(open);
      });
    }
  }, [model, debouncedText]);

  return (
    <div className="container mx-auto w-full p-4">
      <div className="relative inline-block text-left w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter some text"
          className="w-full flex-grow rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
        />
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white py-2 shadow-xl"
            style={{ bottom: "calc(100% + 0.5rem)" }}
          >
            <Rephraser text={text} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RephraseTool;
