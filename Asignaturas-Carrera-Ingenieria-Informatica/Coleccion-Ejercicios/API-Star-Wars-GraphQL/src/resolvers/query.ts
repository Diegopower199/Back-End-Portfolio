import { InfoPlanets, PlanetAPI } from "../types.ts";

export const Query = {
  planets: async (_: unknown, args: { page: number }): Promise<PlanetAPI[]> => {
    const { page } = args;
    const planetsPage = await fetch(
      `https://swapi.dev/api/planets/?page=${page}`
    );

    const planets: InfoPlanets = await planetsPage.json();

    return planets.results;
  },
};
