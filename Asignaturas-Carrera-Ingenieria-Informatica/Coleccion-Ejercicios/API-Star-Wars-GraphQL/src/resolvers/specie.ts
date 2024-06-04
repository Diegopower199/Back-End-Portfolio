import { FilmAPI, PeopleAPI, SpecieAPI } from "../types.ts";

export const Specie = {
  people: async (parent: SpecieAPI): Promise<Array<PeopleAPI>> => {
    const allPeople = await Promise.all(
      parent.people.map(async (persona: string) => {
        const personaUnique = await fetch(persona);

        return await personaUnique.json();
      })
    );

    return allPeople;
  },

  films: async (parent: SpecieAPI): Promise<Array<FilmAPI>> => {
    const allFilms = await Promise.all(
      parent.films.map(async (film: string) => {
        const filmUnico = await fetch(film);

        return await filmUnico.json();
      })
    );

    return allFilms;
  },
};
