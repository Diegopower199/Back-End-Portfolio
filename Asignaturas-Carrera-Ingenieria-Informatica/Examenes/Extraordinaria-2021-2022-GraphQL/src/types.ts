export type PressHouse = {
  id: string;
  name: string;
  web: string;
  country: string;
  books: string[];
};

export type Author = {
  id: string;
  name: string;
  lang: string;
  books: string[];
};

export type Book = {
  id: string;
  title: string;
  author: string;
  pressHouse: string;
  year: number;
};
