import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Slot {
    day: Int!
    month: Int!
    year: Int!
    hour: Int!
    available: Boolean!
    dni: String!
  }
  type Query {
    getSlots: [Slot!]!
    availableSlots(day: Int!, month: Int!, year: Int!, hour: Int!): [Slot!]!
  }

  type Mutation {
    addSlots(day: Int!, month: Int!, year: Int!, hour: Int!): Slot!
    removeSlots(day: Int!, month: Int!, year: Int!, hour: Int!): Slot!
    bookSlot(day: Int!, month: Int!, year: Int!, hour: Int!): Slot!
  }
`;
