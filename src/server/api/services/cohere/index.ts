import cohere from "cohere-ai";
import { env } from "~/env.mjs";

cohere.init(env.COHERE_API_KEY);

export default cohere;
