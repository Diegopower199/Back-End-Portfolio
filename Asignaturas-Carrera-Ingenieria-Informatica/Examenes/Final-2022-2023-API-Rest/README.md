
## Examen Convoctoria Ordinaria	

Se pide realizar una API GraphQL que tenga la misma funcionalidad (idéntica) que las siguientes queries del API GraphQL de Rick and Morty https://rickandmortyapi.com/graphql.

```
type  Query {
   character(id: ID!): Character
   charactersByIds(ids: [ID!]!): [Character]
}
```
El alumno deberá completar el `schema` graphql oportunamente para que la funcionalidad y los datos sean idénticos.

Los datos se deben obtener mediante llamadas al API Rest de Rick and Morty : https://rickandmortyapi.com/documentation/#rest


 - La query `character(id: ID!): Character` devuelve exactamente lo mismo que la query del API GraphQL de Ricky Morty.
 - La query `charactersByIds(ids: [ID!]!): [Character]` devuelve examente lo mismo que la query del API GraphQL de Ricky Morty.
 - El `schema` graphql es correcto.
 - Los parámetros de todos los resolvers están correctamente tipados (y están todos los resolvers necesarios).
 - Los valores de retorno de todos los resolvers están correctamente tipados (y están todos los resolvers necesarios).
 - No hay dependencias en el import_map innecesarias, no fragamentos de código innecesarios, no archivos que no se usen.

