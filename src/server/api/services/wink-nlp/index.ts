/* eslint-disable @typescript-eslint/unbound-method */
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";
import similarity from "wink-nlp/utilities/similarity";

import type { Bow } from "wink-nlp";

const nlp = winkNLP(model);

const its = nlp.its;
const as = nlp.as;

export const getCosineSimilarity = (text1: string, text2: string) => {
  const doc1 = nlp.readDoc(text1);
  const doc2 = nlp.readDoc(text2);

  const bow1 = doc1.tokens().out(its.value, as.bow) as Bow;
  const bow2 = doc2.tokens().out(its.value, as.bow) as Bow;

  return similarity.bow.cosine(bow1, bow2);
};
