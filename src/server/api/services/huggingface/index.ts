import { env } from "~/env.mjs";

interface InputData {
  inputs: string[];
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

    return result
      .map((res) => res.filter((r) => r.score > threshold))
      .map((fallacy, idx) => ({
        text: data.inputs[idx],
        label: fallacy[0]?.label ?? "neutral",
        score: fallacy[0]?.score ?? 0,
      }));
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getToxicityLevel = async (data: InputData, threshold = 0.5) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/jpcorb20/toxic-detector-distilroberta",
      {
        headers: { Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = (await response.json()) as Result;

    return result
      .map((res) => res.filter((r) => r.score > threshold))
      .map((fallacy, idx) => ({
        text: data.inputs[idx],
        label: fallacy[0]?.label ?? "neutral",
        score: fallacy[0]?.score ?? 0,
      }));
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
