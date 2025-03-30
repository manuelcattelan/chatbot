import { Status } from "./Status";

export type GetAnswerResponseSuccess = {
  status: Status.Success;
  data: {
    answer_id: string;
    answer: string;
  };
};

export type GetAnswerResponseError = {
  status: Status.Error;
  status_code: number;
  message: string;
};

export type GetAnswerResponse =
  | GetAnswerResponseSuccess
  | GetAnswerResponseError;
