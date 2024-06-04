import { gql } from "graphql_tag";

export const typeDefs = gql`
  type PressHouse {
    id: ID!
    name: String!
    web: String!
    country: String!
    books: [Book!]!
  }

  type Author {
    id: ID!
    name: String!
    lang: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    author: ID!
    pressHouse: ID!
    year: Int!
  }

  type Query {
    books: [Book!]!
    authors: [Author!]!
    presshouses: [PressHouse!]!
    book(id: ID!): Book!
    author(id: ID!): Author!
    presshouse(id: ID!): PressHouse!
  }

  type Mutation {
    addPressHouse(
      name: String!
      web: String!
      country: String!
      books: [String!]!
    ): PressHouse!
    addAuthor(name: String!, lang: String!, books: [String!]!): Author!
    addBook(title: String!, author: ID!, pressHouse: ID!, year: Int!): Book!
    deletePressHouse(id: ID!): PressHouse!
    deleteAuthor(id: ID!): Author!
    deleteBook(id: ID!): Book!
  }
`;
