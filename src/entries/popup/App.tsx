import { CollapsibleAnime } from "@/components/AnimeCollapse";
import "../../global.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Anime } from "@/types/animes";
import { RefreshCcw, Menu } from "lucide-react";
import { FormEvent, useEffect, useId, useState } from "react";
import Extension from "webextension-polyfill";
import { sortEpisode } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const [animes, setAnimes] = useState<Anime[] | null>(null);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const inputId = useId();

  useEffect(() => {
    const fetchAnimes = async () => {
      const response = await Extension.storage.local.get(["animes"]);

      setAnimes(response.animes);
      setFilteredAnimes(response.animes);
      setLoading(false);
    };
    fetchAnimes();
  }, []);

  const removeEpisode = async (epId: number, title: string) => {
    const response = await Extension.storage.local.get(["animes"]);
    const index = response.animes.findIndex((a: Anime) => a.title === title);
    response.animes[index].episodes = response.animes[index].episodes.filter(
      (ep: number) => ep !== epId
    );
    console.log(response.animes[index]);
    if (response.animes[index].episodes.length === 0) {
      response.animes = response.animes.filter((a: Anime) => a.title !== title);
    }

    await Extension.storage.local.set({ animes: response.animes });
    setAnimes(response.animes);
    setFilteredAnimes(
      response.animes.filter((a: Anime) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const refresh = async () => {
    const response = await Extension.storage.local.get(["animes"]);
    setAnimes(response.animes);
    setFilteredAnimes(
      response.animes.filter((a: Anime) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const useSearch = async (
    ev: FormEvent<HTMLFormElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    ev.preventDefault();
    console.log(search);
    if (animes === null) return;

    if (search.length > 0) {
      setFilteredAnimes(
        animes.filter((a) =>
          a.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      const response = await Extension.storage.local.get(["animes"]);
      setFilteredAnimes(response.animes);
    }
  };
  return (
    <div className="h-full w-full">
      <header className="flex justify-between items-center p-1">
        <Button variant={"outline"} size={"icon"} onClick={() => refresh()}>
          <RefreshCcw />
        </Button>
        <h1 className="text-lg">Neko Sama History</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => Extension.runtime.openOptionsPage()}
        >
          <Menu />
        </Button>
      </header>
      <Separator className="my-1" role="separator" />
      <main className="w-full px-1">
        <form action="#" onSubmit={useSearch}>
          <Label htmlFor={inputId}>Anime title</Label>
          <div className="w-full flex gap-2">
            <Input
              placeholder="Enter anime title"
              type="search"
              id={inputId}
              value={search}
              onChange={(ev) => {
                setSearch(() => ev.target.value);
              }}
            />
            <Button type="submit">Search</Button>
          </div>
        </form>
        {loading ? (
          <div className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <ul className="py-1">
            {filteredAnimes?.map((anime) => {
              return (
                <CollapsibleAnime
                  animeTitle={anime.title}
                  animeEpisodes={sortEpisode(anime.episodes).reverse()}
                  deleteFun={(epId) => removeEpisode(epId, anime.title)}
                />
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
