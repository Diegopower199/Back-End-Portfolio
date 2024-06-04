import { CharacterAPIRest, EpisodeAPIRest, LocationAPIRest } from "../types.ts";

export const Character = {
  origin: async (parent: CharacterAPIRest): Promise<LocationAPIRest | null> => {
    if (parent.origin) {
      const origin = await fetch(parent.origin.url);

      return origin.json();
    } else {
      return null;
    }
  },

  location: async (parent: CharacterAPIRest): Promise<LocationAPIRest> => {
    const location = await fetch(parent.location.url);

    return location.json();
  },

  episode: async (parent: CharacterAPIRest): Promise<Array<EpisodeAPIRest>> => {
    const allEpisodes = await Promise.all(
      parent.episode.map(async (episode) => {
        const episodeUnique = await fetch(episode);

        return episodeUnique.json();
      })
    );

    return allEpisodes;
  },
};
