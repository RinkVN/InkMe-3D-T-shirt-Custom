import React, { useEffect, useState } from 'react';
import ProdactShape from '../../img/product/shape-1.png'
import { Link } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';

const ProductSection = ({ addToCartProduct }) => {
    const [activeTab, setActiveTab] = useState('Tab2');
    const [productsByCategory, setProductsByCategory] = useState({
        Tab1: [], // Business Cards
        Tab2: [], // Books & Prints
        Tab3: [], // T-shirt & Cloths
        Tab4: []  // Invitation Card
    });

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const openTab = (TabName) => {
        setActiveTab(TabName);
    }

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                // Fetch products for each category
                const businessCards = await fetchDataFromApi('/api/products?catName=Business Cards');
                const booksPrints = await fetchDataFromApi('/api/products?catName=Books & Prints');
                const tshirts = await fetchDataFromApi('/api/products?catName=Otaku Vibes (Anime)');
                const invitations = await fetchDataFromApi('/api/products?catName=Invitation Card');

                setProductsByCategory({
                    Tab1: businessCards.products || [],
                    Tab2: booksPrints.products || [],
                    Tab3: tshirts.products || [],
                    Tab4: invitations.products || []
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductsByCategory();
        openTab('Tab2');
    }, []);

    const renderProductGrid = (products) => {
        return (
            <div className="row">
                {products.length > 0 &&
                    products.slice(0, 8).map((product, pitem) => (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={pitem}>
                            <div className="product-box-items">
                                <div className="product-image">
                                    <img src={product.images[0]} alt={product.name} />
                                    <ul className="product-icon d-grid align-items-center">
                                        <li>
                                            <button
                                                onClick={() => addToCartProduct(product)}><i className="fa-sharp fa-regular fa-eye"></i></button>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa-regular fa-star"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <Link onClick={ClickHandler} to={`/shop-details/${product._id}`}><i className="fa-regular fa-arrow-up-arrow-down"></i></Link>
                                        </li>
                                    </ul>
                                    <div className="shop-btn">
                                        <button
                                            onClick={() => addToCartProduct(product)} className="theme-btn">Add To Cart</button>
                                    </div>
                                </div>
                                <div className="product-content">
                                    <div className="star">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid fa-star ${i === 4 ? 'color-2' : ''}`}></i>
                                        ))}
                                    </div>
                                    <h6><Link onClick={ClickHandler} to={`/shop-details/${product._id}`}>{product.name}</Link></h6>
                                    <span>{product.price.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        );
    };

    return (
        <section className="product-section section-padding pt-0">
            <div className="shape-image">
                <img src={ProdactShape} alt="img" />
            </div>
            <div className="container">
                <div className="section-title text-center">
                    <h6>Digital printing Service</h6>
                    <h2>Khám Phá Sản Phẩm Nổi Bật🔥</h2>
                </div>
                <div className="product-header mt-4 mt-md-0">
                    <ul className="nav">
                        <li className="nav-item" >
                            <button className={`nav-link ${activeTab === 'Tab1' ? 'active' : ''}`} onClick={() => openTab('Tab1')}>
                                Business Cards
                            </button>
                        </li>
                        <li className="nav-item" >
                            <button className={`nav-link ${activeTab === 'Tab2' ? 'active' : ''}`} onClick={() => openTab('Tab2')}>
                                Books & Prints
                            </button>
                        </li>
                        <li className="nav-item" >
                            <button className={`nav-link ${activeTab === 'Tab3' ? 'active' : ''}`} onClick={() => openTab('Tab3')}>
                                Otaku Vibes (Anime)
                            </button>
                        </li>
                        <li className="nav-item" >
                            <button className={`nav-link ${activeTab === 'Tab4' ? 'active' : ''}`} onClick={() => openTab('Tab4')}>
                                Invitation Card
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="tab-content">
                    <div id="Tab1" style={{ display: activeTab === 'Tab1' ? 'block' : 'none' }}>
                        {renderProductGrid(productsByCategory.Tab1)}
                    </div>
                    <div id="Tab2" style={{ display: activeTab === 'Tab2' ? 'block' : 'none' }}>
                        {renderProductGrid(productsByCategory.Tab2)}
                    </div>
                    <div id="Tab3" style={{ display: activeTab === 'Tab3' ? 'block' : 'none' }}>
                        {renderProductGrid(productsByCategory.Tab3)}
                    </div>
                    <div id="Tab4" style={{ display: activeTab === 'Tab4' ? 'block' : 'none' }}>
                        {renderProductGrid(productsByCategory.Tab4)}
                    </div>
                </div>
                <div className="shop-button text-center mt-5 " >
                    <Link onClick={ClickHandler} to="/shop" className="theme-btn">View all Product</Link>
                </div>
            </div>
        </section>
    );
};

export default ProductSection;