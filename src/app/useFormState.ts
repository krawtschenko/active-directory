import { useReducer } from "react";
import type { Action, PasswordOptions } from "../types";

// Весь стан форми разом із сеттерами — передається як єдиний об'єкт у Form
export type FormState = {
  action: Action;
  name: string;
  surname: string;
  userPassword: string;
  location: string;
  users: string;
  groups: string;
  folders: string;
  suffix: string;
  prefix: string;
  kadry: boolean;
  password: string;
  passwordOptions: PasswordOptions;
  setAction: (value: Action) => void;
  setLocation: (value: string) => void;
  setUsers: (value: string) => void;
  setGroups: (value: string) => void;
  setName: (value: string) => void;
  setSurname: (value: string) => void;
  setUserPassword: (value: string) => void;
  setFolders: (value: string) => void;
  setSuffix: (value: string) => void;
  setPrefix: (value: string) => void;
  setKadry: (value: boolean) => void;
  setPassword: (value: string) => void;
  setPasswordOptions: (value: Partial<PasswordOptions>) => void;
};

type State = Pick<
  FormState,
  | "action"
  | "name"
  | "surname"
  | "userPassword"
  | "location"
  | "users"
  | "groups"
  | "folders"
  | "suffix"
  | "prefix"
  | "kadry"
  | "password"
  | "passwordOptions"
>;

type FormAction =
  | { type: "SET_ACTION"; payload: Action }
  | {
      type: "SET_STRING_FIELD";
      field:
        | "name"
        | "surname"
        | "userPassword"
        | "location"
        | "users"
        | "groups"
        | "folders"
        | "suffix"
        | "prefix"
        | "password";
      value: string;
    }
  | { type: "SET_KADRY"; value: boolean }
  | { type: "SET_PASSWORD_OPTIONS"; value: Partial<PasswordOptions> };

const initialState: State = {
  action: "add",
  name: "",
  surname: "",
  userPassword: "",
  location: "",
  users: "",
  groups: "",
  folders: "",
  suffix: "",
  prefix: "",
  kadry: false,
  password: "",
  passwordOptions: {
    uppercase: true,
    numbers: true,
    symbols: true,
    noAmbiguous: true,
  },
};

function reducer(state: State, action: FormAction): State {
  switch (action.type) {
    // При зміні дії скидаємо всі поля до початкових значень
    case "SET_ACTION":
      return { ...initialState, action: action.payload };
    case "SET_STRING_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_KADRY":
      return { ...state, kadry: action.value };
    case "SET_PASSWORD_OPTIONS":
      return {
        ...state,
        passwordOptions: { ...state.passwordOptions, ...action.value },
      };
  }
}

export function useFormState(): FormState {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    ...state,
    setAction: (value) => dispatch({ type: "SET_ACTION", payload: value }),
    setName: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "name", value }),
    setSurname: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "surname", value }),
    setUserPassword: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "userPassword", value }),
    setLocation: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "location", value }),
    setUsers: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "users", value }),
    setGroups: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "groups", value }),
    setFolders: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "folders", value }),
    setSuffix: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "suffix", value }),
    setPrefix: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "prefix", value }),
    setKadry: (value) => dispatch({ type: "SET_KADRY", value }),
    setPassword: (value) =>
      dispatch({ type: "SET_STRING_FIELD", field: "password", value }),
    setPasswordOptions: (value) =>
      dispatch({ type: "SET_PASSWORD_OPTIONS", value }),
  };
}
