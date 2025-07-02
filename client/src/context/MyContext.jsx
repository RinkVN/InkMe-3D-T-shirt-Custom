import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Login } from "../services/UserServices";
import { googleLogout } from "@react-oauth/google";
import { fetchDataFromApi, postData } from "../utils/api";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [productData, setProductData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [orderData, setOrderData] = useState({});
  const [showHeader, setShowHeader] = useState(true);

  const [loading, setLoading] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [addingInCart, setAddingInCart] = useState(false);

  // Safely get user from localStorage
  const getUserLocalStorage = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  const user = getUserLocalStorage();

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

  // Add to cart function
  const addToCart = async (cartItem) => {
    if (!user?.userId) {
      setAlterBox({
        message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        error: true,
        open: true,
      });
      return;
    }

    setAddingInCart(true);

    try {
      // Prepare cart data
      const cartData = {
        productTitle: cartItem.name || cartItem.productTitle,
        images: cartItem.images || [cartItem.image],
        rating: cartItem.rating || 0,
        price: cartItem.price,
        quantity: cartItem.quantity || 1,
        subTotal: cartItem.price * (cartItem.quantity || 1),
        productId: cartItem.id || cartItem.productId,
        userId: user.userId,
        productColor: cartItem.selectedColor || '',
        productSize: cartItem.selectedSize || '',
        classifications: [{
          name: `${cartItem.selectedSize || ''} - ${cartItem.selectedColor || ''}`.trim().replace(/^-\s*|-\s*$/g, ''),
          image: Array.isArray(cartItem.images) ? cartItem.images[0] : cartItem.images || '',
          price: cartItem.price,
          quantity: cartItem.quantity || 1,
          subTotal: cartItem.price * (cartItem.quantity || 1)
        }]
      };

      const response = await postData('/api/cart/add', cartData);

      if (response && !response.error) {
        // Refresh cart data
        const updatedCart = await fetchDataFromApi(`/api/cart?userId=${user.userId}`);
        setCartData(Array.isArray(updatedCart) ? updatedCart : []);

        setAlterBox({
          message: "Sản phẩm đã được thêm vào giỏ hàng",
          error: false,
          open: true,
        });
      } else {
        setAlterBox({
          message: response.message || "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng",
          error: true,
          open: true,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAlterBox({
        message: "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng",
        error: true,
        open: true,
      });
    } finally {
      setAddingInCart(false);
    }
  };

  // Get cart data
  const getCartData = async () => {
    if (user?.userId) {
      try {
        const cartRes = await fetchDataFromApi(`/api/cart?userId=${user.userId}`);
        setCartData(Array.isArray(cartRes) ? cartRes : []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartData([]);
      }
    }
  };

  return (
    <MyContext.Provider
      value={{
        // User related
        user,
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
        addToCart,
        getCartData,
        addingInCart,
        setAddingInCart,
        loading,
        setLoading,

        // Address related
        selectedAddressId,
        setSelectedAddressId,

        // Order related
        orderData,
        setOrderData,

        // Header related
        showHeader,
        setShowHeader,
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
