import { useEffect, useState } from "react";
import { Anime } from "@/types/animes";
import Extension from "webextension-polyfill";

export default function MarkButton() {
  const [nextEpisodeLink, setNextEpisodeLink] = useState<string | null>(null);
  const [episodeMetaData, setEpisodeMetaData] = useState<null | {
    title: string;
    episode: number;
  }>(null);
  const [hasError, setHasError] = useState(false);
  const render = () => {
    const nextEpisodeBtn = document.querySelector(
      "div.anime-video-options > div.item.right > a.ui.small.with-svg-right"
    ) as HTMLAnchorElement;
    const containerEpisode = document.querySelector("div.info > h2");
    if (!containerEpisode || !containerEpisode.children[1].nextSibling) return;
    //get episode meta data
    const containerMetaData = containerEpisode.children;
    const episodeNumber = containerMetaData[1].nextSibling!.textContent;

    //if the site has episode number and episode title
    if (containerMetaData[0].innerHTML || episodeNumber) {
      const formattedEpisodeNumber = episodeNumber!
        .replaceAll("\n", "")
        .split(" ")
        .find((el) => Number.isInteger(parseInt(el)));

      if (!formattedEpisodeNumber) return setHasError(true);

      setEpisodeMetaData({
        title: containerMetaData[0].innerHTML,
        episode: parseInt(formattedEpisodeNumber, 10),
      });
    } else {
      setHasError(true);
      console.info(
        "It's a bug and you understand how to fix it ?\nOpen issue here => https://github.com/jokay03J/neko-sama-history"
      );
    }

    if (nextEpisodeBtn) {
      setNextEpisodeLink(nextEpisodeBtn.href);
    }
  };

  useEffect(() => {
    render();
  }, []);

  const onClick = async () => {
    if (hasError) return;
    const { animes } = await Extension.storage.local.get(["animes"]);

    if (animes) {
      const findAnime = animes.findIndex(
        (a: Anime) => a.title === episodeMetaData!.title
      );
      if (findAnime === -1) {
        await Extension.storage.local.set({
          animes: [
            {
              title: episodeMetaData!.title,
              episodes: [episodeMetaData!.episode],
            },
            ...animes,
          ],
        });
      } else {
        if (!animes[findAnime].episodes.includes(episodeMetaData!.episode)) {
          animes[findAnime].episodes.push(episodeMetaData!.episode);
          await Extension.storage.local.set({ animes: [...animes] });
        }
      }
    } else {
      await Extension.storage.local.set({
        animes: [
          {
            title: episodeMetaData!.title,
            episodes: [episodeMetaData!.episode],
          },
        ],
      });
    }
    alert("Episode has been marked as viewed");
    if (nextEpisodeLink) {
      window.location.href = nextEpisodeLink;
    }
    render();
  };

  return (
    <button className="ui button small with-svg-right green" onClick={onClick}>
      Mark episode as viewed
      <svg className="n" viewBox="0 0 24 24">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
      </svg>
    </button>
  );
}
