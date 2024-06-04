import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Planet {
    name: String!
    rotation_period: String!
    orbital_period: String!
    diameter: String!
    climate: String!
    gravity: String!
    terrain: String!
    surface_water: String!
    population: String!
    residents: [People!]!
    films: [Film!]!
    created: String!
    edited: String!
    url: String!
  }

  type People {
    name: String!
    height: String!
    mass: String!
    hair_color: String!
    skin_color: String!
    eye_color: String!
    birth_year: String!
    gender: String!
    homeworld: String!
    films: [Film!]!
    species: [Specie!]!
    vehicles: [Vehicle!]!
    starships: [Starship!]!
    created: String!
    edited: String!
    url: String!
  }

  type Film {
    title: String!
    episode_id: String!
    opening_crawl: String!
    director: String!
    producer: String!
    release_date: String!
    characters: [People!]!
    planets: [Planet!]!
    starships: [Starship!]!
    vehicles: [Vehicle!]!
    species: [Specie!]!
    created: String!
    edited: String!
    url: String!
  }

  type Specie {
    name: String!
    classification: String!
    designation: String!
    average_height: String!
    skin_colors: String!
    hair_colors: String!
    eye_colors: String!
    average_lifespan: String!
    homeworld: String!
    language: String!
    people: [People!]!
    films: [Film!]!
    created: String!
    edited: String!
    url: String!
  }

  type Vehicle {
    name: String!
    model: String!
    manufacturer: String!
    cost_in_credits: String!
    length: String!
    max_atmosphering_speed: String!
    crew: String!
    passengers: String!
    cargo_capacity: String!
    consumables: String!
    vehicle_class: String!
    pilots: [People!]!
    films: [Film!]!
    created: String!
    edited: String!
    url: String!
  }

  type Starship {
    name: String!
    model: String!
    manufacturer: String!
    cost_in_credits: String!
    length: String!
    max_atmosphering_speed: String!
    crew: String!
    passengers: String!
    cargo_capacity: String!
    consumables: String!
    hyperdrive_rating: String!
    MGLT: String!
    starship_class: String!
    pilots: [People!]!
    films: [Film!]!
    created: String!
    edited: String!
    url: String!
  }

  type Query {
    planets(page: Int!): [Planet!]!
  }
`;
