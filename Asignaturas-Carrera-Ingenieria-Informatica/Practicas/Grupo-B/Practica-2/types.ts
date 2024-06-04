export type Users = {
  DNI: string;
  Nombre: string;
  Apellidos: string;
  Telefono: string;
  Email: string;
  IBAN: string;
  Balance: number;
  ID: number;
};

export type Transactions = {
  ID_Sender: number;
  ID_Receiver: number;
  Amount: number;
};

export const arrayUsuarios: Users[] = [
  {
    DNI: "12345678A",
    Nombre: "John",
    Apellidos: "Doe",
    Telefono: "123456789",
    Email: "hola@gmail.com",
    IBAN: "ES1234567890123456789012",
    Balance: 1000,
    ID: 1,
  },
  {
    DNI: "87654321B",
    Nombre: "Jane",
    Apellidos: "Doenh",
    Telefono: "987654321",
    Email: "dgonzalezs2@gmail.com",
    IBAN: "ES9876543210987654321098",
    Balance: 2000,
    ID: 2,
  },
];
