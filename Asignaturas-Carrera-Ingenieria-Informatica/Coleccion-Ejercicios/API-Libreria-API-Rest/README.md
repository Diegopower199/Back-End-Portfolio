Se pide realizar una API usando Deno y OAK que permita consultar una base de datos de libros. Para obtener los libros se usará la API: https://gutendex.com/

Debe tener los siguientes endpoints

- GET - /books -> Devuelve un array de libros de la página 1 con los campos "id" y "titulo"
- GET - /books/:page -> Devuelve un array de libros de la página correspondiente con los campos "id" y "titulo"
- GET - /book/:id -> Devuelve los detalles un libro de id determinado -> devuelve "id", "titulo", array de "autores" con todos sus datos
