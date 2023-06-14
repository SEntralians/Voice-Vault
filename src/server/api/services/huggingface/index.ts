import { env } from "~/env.mjs";

interface InputData {
  inputs: string;
}

type Result = {
  label: string;
  score: number;
}[][];

export const getFallacyClassification = async (
  data: InputData,
  threshold = 0.5
) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/q3fer/distilbert-base-fallacy-classification",
      {
        headers: { Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = (await response.json()) as Result;

    const sortedResult = result
      .flat()
      .filter((res) => res.score > threshold)
      .sort((a, b) => b.score - a.score);

    return sortedResult[0];
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
