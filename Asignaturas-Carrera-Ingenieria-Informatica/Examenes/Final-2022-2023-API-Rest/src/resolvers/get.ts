import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { CharacterAPIRest } from "../types.ts";

type GetCharacterConIdContext = RouterContext<
  "/character/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCharacter = async (context: GetCharacterConIdContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    const { id } = params;

    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`
    );

    const character = await response.json();

    context.response.body = character;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};

type GetCharacterConIdsContext = RouterContext<
  "/charactersByIds/:ids",
  {
    ids: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCharacterByIds = async (context: GetCharacterConIdsContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    const ids = params.ids.split(",");
    const arrayIds: string[] = [];
    ids.forEach((id: string) => {
      arrayIds.push(id);
    });

    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${ids.toString()}`
    );

    const characters: CharacterAPIRest[] = await response.json();

    context.response.body = characters;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
