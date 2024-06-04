import { CharacterAPIRest, RickAndMortyAPIRest } from "../types.ts";

export const Query = {
  character: async (
    _: unknown,
    args: { id: string }
  ): Promise<CharacterAPIRest> => {
    try {
      const { id } = args;

      const character = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );

      return character.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  charactersByIds: async (
    _: unknown,
    args: { ids: string[] }
  ): Promise<Array<CharacterAPIRest>> => {
    try {
      const { ids } = args;

      const characters = await fetch(
        `https://rickandmortyapi.com/api/character/${ids.toString()}`
      );

      return characters.json();
    } catch (error) {
      throw new Error(error);
    }
  },

  characterByName: async (
    _: unknown,
    args: { name: string }
  ): Promise<CharacterAPIRest | undefined> => {
    try {
      const { name } = args;

      const character = await fetch(
        `https://rickandmortyapi.com/api/character?name=${name}`
      );
      const data: RickAndMortyAPIRest = await character.json();

      const characterUnique: CharacterAPIRest | undefined = data.results[0];

      return characterUnique;
    } catch (error) {
      throw new Error("No se ha encontrado");
    }
  },

  charactersByName: async (
    _: unknown,
    args: { name: string }
  ): Promise<CharacterAPIRest[]> => {
    try {
      const { name } = args;

      const characters = await fetch(
        `https://rickandmortyapi.com/api/character?name=${name}`
      );
      const data: RickAndMortyAPIRest = await characters.json();

      return data.results;
    } catch (error) {
      throw new Error("No se ha encontrado");
    }
  },
};
