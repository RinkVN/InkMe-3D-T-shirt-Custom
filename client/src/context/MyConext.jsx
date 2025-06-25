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

  // Safely get user from localStorage
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  const user = getUser();

  const [alterBox, setAlterBox] = useState({
    message: "",
    error: false,
    open: false,
  });

  // Fetch category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await fetchDataFromApi('/api/category');
        setCategoryData(categoryRes.categoryList || []);

        const productRes = await fetchDataFromApi('/api/products');
        setProductData(productRes.productList || []);

        if (user?.userId) {
          const cartRes = await fetchDataFromApi(`/api/cart?userId=${user.userId}`);
          setCartData(Array.isArray(cartRes) ? cartRes : []);
        } else {
          setCartData([]);
        }

        if (user?.userId) {
          const orderRes = await fetchDataFromApi(`/api/orders/user/${user.userId}`);
          setOrderData(orderRes || {});
        } else {
          setOrderData({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategoryData([]);
        setProductData([]);
        setCartData([]);
        setOrderData({});
      }
    };

    fetchData();
  }, [user?.userId]);

  // Check user token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken) {
          setUserId(decodedToken.id);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setUserId(null);
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
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      googleLogout();
      setUserId(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
