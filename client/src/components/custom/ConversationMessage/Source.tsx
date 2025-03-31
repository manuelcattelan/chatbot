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
      <Button
        variant="link"
        className="h-8 w-full justify-start px-0 py-0 sm:px-4"
      >
        <a
          href={source}
          target="_blank"
          className="overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {sourceIndex + 1}. {source}
        </a>
      </Button>
    </li>
  );
}
