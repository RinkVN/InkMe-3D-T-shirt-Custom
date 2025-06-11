import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Pimg1 from '../../img/portfolio/cap.png'
import Pimg2 from '../../img/portfolio/shape-2.png'
import Pimg3 from '../../img/portfolio/shape-3.png'
import Portfolio from '../../api/Portfolio';

const PortfolioSection = () => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [activeImage, setActiveImage] = useState(null);

    const handleMouseMove = (event, index) => {
        const contentBox = event.target.getBoundingClientRect();
        const dx = event.clientX - contentBox.x;
        const dy = event.clientY - contentBox.y;
        setCursorPos({ x: dx, y: dy });
        setActiveImage(index);
    };

    const handleMouseLeave = () => {
        setActiveImage(null);
    };

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    return (
        <section className="portfolio-section section-padding pt-0">
            <div className="portfolio-wrapper">
                <div className="cap-shape float-bob-x">
                    <img src={Pimg1} alt="img" />
                </div>
                <div className="shape-2 float-bob-y">
                    <img src={Pimg2} alt="img" />
                </div>
                <div className="shape-3">
                    <img src={Pimg3} alt="img" />
                </div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-6">
                            <div className="portfolio-content">
                                <div className="section-title">
                                    <h6 className="wow fadeInUp">Dự án nổi bật</h6>
                                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                        Khám phá một số dự án mà chúng tôi đã thực hiện cho doanh nghiệp!
                                    </h2>
                                </div>
                                <ul className="list-items mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                                    <li>
                                        <i className="fa-regular fa-check"></i>
                                        In Ấn Đặc Biệt Theo Yêu Cầu
                                    </li>
                                    <li>
                                        <i className="fa-regular fa-check"></i>
                                        Giải Pháp In Ấn Doanh Nghiệp
                                    </li>
                                    <li>
                                        <i className="fa-regular fa-check"></i>
                                        Đơn Hàng Tuỳ Chỉnh
                                    </li>
                                </ul>
                                <Link to="/shop" className="theme-btn wow fadeInUp" data-wow-delay=".3s">Liên Hệ Ngay</Link>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="portfolio-image-items">
                                <div className="row g-0">
                                    {Portfolio.slice(0, 4).map((portfoli, index) => (
                                        <div
                                            className="col-lg-6 col-md-6 wow fadeInUp"
                                            data-wow-delay=".2s"
                                            key={index}
                                            onMouseMove={(e) => handleMouseMove(e, index)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="portfolio-image">
                                                <img src={portfoli.pimg1} alt="img" style={{ width: '448px', height: '448px', objectFit: 'cover' }} />
                                                <Link onClick={ClickHandler} to={`/project-details/${portfoli.slug}`} className="icon">
                                                    <i className="fa-solid fa-arrow-right"></i>
                                                </Link>
                                                {/* <div className="portfolio-content" style={{ transform: activeImage === index ? `translate(${cursorPos.x}px, ${cursorPos.y}px)` : 'none' }}>
                                                    <h3><Link onClick={ClickHandler} to={`/project-details/${portfoli.slug}`} >{portfoli.title}</Link></h3>
                                                    <h4>{portfoli.Subtitle}</h4>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;
