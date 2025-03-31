import { Button } from "@/components/ui/button";

export default function ConversationMessageSource({
  source,
  sourceIndex,
}: {
  source: string;
  sourceIndex: number;
}) {
  return (
    <li>
      <Button variant="link">
        {sourceIndex + 1}. {source}
      </Button>
    </li>
  );
}
