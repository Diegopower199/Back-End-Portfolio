import { ObjectId } from "mongo";

export type Partido = {
  id: ObjectId;
  nombreEquipo1: string;
  nombreEquipo2: string;
  resultado: string;
  minutoJuego: number;
  finalizacion: boolean;
};
