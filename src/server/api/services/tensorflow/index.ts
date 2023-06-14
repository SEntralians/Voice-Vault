import toxicity from "@tensorflow-models/toxicity";

export const getTextToxicity = async (
  text: string,
  threshold = 0.9,
  toxicityLabels: string[] = []
) => {
  const model = await toxicity.load(threshold, toxicityLabels);
  const predictions = await model.classify([text]);
  return predictions.filter((pred) => pred.results[0]?.match === true);
};
