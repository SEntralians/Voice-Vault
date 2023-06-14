import { describe, it, expect } from "vitest";
import { getTextToxicity } from "./index";

describe("getTextToxicity", () => {
  it("should return an array of predictions", async () => {
    const predictions = await getTextToxicity("I hate you so much, you suck");
    expect(predictions).toBeInstanceOf(Array);
  });
});
