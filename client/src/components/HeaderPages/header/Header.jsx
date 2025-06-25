import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { removeFromCart } from "../../../store/actions/action";
import HeaderTopbar from '../HeaderTopbar/HeaderTopbar';
// import Logo from '../../img/logo/black-logo.svg';
import Logo from '../../../img/logo/inkme-logo-gradient.png';
import Home1 from '../../../img/header/home-1.jpg';
import Home2 from '../../../img/header/home-2.jpg';
import Home3 from '../../../img/header/home-3.jpg';
import SearchComponent from './search';
import MobileMenu from '../../MobileMenu/MobileMenu';
import { useMyContext } from '../../../context/MyConext';


const Header = (props) => {


    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const { carts } = props;

    const user = JSON.parse(localStorage.getItem('user'));

    const [isSticky, setIsSticky] = useState(false);

    const { cartData } = useMyContext();

    const totalQuantity = cartData.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={props.hclass}>
            <HeaderTopbar />
            <div id="header-sticky" className={isSticky ? 'sticky' : 'header-1'}>
                <div className="container-fluid">
                    <div className="mega-menu-wrapper">
                        <div className="header-main">
                            <div className="header-left">
                                <div className="logo">
                                    <Link onClick={ClickHandler} to="/" className="header-logo">
                                        <img src={Logo} alt="logo-img" />
                                    </Link>
                                </div>
                            </div>
                            <div className="mean__menu-wrapper">
                                <div className="main-menu">
                                    <nav id="mobile-menu">
                                        <ul>
                                            <li className="has-dropdown active menu-thumb">
                                                <Link onClick={ClickHandler} to="/home">
                                                    Trang chủ
                                                </Link>
                                                <ul className="submenu has-homemenu">
                                                    <li>
                                                        <div className="homemenu-items">
                                                            <div className="homemenu">
                                                                <div className="homemenu-thumb">
                                                                    <img src={Home1} alt="img" />
                                                                    <div className="demo-button">
                                                                        <Link onClick={ClickHandler} to="/home" className="theme-btn">
                                                                            Demo Page
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="homemenu-content text-center">
                                                                    <h4 className="homemenu-title">
                                                                        Home 01
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <div className="homemenu">
                                                                <div className="homemenu-thumb mb-15">
                                                                    <img src={Home2} alt="img" />
                                                                    <div className="demo-button">
                                                                        <Link onClick={ClickHandler} to="/home-2" className="theme-btn">
                                                                            Demo Page
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="homemenu-content text-center">
                                                                    <h4 className="homemenu-title">
                                                                        Home 02
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <div className="homemenu">
                                                                <div className="homemenu-thumb mb-15">
                                                                    <img src={Home3} alt="img" />
                                                                    <div className="demo-button">
                                                                        <Link onClick={ClickHandler} to="/home-3" className="theme-btn">
                                                                            Demo Page
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="homemenu-content text-center">
                                                                    <h4 className="homemenu-title">
                                                                        Home 03
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="has-dropdown active d-xl-none">
                                                <Link onClick={ClickHandler} to="/team" className="border-none">
                                                    Home
                                                </Link>
                                                <ul className="submenu">
                                                    <li><Link onClick={ClickHandler} to="/home">Home 01</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/home-2">Home 02</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/home-3">Home 03</Link></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link onClick={ClickHandler} to="/about">Về chúng tôi</Link>
                                            </li>
                                            <li>
                                                <Link onClick={ClickHandler} to="#">
                                                    Dịch vụ
                                                </Link>
                                                <ul className="submenu">
                                                    <li><Link onClick={ClickHandler} to="/service">Dịch vụ</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/service-details/Sticker-printing">Chi tiết dịch vụ</Link></li>
                                                </ul>
                                            </li>
                                            <li className="has-dropdown">
                                                <Link onClick={ClickHandler} to="#">
                                                    Dự án
                                                </Link>
                                                <ul className="submenu">
                                                    <li><Link onClick={ClickHandler} to="/project">Dự án</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/project-details/3d-Genareted-Cate">Chi tiết dự án</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/404">404 Page</Link></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link onClick={ClickHandler} to="#">
                                                    Cửa hàng
                                                </Link>
                                                <ul className="submenu">
                                                    <li><Link onClick={ClickHandler} to="/shop">Cửa hàng</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/shop-details/Calendar-printing-design">Chi tiết cửa hàng</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/shop-cart">Giỏ hàng</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/checkout">Thanh toán</Link></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link onClick={ClickHandler} to="#">
                                                    Tin tức
                                                </Link>
                                                <ul className="submenu">
                                                    <li><Link onClick={ClickHandler} to="/news">Tin tức</Link></li>
                                                    <li><Link onClick={ClickHandler} to="/blog-single/How-To-Teach-Kids-Ramadan-Isn't-About-Food">Chi tiết tin tức</Link></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link onClick={ClickHandler} to="/contact">Liên hệ</Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <div className="header-right d-flex justify-content-end align-items-center">
                                <SearchComponent />
                                <h5 className="cart-title">
                                    <Link
                                        onClick={ClickHandler}
                                        to={user ? `/shop-cart/${user.userId}` : "/login"}
                                    >
                                        Giỏ hàng <span className='cart-count'>{totalQuantity}</span>
                                    </Link>
                                </h5>
                                <div className="header__hamburger d-xl-none my-auto">
                                    <div className="sidebar__toggle">
                                        <MobileMenu />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
const mapStateToProps = (state) => {
    return {
        carts: state.cartList.cart,
    };
};


export default connect(mapStateToProps, { removeFromCart })(Header);









