export const parseSummary = (summary: string) => {
  const sentences = summary
    .split("-")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences;
};
