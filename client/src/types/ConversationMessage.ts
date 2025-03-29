export enum ConversationMessageOwner {
  User = "user",
  Application = "application",
}

export type ConversationMessage = {
  id: string;
  message: string;
  owner: ConversationMessageOwner;
};
