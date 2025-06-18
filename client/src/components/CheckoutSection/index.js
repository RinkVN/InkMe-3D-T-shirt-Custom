import React, { useState, useEffect, useContext } from 'react';
import QRPayment from '../Payment/QRPayment';
import AddressManage from '../AddressManage/AddressManage';
import UserInfoManage from '../UserInforCheckout/UserInfoCheckout';
import { MyContext } from '../../context/MyConext';

const CheckoutSection = () => {
    const context = useContext(MyContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // Kiểm tra xem có đủ thông tin để thanh toán không
    const isReadyForPayment = () => {
        return user?.name && user?.phone && user?.email && context.selectedAddressId;
    };

    return (
        <section className="checkout-section fix section-padding section-bg-2">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <form action="/submit-payment" method="post">
                            <div className="row g-4">
                                {/* Payment Method Selection */}
                                <div className="col-md-5 col-lg-4 col-xl-3">
                                    <div className="checkout-radio">
                                        <p className="primary-text">Chọn phương thức thanh toán</p>
                                        <div className="checkout-radio-wrapper">
                                            <div className="checkout-radio-single">
                                                <input type="radio" className="form-check-input" id="cCard" name="pay-method" value="Credit/Debit Cards" required checked />
                                                <label htmlFor="cCard">QR Code VietQR</label>
                                            </div>
                                            <div className="checkout-radio-single" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                <input type="radio" className="form-check-input" id="cCard2" name="pay-method" value="Credit/Debit Cards" required disabled />
                                                <label htmlFor="cCard2">Thẻ tín dụng/thẻ ghi nợ</label>
                                            </div>
                                            <div className="checkout-radio-single" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                <input type="radio" className="form-check-input" id="paypal" name="pay-method" value="PayPal" required disabled />
                                                <label htmlFor="paypal">PayPal (Chưa hỗ trợ)</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Management Section */}
                                <div className="col-md-7 col-lg-8 col-xl-9">
                                    <div className="checkout-single-wrapper">
                                        {/* Thông tin cá nhân */}
                                        <UserInfoManage />

                                        {/* Quản lý địa chỉ */}
                                        <AddressManage />

                                        {/* Payment QR - Chỉ hiển thị khi đã chọn địa chỉ */}
                                        {isReadyForPayment() ? (
                                            <div className="checkout-single checkout-single-bg">
                                                <h4 style={{ textAlign: 'center' }}>Mã QR Thanh toán</h4>
                                                <div className="checkout-single-form">
                                                    <div className="row g-3">
                                                        <div className="col-lg-12">
                                                            <QRPayment />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="checkout-single checkout-single-bg" style={{ opacity: 0.6 }}>
                                                <h4 style={{ textAlign: 'center', color: '#666' }}>
                                                    Vui lòng chọn địa chỉ giao hàng để hiển thị mã QR thanh toán
                                                </h4>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutSection;