import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import { getUsers } from "../services/UserServices";

//1. Create Context
const MyContext = createContext();

//2. Create Provider
const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userList = getUsers();
    console.log("userList", userList);
    setUser(userList);
  }, []);

  return (
    <MyContext.Provider value={{ user, setUser }}>
      {children}
    </MyContext.Provider>
  );
};

//3. Custom Hook to use context easier
export const useMyContext = () => {
  return useContext(MyContext);
};
export { MyContext, MyProvider };
