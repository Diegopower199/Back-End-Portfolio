Para esta segunda practica se os pide que realizar la API para un banco. Para ello se piden los siguientes endpoints:

- getUser/parámetros. Para encontrar ese usuario se podra usar cualquier campo único
- addUser -> Añadira un usuario a la base de datos del banco
  - Email
  - Nombre
  - Apellido
  - Telefono
  - DNI
- deleteUser/email -> eliminara un usuario de la base de datos del banco
- addTransaction -> Añadira una transaccion a un usuario.

La base de datos debera constar de las siguientes colecciones

- Users:
  - DNI: unico
  - Nombre
  - Apellidos
  - Telefono: unico
  - Email: unico
  - IBAN: unico
  - ID: unico

Los datos como el IBAN, email y DNI deberan asegurarse que cumple con los formatos concretos

- Transactions:
  - ID_Sender
  - ID_Reciber
  - amount

Los ID deberan ser los ID de la coleccion Users

Para la realizacion de esta practica se tendra en cuenta lo siguiente:

- Se gestionen los errores, si el servidor se para por un error sera un suspenso
- Siempre se devuelva una respuesta a las peticiones
- Se usen los HTTP Codes correctos en cada peticion
- Se usen los metodos correctos segun lo visto en clase
