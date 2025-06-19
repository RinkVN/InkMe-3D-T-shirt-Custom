import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Login } from "../services/UserServices";
import { googleLogout } from "@react-oauth/google";
import { fetchDataFromApi } from "../utils/api";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [productData, setProductData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [orderData, setOrderData] = useState({});

  const [loading, setLoading] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

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

    fetchDataFromApi('/api/products').then((res) => {
      setProductData(res.productList);
    });

    if (user?.userId) {
      fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
        setCartData(Array.isArray(res) ? res : []);
      }).catch((error) => {
        console.error("Error fetching cart data:", error);
        setCartData([]);
      });
    } else {
      setCartData([]);
    }

    if (user?.userId) {
      fetchDataFromApi(`/api/orders/user/${user.userId}`).then((res) => {
        setOrderData(res);
      });
    } else {
      setOrderData([]);
    }

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

        // Cart related
        cartData,
        setCartData,
        loading,
        setLoading,

        // Address related
        selectedAddressId,
        setSelectedAddressId,

        // Order related
        orderData,
        setOrderData,
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
