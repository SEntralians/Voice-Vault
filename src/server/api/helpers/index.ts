type MessageDetails = {
  text: string;
  user: string | null;
}[];

export const formatToDialogue = (
  messages: MessageDetails,
  limit: number | null = null
) => {
  let dialogue = "";
  messages.forEach((message, idx) => {
    if (limit && idx >= limit) {
      return;
    }
    if (message.user) {
      dialogue += `${message.user}: ${message.text}\n`;
    }
  });
  return dialogue;
};
