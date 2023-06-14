import { describe, it, expect } from "vitest";
import { getFallacyClassification } from "./index";

describe("getFallacyClassification", () => {
  it("should return an array of predictions", async () => {
    const predictions = await getFallacyClassification({
      inputs: "We know that the earth is flat because it looks and feels flat.",
    });
    expect(predictions).toBeInstanceOf(Array);
  });
});
