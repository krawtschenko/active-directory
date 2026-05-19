export type Action =
  | "createUser"
  | "createFolder"
  | "create"
  | "add"
  | "rx"
  | "m"
  | "sql"
  | "password";

export type PasswordOptions = {
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  noAmbiguous: boolean;
};
