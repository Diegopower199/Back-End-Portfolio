import { FilmAPI, PeopleAPI, PlanetAPI } from "../types.ts";

export const Planet = {
  residents: async (parent: PlanetAPI): Promise<Array<PeopleAPI>> => {
    const allResidents = await Promise.all(
      parent.residents.map(async (resident: string) => {
        const residentUnique = await fetch(resident);

        return await residentUnique.json();
      })
    );

    return allResidents;
  },

  films: async (parent: PlanetAPI): Promise<Array<FilmAPI>> => {
    const allFilms = await Promise.all(
      parent.films.map(async (film: string) => {
        const filmUnique = await fetch(film);

        return filmUnique.json();
      })
    );

    return allFilms;
  },
};
