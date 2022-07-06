import { createContext } from "react";

const contextDefaultValues = {
  LoggedIn: false,
  setLoggedIn: (page: boolean) => {},
};

export const LoginContext = createContext(contextDefaultValues);
