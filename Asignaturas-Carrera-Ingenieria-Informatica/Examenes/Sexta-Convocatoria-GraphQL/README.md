Se pide hacer un API Rest para la gestión de los eventos de una agenda. El API guardará los datos en una base de datos MongoDB.

Los eventos tienen los siguientes datos:
- Título
- Descripción
- Fecha (se debe guardar en la DDBB como objeto tipo Date)
- Hora de inicio
- Hora de fin
- Invitados (listado de nombre de personas - Las personas no están guardadas como tal en la DDBB).

Los endpoints serán los siguientes:

**POST /addEvent**
Añade un evento a la DDBB, los datos se pasarán a través del body, por ejemplo:
```
{
  "titulo": "Cena con Juan y María",
  "descripcion": "Cena en el VIPS de Moncloa",
  "fecha": "2023-06-25",
  "inicio": 21,
  "fin": 23,
  "invitados": ["Juan Alberto", "María"]
}
```

Se debe tener en cuenta:
- Si la hora de finalización es igual o menor que la hora de inicio se debe devolver un error con status: 400
- Si hay un evento que se solape ese día (ojo, solapar no es que coincidan las horas, sino que haya solape temporal) se debe devolver un error con status: 400
- Si faltan algunos de los datos (solo la descripción es optativa), se debe devolver un error con status: 400
- Si el evento se añade correctamente se debe devolver los datos del evento (incluyendo el id creado en Mongo) con status 200

**GET /events**
- Devuelve un array con todos los eventos.

**GET /event/**
- Devuelve el evento con id correspondiente, o si no existe un error con status 404.

**DELETE /deleteEvent/**
- Borra el evento con id correspondiente, o si no existe un error con status 404.

**PUT /updateEvent**
Actualiza un evento cuyos datos (incluido el id) se pasan a través del body.

Se debe tener en cuenta:
- Si la hora de finalización es igual o menor que la hora de inicio se debe devolver un error con status: 400
- Si hay un evento que se solape ese día (ojo, solapar no es que coincidan las horas, sino que haya solape temporal) se debe devolver un error con status: 400
- Si faltan algunos de los datos (solo la descripción es optativa), se debe devolver un error con status: 400
- Si el evento se modifica correctamente se debe devolver los datos del evento (incluyendo el id creado en Mongo) con status 200