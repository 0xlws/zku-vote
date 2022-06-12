import { createContext } from "react";
import { DiscordUser, Props } from "../utils/types"


const contextDefaultValues = {
    page: "" || null,
    setPage: (page: string | null) => {}
  };

export const PageContext = createContext(contextDefaultValues);
