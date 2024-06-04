# Práctica 5

Para esta quinta práctica se pide desarrollar una API en GraphQL para enviar mensajes entre usuarios
Se deberá crear un .env con los siguientes campos

- URL_MONGO = con la url al servidor de mongo
- PORT = con el puerto para que corra el servidor

NO se puede subir el .env al repositorio, en este caso se deberá subir un .env.sample
La base de datos deberá ser OBLIGATORIAMENTE con MongoDB y tendrá las siguientes colecciones:

- Usuario
- Mensaje

Tanto la Autentificacion mediante JWT como el idioma se deberá mandar mediante las cabeceras de la petición (explicación en la clase practica)
Las funciones que se piden son las siguientes y NO SE ADMITE variaciones en los campos de entrada y de salida

1. createUser(username, password): Usuario
   - El campo username deberá ser único
   - El campo password deberá estar cifrado
   - Se deberá guardar la fecha de creación, en FORMATO UNIVERSAL
   - Idioma

2. login(username, password): JWT
   - Errores básicos (usuario existe, campos correctos etc)

3. deleteUser: Usuario
   - Se obtendrá el usuario a eliminar mediante la cabecera Auth

4. sendMessage(destinatario, menssage): Mensaje
   - El usuario que envía el mensaje se obtendrá de la cabecera Auth
   - El idioma que se envié por la cabecera Lang deberá coincidir con el guardado en bbdd
   - Se deberá guardar la fecha de creación del mensaje

5. getMessages(page, perPage): [Mensaje]
   - el limite por pagina deberá estar incluido en 10-200
   - no se pueden usar paginas negativas
