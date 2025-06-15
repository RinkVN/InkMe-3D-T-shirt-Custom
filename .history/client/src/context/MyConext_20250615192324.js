import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Login } from "../services/UserServices";

//1. Create Context
const MyContext = createContext();

//2. Create Provider
const MyProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("userId", decodedToken.id);
      if (decodedToken) {
        setUserId(decodedToken.id);
      }
    }
  });

  const [alterBox, setAlterBox] = useState({
    message: "",
    error: false,
    open: false,
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlterBox({
      open: false,
    });
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUserId(null);
  };

  return (
    <MyContext.Provider
      value={{
        userId,
        setUserId,
        Login,
        alterBox,
        setAlterBox,
        handleClose,
        logout,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

//3. Custom Hook to use context easier
export const useMyContext = () => {
  return useContext(MyContext);
};
export { MyContext, MyProvider };
