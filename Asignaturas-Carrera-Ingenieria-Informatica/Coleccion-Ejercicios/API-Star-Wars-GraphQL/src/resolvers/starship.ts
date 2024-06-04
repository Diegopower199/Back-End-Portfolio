import { FilmAPI, PeopleAPI, StarshipAPI } from "../types.ts";

export const Starship = {
  pilots: async (parent: StarshipAPI): Promise<Array<PeopleAPI>> => {
    const allPilots = await Promise.all(
      parent.pilots.map(async (pilot: string) => {
        const pilotUnique = await fetch(pilot);

        return await pilotUnique.json();
      })
    );

    return allPilots;
  },

  films: async (parent: StarshipAPI): Promise<Array<FilmAPI>> => {
    const allFilms = await Promise.all(
      parent.films.map(async (film: string) => {
        const filmUnico = await fetch(film);

        return await filmUnico.json();
      })
    );

    return allFilms;
  },
};
