import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import { getUsers } from "../services/UserServices";
import { baseUrl, postData } from "../utils/api";

//1. Create Context
const MyContext = createContext();

//2. Create Provider
const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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

    const Login = (email, password) => {
      const response = postData(`${baseUrl}/user/signin`, { email, password });
      if (response) {
        console.log("Login successfull", response);
      } else {
        console.log("login failed");
      }
    };
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
