import { CharacterAPIRest, EpisodeAPIRest } from "../types.ts";

export const Episode = {
  characters: async (
    parent: EpisodeAPIRest
  ): Promise<Array<CharacterAPIRest>> => {
    const allCharacters = await Promise.all(
      parent.characters.map(async (character) => {
        const characterUnique = await fetch(character);

        return characterUnique.json();
      })
    );

    return allCharacters;
  },
};
