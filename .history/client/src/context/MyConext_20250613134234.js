import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import { getUsers, Login } from "../services/UserServices";

//1. Create Context
const MyContext = createContext();

//2. Create Provider
const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userList = await getUsers(); // Chờ dữ liệu trả về
        console.log("userList", userList); // In đúng dữ liệu
        setUser(userList);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUser(); // Gọi hàm async bên trong useEffect
  }, []);

  return (
    <MyContext.Provider value={{ user, setUser, Login, alert, setAlterBox }}>
      {children}
    </MyContext.Provider>
  );
};

//3. Custom Hook to use context easier
export const useMyContext = () => {
  return useContext(MyContext);
};
export { MyContext, MyProvider };
