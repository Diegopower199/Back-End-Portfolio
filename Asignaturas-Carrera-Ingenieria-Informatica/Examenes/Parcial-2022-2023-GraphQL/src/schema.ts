import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Slots {
    day: Int!
    month: Int!
    year: Int!
    hour: Int!
    available: Boolean!
    dni: String
  }

  type Query {
    availableSlot(day: Int, month: Int!, year: Int!): [Slots!]!
  }

  type Mutation {
    addSlot(day: Int!, month: Int!, year: Int!, hour: Int!): Slots!
    removeSlot(day: Int!, month: Int!, year: Int!, hour: Int!): Slots!
    bookSlot(
      day: Int!
      month: Int!
      year: Int!
      hour: Int!
      dni: String!
    ): Slots!
  }
`;
