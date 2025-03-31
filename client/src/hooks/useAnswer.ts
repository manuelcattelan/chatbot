import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { GetAnswerResponse } from "@/types/communication/GetAnswer";

async function getAnswerFn(
  conversationFormData: FormData,
): Promise<{ data: GetAnswerResponse }> {
  return axios.post("/api/messages", conversationFormData);
}

const useAnswer = () => {
  return useMutation({
    mutationKey: ["getAnswer"],
    mutationFn: getAnswerFn,
  });
};

export default useAnswer;
