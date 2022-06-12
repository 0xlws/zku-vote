import { createContext } from "react";
import { DiscordUser, Props } from "../utils/types"


const contextDefaultValues = {
    auth: false || {} ,
    setAuth: (user: DiscordUser | boolean ) => {}
  };

export const AuthContext = createContext(contextDefaultValues);
