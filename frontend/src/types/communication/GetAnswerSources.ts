import { Status } from "./Status";

export type GetAnswerSourcesRequest = {
  answer_id: string;
};

export type GetAnswerSourcesResponseSuccess = {
  status: Status.Success;
  data: {
    answer_id: string;
    answer_sources: string[];
  };
};

export type GetAnswerSourcesResponseError = {
  status: Status.Error;
  status_code: number;
  message: string;
};

export type GetAnswerSourcesResponse =
  | GetAnswerSourcesResponseSuccess
  | GetAnswerSourcesResponseError;
