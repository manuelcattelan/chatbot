"use client";

import { useRef, useState } from "react";

import Conversation from "@/components/custom/Conversation";
import ConversationForm from "@/components/custom/ConversationForm";

import { ConversationMessage } from "@/types/ConversationMessage";

export default function Home() {
  const conversationRef = useRef<HTMLDivElement>(null);
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([]);

  return (
    <main className="flex h-full flex-col p-4">
      <Conversation
        conversationRef={conversationRef}
        conversationMessages={conversationMessages}
      />
      <ConversationForm
        conversationRef={conversationRef}
        setConversationMessages={setConversationMessages}
      />
    </main>
  );
}
