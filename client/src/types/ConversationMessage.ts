export enum ConversationMessageOwner {
  User = "user",
  Application = "application",
}

export type ConversationMessageUser = {
  id: string;
  owner: ConversationMessageOwner.User;
  message: string;
};

export type ConversationMessageApplication = {
  id?: string;
  owner: ConversationMessageOwner.Application;
  message?: string;
  isLoading: boolean;
};

export type ConversationMessage =
  | ConversationMessageUser
  | ConversationMessageApplication;
