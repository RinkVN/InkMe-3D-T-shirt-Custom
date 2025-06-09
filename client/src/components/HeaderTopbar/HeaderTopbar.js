import React from 'react'
import { Link } from 'react-router-dom'
import CurrentDoler from './CurrentDoler';

const HeaderTopbar = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="container-fluid">
            <div className="header-top-wrapper">
                <p><Link onClick={ClickHandler} to="del:+41888567890">(+84)968338829</Link>  - 24/7</p>
                <p> 🔥 Miễn phí vận chuyển với đơn hàng trên 1000.000đ </p>
                <div className="header-top-right">
                    <div className="social-icon d-flex align-items-center">
                        <Link onClick={ClickHandler} to="#"><i className="fab fa-facebook-f"></i></Link>
                        <Link onClick={ClickHandler} to="#"><i className="fab fa-twitter"></i></Link>
                        <Link onClick={ClickHandler} to="#"><i className="fab fa-instagram"></i></Link>
                        <Link onClick={ClickHandler} to="#"><i className="fab fa-pinterest-p"></i></Link>
                    </div>
                    <CurrentDoler />
                </div>
            </div>
        </div>
    )
}

export default HeaderTopbar;