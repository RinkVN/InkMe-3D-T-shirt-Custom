import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Login } from "../services/UserServices";
import { googleLogout } from "@react-oauth/google";
import { fetchDataFromApi } from "../utils/api";

//1. Create Context
const MyContext = createContext();

//2. Create Provider
const MyProvider = ({ children }) => {
  // User related state
  const [userId, setUserId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');

  // Alert box state
  const [alterBox, setAlterBox] = useState({
    message: "",
    error: false,
    open: false,
  });

  // Fetch category data
  useEffect(() => {
    fetchDataFromApi('/api/category').then((res) => {
      setCategoryData(res.categoryList);
    });
  }, []);

  // Check user token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        setUserId(decodedToken.id);
      }
    }
  }, []);

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
    googleLogout();
    setUserId(null);
  };

  return (
    <MyContext.Provider
      value={{
        // User related
        userId,
        setUserId,
        Login,
        logout,

        // Category related
        categoryData,
        setCategoryData,
        activeCat,
        setActiveCat,

        // Alert related
        alterBox,
        setAlterBox,
        handleClose,
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
