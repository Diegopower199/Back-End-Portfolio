import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Match {
    id: ID!
    nombreEquipo1: String!
    nombreEquipo2: String!
    resultado: String!
    minutoJuego: Int!
    finalizacion: Boolean!
  }

  type Query {
    listMatches: [Match!]!
    getMatch(id: ID!): Match!
  }

  type Mutation {
    setMatchData(
      id: ID!
      result: String!
      minute: Int!
      ended: Boolean!
    ): Match!
    startMatch(team1: String!, team2: String!): Match!
  }
`;
