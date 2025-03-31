import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

import {
  GetAnswerSourcesRequest,
  GetAnswerSourcesResponse,
} from "@/types/communication/GetAnswerSources";

async function getAnswerSourcesFn(
  request: GetAnswerSourcesRequest,
): Promise<{ data: GetAnswerSourcesResponse }> {
  return axios.get(`/api/messages/${request.answer_id}/sources`);
}

const useAnswerSources = (queryClient: QueryClient) => {
  return (answerId: string) =>
    queryClient.fetchQuery({
      queryKey: ["getAnswerSources", answerId],
      queryFn: () => getAnswerSourcesFn({ answer_id: answerId }),
    });
};

export default useAnswerSources;
