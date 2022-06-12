import { createContext } from "react";
import { DiscordUser, Props } from "../utils/types"


const contextDefaultValues = {
    page: "1",
    setPage: (page: string ) => {}
  };

export const PageContext = createContext(contextDefaultValues);
