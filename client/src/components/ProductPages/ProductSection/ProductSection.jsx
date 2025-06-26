import React, { useEffect, useState } from 'react';
import ProdactShape from '../../../img/product/shape-1.png'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, postData } from '../../../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMyContext } from '../../../context/MyContext';

const ProductSection = () => {
    const [activeTab, setActiveTab] = useState('Tab3');
    const [productsByCategory, setProductsByCategory] = useState({
        Tab1: [], // Business Cards
        Tab2: [], // Books & Prints
        Tab3: [], // Otaku Vibes (Anime)
        Tab4: []  // Invitation Card
    });
    const { setCartData } = useMyContext();

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const openTab = (TabName) => {
        setActiveTab(TabName);
    }

    const user = JSON.parse(localStorage.getItem('user'));

    const handleAddToCart = async (product) => {
        try {

            if (!user) {
                toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
                return;
            }

            // Chuẩn bị dữ liệu cho cart item
            const cartData = {
                productTitle: product.name,
                images: product.images,
                rating: product.rating || "0",
                price: product.price,
                quantity: 1, // Số lượng mặc định
                subTotal: product.price, // Tổng tiền ban đầu
                productId: product._id,
                userId: user.userId,
                classifications: [{
                    name: "Default",
                    image: product.images[0],
                    price: product.price,
                    quantity: 1,
                    subTotal: product.price
                }]
            };

            const response = await postData('/api/cart/add', cartData);

            if (response.status === false) {
                toast.error(response.message || 'Không thể thêm vào giỏ hàng');
            } else {
                toast.success(`Sản phẩm đã được thêm vào giỏ hàng`);
                // Fetch lại cart và cập nhật context
                const updatedCart = await fetchDataFromApi(`/api/cart?userId=${user.userId}`);
                setCartData(updatedCart);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    };

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                // Fetch products for each category
                const businessCards = await fetchDataFromApi('/api/products?catName=Business Cards');
                const booksPrints = await fetchDataFromApi('/api/products?catName=Books & Prints');
                const tshirts = await fetchDataFromApi('/api/products?catName=Otaku Vibes (Anime)');
                const invitations = await fetchDataFromApi('/api/products?catName=InkMe Signature');

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
        openTab('Tab3');
    }, []);

    const renderProductGrid = (products) => {
        return (
            <div className="row">
                {products.length > 0 &&
                    products.slice(0, 8).map((product, pitem) => (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={pitem}>
                            <div className="product-box-items style-2">
                                <div className="product-image">
                                    <Link to={`/shop-details/${product._id}`}>
                                        <img src={product.images[0]} alt={product.name} />
                                    </Link>
                                    <div className="post-box">
                                        new
                                    </div>
                                    <ul className="product-icon d-grid align-items-center">
                                        <li>
                                            <button
                                                onClick={() => handleAddToCart(product)}><i className="fa-sharp fa-regular fa-eye"></i></button>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa-regular fa-star"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <Link to={`/shop-details/${product._id}`}><i className="fa-regular fa-arrow-up-arrow-down"></i></Link>
                                        </li>
                                    </ul>
                                    <div className="shop-btn">
                                        <button
                                            onClick={() => handleAddToCart(product)} className="theme-btn">Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                                <div className="product-content">
                                    <h6><Link to={`/shop-details/${product._id}`}>{product.name}</Link></h6>
                                    <div className="star">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid fa-star ${i === 4 ? 'color-2' : ''}`}></i>
                                        ))}
                                    </div>
                                    <ul className="price">
                                        <li>
                                            {product.oldPrice ? (
                                                <span>( {product.price.toLocaleString('vi-VN')}đ - <del>{product.oldPrice.toLocaleString('vi-VN')}đ</del> )</span>
                                            ) : (
                                                <span>{product.price.toLocaleString('vi-VN')}đ</span>
                                            )}
                                        </li>
                                    </ul>
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
                    <Link to="/shop" className="theme-btn">Xem tất cả sản phẩm</Link>
                </div>
            </div>
        </section>
    );
};

export default ProductSection;