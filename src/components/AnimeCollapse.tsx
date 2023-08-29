import * as React from "react";
import { ChevronsUpDown, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface CollapsibleAnimeI {
  animeTitle: string;
  animeEpisodes: number[];
  deleteFun: (epId: number) => void;
}

export function CollapsibleAnime({
  animeTitle,
  animeEpisodes,
  deleteFun,
}: CollapsibleAnimeI) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <h2 className="text-sm font-semibold">{animeTitle}</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm flex items-center justify-between px-3">
        <span className="text-4xl">{animeEpisodes[0]}</span>
        <Button
          size={"icon"}
          variant={"destructive"}
          onClick={() => deleteFun(animeEpisodes[0])}
        >
          <XCircle />
        </Button>
      </div>
      <CollapsibleContent className="space-y-2">
        {animeEpisodes.slice(1).map((a) => (
          <div className="rounded-md border px-4 py-3 font-mono text-sm flex items-center justify-between px-3">
            <span className="text-4xl">{a}</span>
            <Button
              size={"icon"}
              variant={"destructive"}
              onClick={() => deleteFun(a)}
            >
              <XCircle />
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

