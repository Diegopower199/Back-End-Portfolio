# Practica 1

Realizar en TypeScript una función que reciba por parámetros un array y devuelva un array modificado, donde cada índice del array será el resultado del producto del resto de elementos del array sin contar el índice actual. Por ejemplo:
Dado el siguiente array: [1, 2, 3] el resultado deberá ser: [ (2*3), (1*3), (1*2) ].

Información extra a tener en cuenta:
 - El array puede tener números en formato string, en este caso se deberá convertir a un array de números.
 - Todas las posibles excepciones deberán ser controladas.
 - El array pasado por parámetros puede ser un array de arrays, el cual antes de procesarlo deberá ser aplanado, por ejemplo:
 - [ [ 1, 2, 3 ],  2, [ 4, 5, 6 ] ] => [1,2,3,2,4,5,6]

Se valorará positivamente aquellos alumnos que realicen un nuevo archivo con los test de las funciones siguiendo la documentación oficial de Deno 

- https://deno.land/manual@v1.26.0/testing