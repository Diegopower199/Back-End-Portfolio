import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { arrayUsuarios, Users } from "../types.ts";

let contadorParaIDIBAN = arrayUsuarios.length + 1;
let ibanModelo = "ES0000000000000000000000";

type AddUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addUser = async (context: AddUserContext) => {
  const listaDeErrores: string[] = [];
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (
      !value?.Email ||
      !value?.Nombre ||
      !value?.Apellidos ||
      !value?.Telefono ||
      !value?.DNI
    ) {
      context.response.body = {
        message: "Faltan datos!",
      };
      context.response.status = 400;
      return;
    } else if (
      arrayUsuarios.find(
        (usuario) =>
          usuario.ID === value.ID ||
          usuario.DNI === value.DNI ||
          usuario.Email === value.Email ||
          usuario.IBAN === value.IBAN ||
          usuario.Telefono === value.Telefono
      )
    ) {
      context.response.body = {
        message: "El usuario ya existe!",
      };
      context.response.status = 400;
      return;
    } else {
      if (typeof value.DNI !== "string") {
        listaDeErrores.push(
          "Error, el DNI no tiene un formato correcto, debe ser string"
        );
      } else if (value.DNI.length === 9) {
        try {
          value.DNI.split("").forEach((letras: string, posicion: number) => {
            if (
              !(
                posicion !== 8 &&
                letras.charCodeAt(0) >= 48 &&
                letras.charCodeAt(0) <= 57
              ) ||
              !(
                posicion === 8 &&
                letras.charCodeAt(0) >= 65 &&
                letras.charCodeAt(0) <= 90
              )
            ) {
              throw "Error, usted no ha seguido la estructura de DNI";
            }
          });
        } catch (error) {
          listaDeErrores.push(error);
        }
      } else {
        listaDeErrores.push(
          "Error, el tamaño del DNI no es el correcto, debe ser 8 primeros numeros y el ultimo una letra en mayúscula"
        );
      }

      if (typeof value.Nombre !== "string") {
        listaDeErrores.push(
          "Error, el nombre no tiene un formato correcto, debe ser string"
        );
      }

      if (typeof value.Apellidos !== "string") {
        listaDeErrores.push(
          "Error, el apellido no tiene un formato correcto, debe ser string"
        );
      }

      if (typeof value.Telefono !== "string") {
        listaDeErrores.push(
          "Error, el telefono no tiene un formato correcto, debe ser string"
        );
      } else if (value.Telefono.length === 9) {
        try {
          value.Telefono.split("").forEach((letras: string) => {
            if (!(letras.charCodeAt(0) >= 48 && letras.charCodeAt(0) <= 57)) {
              throw "Error, usted no ha seguido la estructura de telefono";
            }
          });
        } catch (error) {
          listaDeErrores.push(error);
        }
      } else {
        listaDeErrores.push(
          "Error, el tamaño del Telefono no es el correcto, debe ser 9 digitos"
        );
      }

      if (typeof value.Email !== "string") {
        listaDeErrores.push(
          "Error, el email no tiene un formato correcto, debe ser string"
        );
      } else if (
        !value.Email.includes("@gmail.com" || "@outlook.es" || "@hotmail.com")
      ) {
        listaDeErrores.push(
          "Error, no hay direccion de correo valida, debe ser '@gmail.com', '@outlook.es' o '@hotmail.com'"
        );
      }

      if (typeof value.ID !== "undefined") {
        listaDeErrores.push("Error, usted no puede introducir un ID");
      }

      if (typeof value.IBAN !== "undefined") {
        listaDeErrores.push("Error, usted no puede introducir un IBAN");
      }

      if (typeof value.Balance !== "number") {
        listaDeErrores.push(
          "Error, el balance no tiene un formato correcto, debe ser number"
        );
      } else if (value.Balance < 0) {
        listaDeErrores.push("Error, el balance no puede ser negativo");
      }

      if (listaDeErrores.length != 0) {
        context.response.body = listaDeErrores;
        context.response.status = 500;
        return;
      }

      ibanModelo =
        ibanModelo.substring(
          0,
          ibanModelo.length - contadorParaIDIBAN.toString().length
        ) + contadorParaIDIBAN;

      const usuarioNuevo: Users = {
        DNI: value.DNI,
        Nombre: value.Nombre,
        Apellidos: value.Apellidos,
        Telefono: value.Telefono,
        Email: value.Email,
        IBAN: ibanModelo,
        Balance: value.Balance,
        ID: contadorParaIDIBAN,
      };

      contadorParaIDIBAN++;
      arrayUsuarios.push(usuarioNuevo);

      context.response.status = 201;
      context.response.body = "Usuario creado";
    }
  } catch (error) {
    context.response.status = 500;
    context.response.body = error;
  }
};

type AddTransactionContext = RouterContext<
  "/addTransaction",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addTransaction = async (context: AddTransactionContext) => {
  const listaDeErrores: string[] = [];

  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.ID_Sender || !value?.ID_Receiver || !value?.Amount) {
      context.response.body = {
        message: "Faltan datos!",
      };
      context.response.status = 400;
      return;
    }

    if (typeof value.ID_Sender !== "number") {
      listaDeErrores.push(
        "Error, el id sender no tiene un formato correcto, debe ser number"
      );
    }

    if (typeof value.ID_Receiver !== "number") {
      listaDeErrores.push(
        "Error, el id receiver no tiene un formato correcto, debe ser number"
      );
    }

    if (typeof value.Amount !== "number") {
      listaDeErrores.push(
        "Error, el balance no tiene un formato correcto, debe ser number"
      );
    }

    if (listaDeErrores.length != 0) {
      context.response.body = listaDeErrores;
      context.response.status = 500;
      return;
    } else {
      const usuarioSender: Users | undefined = arrayUsuarios.find((usuario) => {
        return usuario.ID === value.ID_Sender;
      });

      const usuarioReceiver: Users | undefined = arrayUsuarios.find(
        (usuario) => {
          return usuario.ID === value.ID_Receiver;
        }
      );

      if (!usuarioSender || !usuarioReceiver) {
        context.response.body = {
          message: "No se ha encontrado el usuario!",
        };
        context.response.status = 404;
        return;
      }

      if (value.Amount < 0) {
        context.response.body = {
          message: "La cantidad debe ser mayor que 0",
        };
        context.response.status = 400;
        return;
      }

      if (value.ID_Sender === value.ID_Receiver) {
        context.response.body = {
          message: "No puedes transferirte dinero a ti mismo!",
        };
        context.response.status = 400;
        return;
      }

      if (usuarioSender.Balance < value.Amount) {
        context.response.body = {
          message: "No tienes suficiente dinero!",
        };
        context.response.status = 400;
        return;
      }

      usuarioSender.Balance -= value.Amount;
      usuarioReceiver.Balance += value.Amount;

      context.response.status = 200;
      context.response.body = `Transaccion realizada con exito! ${usuarioSender.Nombre} ha transferido ${value.Amount}€ a ${usuarioReceiver.Nombre}`;
    }
  } catch (error) {
    context.response.status = 500;
    context.response.body = error;
  }
};
