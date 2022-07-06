import { createContext } from "react";

const contextDefaultValues = {
  page: "1",
  setPage: (page: string) => {},
};

export const PageContext = createContext(contextDefaultValues);
