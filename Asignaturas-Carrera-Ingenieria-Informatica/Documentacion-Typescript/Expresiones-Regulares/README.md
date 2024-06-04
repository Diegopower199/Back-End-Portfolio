# Expresiones regulares

## Expresión Regular Fecha dd/mm/yyyy
```
const expresionRegularFecha=/^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;
 
const fechaValida="28/02/2021";//Cadena de Fecha dd/mm/yyyy
const fechainvalida="29/02/2021";//Cadena de Fecha dd/mm/yyyy
 
//Evaluación de Cadena Valida de Fecha dd/mm/yyyy
if (fechaValida.match(expresionRegularFecha) !== null) {
    console.log("Fecha Válida");
}
else if (fechaValida.match(expresionRegularFecha) === null) {
    console.log("Fecha Invalida");
}
```


## Expresión Regular Email
```
const expresionRegularEmail=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
 
const emailValido = "contacto.estilow3b@gmail.com"; //Cadena de Email
const emailInvalido = "contacto.estilow3b@gmail,com"; //Cadena de Email
 
//Evaluación de Cadena Valida de Email 
if (emailValido.match(expresionRegularEmail) !== null) {
    console.log("Email Válido");
}
else if (emailValido.match(expresionRegularEmail) === null) {
	console.log("Email Invalido");
}
```


## Expresion Regular Dni
```
const expresionRegularDni = /^[0-9]{8}[A-Z]$/;

const dniValido = "05953694Y";
const dniInvalido = "059536945"

if (dniValido.match(expresionRegularDni) !== null) {
	console.log("Dni valido")
}
else if (dniInvalido.match(expresionRegularDni) === null) {
	console.log("Dni invalido")
}
```


## Expresion Regular Telefono
```
const expresionRegularTelefono = /^[0-9]{9}$/;

const telefonoValido = "690215092"; // Telefono con 9 numeros
const telefonoInvalido = "1234567890"; // Telefono con 10 numeros

if (telefonoValido.match(expresionRegularTelefono) !== null) {
	console.log("Telefono valido")
}
else if (telefonoValido.match(expresionRegularTelefono) === null) {
	console.log("Telefono invalido")
}
```


## Expresion Regular ObjectId
```
const expresionRegularObjectId = /^[0-9a-fA-F]{24}$/;

const ObjectIdValido = "649c4e14e0721ad0c6f97f96";
const ObjectIdInValido = "649c4e14e0721ad0c6f97f96";

if (ObjectIdValido.match(expresionRegularTelefono) !== null) {
	console.log("ObjectId valido")
}
else if (ObjectIdValido.match(expresionRegularObjectId) === null) {
	console.log("ObjectId invalido")
}
```