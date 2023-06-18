import { UniversalSentenceEncoder } from "@tensorflow-models/universal-sentence-encoder";

interface Command {
  commandString: string;
  embeddings: number[] | undefined;
}

async function toEmbed(sentences: string[], model: UniversalSentenceEncoder): Promise<number[][]> {
  const embeddings: number[][] = await model.embed(sentences).then((e) => {
    return (e).arraySync();
  });
  return embeddings;
}

export default async function recognizeCommand(
  speech: string,
  commandsList: string[],
  model: UniversalSentenceEncoder
): Promise<string> {
  const sentences = [speech, ...commandsList];

  const embeddedArray = await toEmbed(sentences, model);

  const setCommand: Command = {
    commandString: sentences[0] || "",
    embeddings: embeddedArray.length > 0 && embeddedArray[0] !== undefined ? embeddedArray[0] : [],
  };

  const commandChoices: Command[] = [];

  for (let i = 1; i < sentences.length; i++) {
    commandChoices.push({
      commandString: sentences[i] || "",
      embeddings: embeddedArray[i] !== undefined ? embeddedArray[i] : [],
    });
  }
  
  function cosineSimilarity(a: number[] | undefined, b: number[] | undefined): number {
    if (a !== undefined && b !== undefined) {
      let dot = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < a.length; i++) {
        dot += a[i]! * b[i]!;
        normA += a[i]! * a[i]!;
        normB += b[i]! * b[i]!;
      }
      const normProduct = Math.sqrt(normA) * Math.sqrt(normB);
      if (normProduct === 0) {
        return 0;
      }
      return dot / normProduct;
    } else {
      return 0; // Handle the case when either a or b is undefined
    }
  }
    

  const results = [];

  for (let i = 0; i < commandChoices.length; i++) {
    const command = commandChoices[i]?.embeddings;
    const index = i;
    const similarity = cosineSimilarity(setCommand.embeddings, command);
    results.push({ index: index, similarity: similarity });
  }  

  results.sort((a, b) => b.similarity - a.similarity);

  if (results[0]?.index !== undefined) {
    return commandChoices[results[0].index]?.commandString || "";
  } else {
    return ""
  }
}
