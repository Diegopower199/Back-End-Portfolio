import {
  FilmAPI,
  PeopleAPI,
  SpecieAPI,
  StarshipAPI,
  VehicleAPI,
} from "../types.ts";

export const People = {
  films: async (parent: PeopleAPI): Promise<Array<FilmAPI>> => {
    const allFilms = await Promise.all(
      parent.films.map(async (film: string) => {
        const filmUnico = await fetch(film);

        return await filmUnico.json();
      })
    );

    return allFilms;
  },

  species: async (parent: PeopleAPI): Promise<Array<SpecieAPI>> => {
    const allSpecies = await Promise.all(
      parent.species.map(async (specie: string) => {
        const specieUnique = await fetch(specie);

        return await specieUnique.json();
      })
    );

    return allSpecies;
  },

  vehicles: async (parent: PeopleAPI): Promise<Array<VehicleAPI>> => {
    const allVehicles = await Promise.all(
      parent.vehicles.map(async (vehicle: string) => {
        const vehicleUnique = await fetch(vehicle);

        return await vehicleUnique.json();
      })
    );

    return allVehicles;
  },

  starships: async (parent: PeopleAPI): Promise<Array<StarshipAPI>> => {
    const allStarships = await Promise.all(
      parent.starships.map(async (starship: string) => {
        const starshipUnique = await fetch(starship);

        return await starshipUnique.json();
      })
    );

    return allStarships;
  },
};
