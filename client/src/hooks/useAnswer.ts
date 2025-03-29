import { GetAnswerResponse } from "@/types/communication/GetAnswer";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
