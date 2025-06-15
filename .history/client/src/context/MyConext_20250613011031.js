import React, { useContext } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";

//1. Create Context
const MyContext = createContext();

//2. Create Provider
const MyProvider = ({ children }) => {
  return <MyContext.Provider value={{}}>{children}</MyContext.Provider>;
};

//3. Custom Hook to use context easier
export const useMyContext = () => {
  return useContext(MyContext);
};
