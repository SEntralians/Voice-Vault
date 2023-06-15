/* eslint-disable prefer-const */
import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";

interface Result {
  message: string | undefined;
  results: PredResult[];
}

interface PredResult {
  label: string | undefined;
  probabilities: number | undefined;
}

export const getTextToxicity = async (
  inputs: string[],
  threshold = 0.1,
  toxicityLabels: string[] = []
) => {
  let results: Result[] = [];

  const model = await toxicity.load(threshold, toxicityLabels);
  const predictions = await model.classify(inputs);

  // Convert predictions array to the desired format
  const convertedPredictions = predictions.map((prediction) => ({
    label: prediction.label,
    results: prediction.results.map((result) => ({
      probabilities: result.probabilities[1],
      match: result.match,
    })),
  }));

  for (let messageIdx = 0; messageIdx < inputs.length; messageIdx++) {
    let predResults: PredResult[] = [];
    for (
      let resultIdx = 0;
      resultIdx < convertedPredictions.length;
      resultIdx++
    ) {
      if (convertedPredictions[resultIdx]?.results[messageIdx]?.match) {
        predResults.push({
          label: convertedPredictions[resultIdx]?.label,
          probabilities:
            convertedPredictions[resultIdx]?.results[messageIdx]?.probabilities,
        });
      }
    }

    if (predResults.length > 0) {
      results.push({
        message: inputs[messageIdx],
        results: predResults,
      });
    }
  }

  return results;
};
