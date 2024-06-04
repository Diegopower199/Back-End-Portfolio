Se pide realizar una API Rest usando Deno y Mongo DB como base de datos.
La base de datos debe estar alojada en MongoDB Atlas y el código debe contener el usuario y la contraseña para poder acceder a ella.

La API debe gestionar una red de taxis tipo Cabify, debe contener los siguientes endpoints (el alumno debe elegir el método adecuado: POST, GET, etc.)

- /addCar - Permite añadir un coche a la base de datos. Devuelve los datos del coche añadido. Debe comprobar que no existe ya un coche con la misma matrícula.
- /removeCar/:id - Permite eliminar un coche por id.
  - Si el coche existe y no está ocupado devuelve un 200,
  - Si no existe devuelve un 404.
  - Si existe, pero está ocupado devuelve un 405.
- /car/:id - Devuelve la información de un coche, incluyendo el status (ocupado o libre)
- /askCar - Sirve para reservar un coche. Pone el status del coche a ocupado.
  - Si hay coches libres devuelve el id del coche
  - si no hay coches libres devuelve un 404 y un mensaje indicando que no hay coches.
- /releaseCar/:id - Sirve para liberar el coche por id.
  - Si el id no existe devuelve un 404,
  - si existe, pero no estaba ocupado devuelve un 400.
  - Si existe y está ocupado lo libera y devuelve un 200

El tipo Coche contiene

- id
- matrícula
- número de plazas
- status
