import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Homepage from '../HomePage/HomePage'
import HomePage2 from '../HomePage2/HomePage2';
import HomePage3 from '../HomePage3/HomePage3';
import AboutPage from '../AboutPage/AboutPage';
import ServicePage from '../ServicePage/ServicePage';
import ServiceSinglePage from '../ServiceSinglePage/ServiceSinglePage';
import ProjectPage from '../ProjectPage/ProjectPage';
import ProjectSinglePage from '../ProjectSinglePage/ProjectSinglePage';
import ShopPage from '../ShopPage'
import ShopSinglePage from '../ShopSinglePage';
import CartPage from '../CartPage';
import CheckoutPage from '../CheckoutPage';
import OrderRecived from '../OrderRecived';
import BlogPage from '../BlogPage/BlogPage'
import BlogDetails from '../BlogDetails/BlogDetails'
import ContactPage from '../ContactPage/ContactPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import { fetchDataFromApi } from '../../utils/api';

const MyContext = createContext();


const AllRoute = () => {

  const [categoryData, setCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');

  useEffect(() => {

    fetchDataFromApi('/api/category').then((res) => {
      setCategoryData(res.categoryList);
      // setActiveCat(res.categoryList[0]?.name);
    });

  }, []);

  const values = {
    categoryData,
    setCategoryData,
    activeCat,
    setActiveCat
  }

  return (
    <div className="App">
      <BrowserRouter>
      <MyContext.Provider value={values}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="home-2" element={<HomePage2 />} />
          <Route path="home-3" element={<HomePage3 />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="service-details/:slug" element={<ServiceSinglePage />} />
          <Route path="project" element={<ProjectPage />} />
          <Route path="project-details/:slug" element={<ProjectSinglePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path='shop-details/:slug' element={<ShopSinglePage />} />
          <Route path='shop-cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='order_received' element={<OrderRecived />} />
          <Route path='news' element={<BlogPage />} />
          <Route path='blog-single/:slug' element={<BlogDetails />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='404' element={<ErrorPage />} />
        </Routes>
        </MyContext.Provider>
      </BrowserRouter>

    </div>
  );
}

export default AllRoute;
export { MyContext };
