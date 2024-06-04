import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

type Author = {
  name: string;
  birth_year?: number;
  death_year?: number;
};
type Book = {
  id: string;
  title: string;
  authors?: Author[];
};

type BookData = {
  results: Book[];
};

const router = new Router();

router
  .get("/books", async (context) => {
    try {
      const booksData = await fetch("https://gutendex.com/books/");
      const booksJSON: BookData = await booksData.json();
      const books: Book[] = booksJSON.results;

      context.response.body = books.map((book) => {
        return {
          title: book.title,
          id: book.id,
        };
      });
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: error,
        message: "Internal Server Error",
      };
    }
  })
  .get("/books/:page", async (context) => {
    try {
      if (context.params?.page) {
        const booksData = await fetch(
          `https://gutendex.com/books/?page=${context.params.page}`
        );
        const booksJSON: BookData = await booksData.json();
        const books: Book[] = booksJSON.results;

        context.response.body = books.map((book) => {
          return {
            title: book.title,
            id: book.id,
          };
        });
      }
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: error,
        message: "Internal Server Error",
      };
    }
  })
  .get("/book/:id", async (context) => {
    try {
      if (context.params?.id) {
        const bookData = await fetch(
          `https://gutendex.com/books/${context.params.id}`
        );
        const book: Book = await bookData.json();

        const { title, id, authors } = book;

        if (!book) {
          context.response.status = 404;
          context.response.body = {
            message: "Book not found",
          };
        }

        context.response.body = { title, id, authors };
      }
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: error,
        message: "Internal Server Error",
      };
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
