import { createContext } from "react";

type GlobalState = {
  campaign?: string;
  candidate?: string;
  proposal?: string;
  close?:boolean;
};

const contextDefaultValues = {
    data: { 
      campaign:"",
      candidate:"",
      proposal:"",
      close:false,
    } as GlobalState,
    setData: (state: GlobalState) => {}
  };

export const UserContext = createContext(contextDefaultValues);
