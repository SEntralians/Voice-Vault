import { useState, useEffect } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import useDebounce from "~/utils/debourncer";
import Rephraser from "~/utils/rephraser";

const RephraseTool = (): JSX.Element => {
  const [model, setModel] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const debouncedText = useDebounce(text, 3000);

  useEffect(() => {
    toxicity.load(0.9).then((loadedModel) => {
      setModel(loadedModel);
    });
  }, []);

  useEffect(() => {
    if (model && text) {
      model.classify([text]).then((results: any) => {
        const open = results.some((prediction: any) => prediction.results[0].match === true);
        setIsOpen(open);
      });
    }
  }, [model, debouncedText]);

  return (
    <div className="container mx-auto p-4 w-full">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="relative inline-block text-left">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter some text"
          className="flex-grow rounded-md bg-gray-800 px-3 py-2 w-full text-white outline-none focus:ring-1 focus:ring-blue-500"
        />
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-80 py-2 origin-top-right bg-white rounded-md shadow-xl"
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
