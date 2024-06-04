export type StarWarsAPIRest = {
  planets: InfoPlanets;
};

export type InfoPlanets = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlanetAPI[];
};

export type PlanetAPI = {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type InfoPeople = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PeopleAPI[];
};

export type PeopleAPI = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
};

export type InfoFilm = {
  count: number;
  next: string | null;
  previous: string | null;
  results: FilmAPI[];
};
export type FilmAPI = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
};

export type InfoSpecie = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SpecieAPI[];
};

export type SpecieAPI = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type InfoVehicles = {
  count: number;
  next: string | null;
  previous: string | null;
  results: VehicleAPI[];
};
export type VehicleAPI = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type InfoStarship = {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarshipAPI[];
};
export type StarshipAPI = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};
