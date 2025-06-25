import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../../../img/hero/hero-bg.jpg'
import Shape1 from '../../../img/hero/circle-2.png'
import Shape2 from '../../../img/hero/vector.png'
import Shape3 from '../../../img/hero/circle.png'
import Shape4 from '../../../img/hero/arrow-up.png'
import Shape5 from '../../../img/Scroll_Down.png'
import Shape6 from '../../../img/hero/bar.png'
// import hero1 from '../../img/hero/hero-1.png'
import hero1 from '../../../img/hero/hero-1.gif'
import hero2 from '../../../img/hero/information.png'
import Custom3D from '../../../main-component/Custom3D/Custom3D'



const Hero = () => {
    const [showPopup, setShowPopup] = useState(false);
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    const handleCustom3D = (e) => {
        e.preventDefault();
        setShowPopup(true);
    }
    const closePopup = () => setShowPopup(false);

    return (
        <section className="hero-section hero-1 fix bg-cover" style={{ backgroundImage: `url(${Bg})` }} >
            <div className="circle-shape">
                <img src={Shape1} alt="img" />
            </div>
            <div className="vector-shape float-bob-x">
                <img src={Shape2} alt="img" />
            </div>
            <div className="circle-shape-2">
                <img src={Shape3} alt="img" />
            </div>
            <div className="arrow-shape float-bob-y">
                <img src={Shape4} alt="img" />
            </div>
            <div id="scrollDown" className="scroll-down">
                <img src={Shape5} alt="img" />
            </div>
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="hero-content">
                            <h6 className="wow fadeInUp">Mô hình 3D</h6>
                            <h1 className="wow fadeInUp" data-wow-delay=".3s">
                                Thiết kế,
                                <span>Theo phong cách của bạn! <img src={Shape6} alt="img" /></span>..
                            </h1>
                            <p className="wow fadeInUp" data-wow-delay=".5s">
                                Chúng tôi cung cấp dịch vụ in ấn với chất lượng cao. <br />
                                Với đội ngũ nhân viên có kinh nghiệm và trang thiết bị hiện đại, chúng tôi đảm bảo sản phẩm đạt tiêu chuẩn cao nhất.
                            </p>
                            <ul className="list wow fadeInUp" data-wow-delay=".7s">
                                <li>
                                    <i className="fa-sharp fa-solid fa-check"></i>
                                    Chất lượng cao
                                </li>
                                <li>
                                    <i className="fa-sharp fa-solid fa-check"></i>
                                    Giá cả hợp lý
                                </li>
                            </ul>
                            <button onClick={handleCustom3D} className="theme-btn wow fadeInUp" data-wow-delay=".9s">Tự tay thiết kế</button>
                            {showPopup && (
                                <div className='custom-3d-popup'>
                                    <div className='custom-3d-popup-content'>
                                        <button onClick={closePopup} className='custom-3d-popup-close'>×</button>
                                        <Custom3D />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".4s">
                        <div className="hero-thumb">
                            <img src={hero1} alt="hero-img" />
                            <div className="information-shape float-bob-x">
                                <img src={hero2} alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;