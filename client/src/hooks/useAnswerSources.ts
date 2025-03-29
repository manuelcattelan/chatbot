import {
  GetAnswerSourcesRequest,
  GetAnswerSourcesResponse,
} from "@/types/communication/GetAnswerSouces";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

async function getAnswerSourcesFn(
  request: GetAnswerSourcesRequest,
): Promise<{ data: GetAnswerSourcesResponse }> {
  return axios.get(`/api/messages/${request.answer_id}/sources`);
}

const useAnswerSources = () => {
  const queryClient = new QueryClient();

  return (answerId: string) =>
    queryClient.fetchQuery({
      queryKey: ["getAnswerSources", answerId],
      queryFn: () => getAnswerSourcesFn({ answer_id: answerId }),
    });
};

export default useAnswerSources;
