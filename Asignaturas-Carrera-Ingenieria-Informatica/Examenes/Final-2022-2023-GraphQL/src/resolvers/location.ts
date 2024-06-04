import { CharacterAPIRest, LocationAPIRest } from "../types.ts";

export const Location = {
  residents: async (
    parent: LocationAPIRest
  ): Promise<Array<CharacterAPIRest>> => {
    const allResidents = await Promise.all(
      parent.residents.map(async (resident) => {
        const residentUnique = await fetch(resident);

        return residentUnique.json();
      })
    );

    return allResidents;
  },
};
