import { FilmAPI, PeopleAPI, VehicleAPI } from "../types.ts";

export const Vehicle = {
  pilots: async (parent: VehicleAPI): Promise<Array<PeopleAPI>> => {
    const allPilots = await Promise.all(
      parent.pilots.map(async (pilot: string) => {
        const pilotUnique = await fetch(pilot);

        return await pilotUnique.json();
      })
    );

    return allPilots;
  },

  films: async (parent: VehicleAPI): Promise<Array<FilmAPI>> => {
    const allFilms = await Promise.all(
      parent.films.map(async (film: string) => {
        const filmUnico = await fetch(film);

        return await filmUnico.json();
      })
    );

    return allFilms;
  },
};
