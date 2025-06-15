import React, { Fragment, useContext, useEffect, useState } from "react";
import NavbarS2 from '../../components/NavbarS2/NavbarS2';
import PageTitle from '../../components/pagetitle/PageTitle'
import CtaSectionS2 from '../../components/CtaSectionS2/CtaSectionS2';
import FooterS3 from '../../components/footerS3/FooterS3';
import CursorMaus from '../../components/CursorMaus/CursorMaus';
import { Link } from "react-router-dom";
import { MyContext } from '../../context/MyConext';
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import QuantityBox from "../../components/QuantityBox";

const CartPage = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const context = useContext(MyContext);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = () => {

    fetchDataFromApi(`/api/cart`).then((res) => {
      setCartData(res);
      // Initialize quantities
      const initialQuantities = {};
      res.forEach(item => {
        initialQuantities[item._id] = item.quantity;
      });
      setSelectedQuantity(initialQuantities);
      // Calculate total
      const total = res.reduce((sum, item) => sum + item.subTotal, 0);
      setTotalAmount(total);
    });
  }


  const removeItem = (id) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    deleteData(`/api/cart/${id}`).then((res) => {
      context.setAlterBox({
        open: true,
        error: false,
        message: "Xóa sản phẩm thành công"
      });
      fetchCartData();
      context.getCartData();
    }).finally(() => {
      setLoading(prev => ({ ...prev, [id]: false }));
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(prev => ({ ...prev, [item._id]: true }));

    try {
      const cartFields = {
        productTitle: item.productTitle,
        images: item.images,
        rating: item.rating,
        price: item.price,
        quantity: newQuantity,
        subTotal: item.price * newQuantity,
        productId: item.productId,
        // userId: user.userId,
        userId: "67f4c2656ae1ae7cd875586e",
        classifications: item.classifications?.map(cls => ({
          ...cls,
          quantity: newQuantity,
          subTotal: cls.price * newQuantity
        }))
      };

      await editData(`/api/cart/${item._id}`, cartFields);
      await fetchCartData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, [item._id]: false }));
    }
  };

  return (
    <Fragment>
      <NavbarS2 hclass={'header-section-2 style-two'} />
      <PageTitle pageTitle={''} pagesub={'Giỏ hàng'} />

      <section className="cart-section section-padding section-bg-2">
        <div className="container">
          <div className="main-cart-wrapper">
            <div className="row">
              <div className="col-12">
                <div className="cart-wrapper">
                  <div className="cart-items-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Tổng cộng</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartData?.length !== 0 ? (
                          cartData?.map((item) => {
                            return (
                              <tr className="cart-item" key={item._id}>
                                <td className="cart-item-info">
                                  <div className="tooltip-wrapper">
                                    <img
                                      src={item.images[0]}
                                      alt={item.productTitle}
                                      className="product-image"
                                      style={{ width: '100px', height: '100px' }}
                                    />
                                    <span className="tooltip-glass">{item.productTitle}</span>
                                  </div>
                                </td>

                                <td className="cart-item-price">
                                  <span className="base-price">{formatCurrency(item.price)}</span>
                                </td>
                                <td>
                                  <div className="cart-item-quantity">
                                    <QuantityBox
                                      item={item}
                                      value={selectedQuantity[item._id]}
                                      onQuantityChange={(newQuantity) => updateQuantity(item, newQuantity)}
                                      loading={loading[item._id]}
                                    />
                                  </div>
                                </td>
                                <td className="cart-item-price">
                                  <span className="total-price">{formatCurrency(item.subTotal)}</span>
                                </td>
                                <td className="cart-item-remove">
                                  <button
                                    onClick={() => removeItem(item._id)}
                                    disabled={loading[item._id]}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">Giỏ hàng trống</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="cart-wrapper-footer">
                    <form>
                      <input type="text" name="promo-code" id="promoCode" placeholder="Mã giảm giá" />
                      <button type="submit" className="theme-btn">
                        <span>Áp dụng</span>
                      </button>
                    </form>

                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6"></div>
              <div className="col-xl-6">
                <div className="cart-pragh-box">
                  <div className="cart-graph">
                    <h4>Tổng giỏ hàng</h4>
                    <ul>
                      <li>
                        <span>Tạm tính</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </li>
                      <li>
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                      </li>
                      <li>
                        <span>Tổng cộng</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </li>
                    </ul>
                    <div className="chck">
                      <Link onClick={ClickHandler} to="/checkout" className="theme-btn">
                        <span>Thanh toán</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSectionS2 />
      <FooterS3 />
      <CursorMaus />
    </Fragment>
  );
};

export default CartPage;











