# Verificacion de datos


## Comprobar que es tipo string
```
if (typeof x !== "string") {
  context.response.body = { msg: "La campo x no es de tipo string", };
  context.response.status = 400;
  return;
}
```


## Comprobar que es un numeros enteros
```
if (typeof x !== "number" || !Number.isInteger(x)) {
    context.response.body = { msg: "El campo x no es de tipo entero (number)", };
    context.response.status = 400;
    return;
}
```


## Comprobar que es tipo boolean
```
if (typeof x !== "boolean") {
    context.response.body = { msg: "La campo x no es de tipo boolean", };
    context.response.status = 400;
    return;
}
```


## Comprobar que es un array de string
```
if (!Array.isArray(x) || !x.every((item) => typeof item === "string")) {
    context.response.body = { msg: "La variable x no es un array de strings", };
    context.response.status = 400;
    return;
}
```


## Comprobar que es un array de numeros enteros
```
if (!Array.isArray(x) || !x.every((item) => Number.isInteger(item))) {
    context.response.body = { msg: "La variable x no es un array de enteros", };
    context.response.status = 400;
    return;
}
```


## Comprobar que es un array de boolean
```
if (!Array.isArray(x) || !x.every((item) => typeof item === "boolean")) {
    context.response.body = { msg: "La variable x no es un array de booleanos", };
    context.response.status = 400;
    return;
}
```


## Comprobar que es un objeto Date
```
if (!(x instanceof Date)) {
    context.response.body = { msg: "La variable x no es de tipo Date", };
    context.response.status = 400;
    return;
}
```