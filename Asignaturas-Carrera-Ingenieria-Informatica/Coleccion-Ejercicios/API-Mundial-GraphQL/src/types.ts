export type Equipo = {
  nombre: string;
  eliminado: boolean;
  jugadores: string[];
  golesFavor: number;
  golesContra: number;
  puntos: number;
  partidos: number;
};

export enum Status {
  not_started = "not_started",
  started = "started",
  finished = "finished",
}

export type Partido = {
  id: string;
  equipo1: Equipo;
  equipo2: Equipo;
  golesEquipo1: number;
  golesEquipo2: number;
  estado: Status;
  time: number;
};
