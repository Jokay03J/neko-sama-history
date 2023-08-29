import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortEpisode = (episodes: number[]) => {
  let episodesCopy = episodes;
  for (
    let indexEpisodes = 0;
    indexEpisodes < episodesCopy.length;
    indexEpisodes++
  ) {
    for (
      let indexElement = 0;
      indexElement < episodesCopy.length - 1;
      indexElement++
    ) {
      if (episodesCopy[indexElement] > episodesCopy[indexElement + 1]) {
        const swap = episodesCopy[indexElement];
        episodesCopy[indexElement] = episodesCopy[indexElement + 1];
        episodesCopy[indexElement + 1] = swap;
      }
    }
  }

  return episodesCopy;
};
