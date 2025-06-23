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
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const context = useContext(MyContext);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCartData();
    // Kiểm tra referrer để hiển thị nút upload ảnh khi truy cập từ trang web khác
    const referrer = document.referrer;
    const currentDomain = window.location.origin;

    // Nếu có referrer và referrer không phải từ cùng domain
    if (referrer && !referrer.startsWith(currentDomain)) {
      setShowUploadButton(true);
      console.log('User came from external website:', referrer);
    }
  }, []);

  const fetchCartData = () => {

    fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
      setCartData(res);
      context.setCartData(res);
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
        userId: user.userId,
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Kiểm tra file có phải là .sav không
    if (file.name.toLowerCase().endsWith('.sav')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result); // Vẫn dùng state này để hiển thị tên file
      };
      reader.readAsDataURL(file);
      console.log('Uploading .sav file:', file);
      // TODO: Implement .sav file upload logic
    } else {
      alert('Vui lòng chọn file .sav');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Fragment>
      <NavbarS2 hclass={'header-section-2 style-two'} />
      <PageTitle pageTitle={'ImkMe - 3D Printing'} pagesub={'Giỏ hàng'} />

      <section className="cart-section section-padding section-bg-2">
        <div className="container">
          <div className="main-cart-wrapper">
            <div className="row">
              <div className="col-12">
                <div className="cart-wrapper">
                  {/* Nút upload ảnh - chỉ hiển thị khi truy cập từ trang web khác */}
                  {showUploadButton && (
                    <div className="upload-section mb-4">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="fas fa-file-upload me-2"></i>
                            Upload File .SAV
                          </h5>
                          <p className="card-text text-muted">
                            Tải lên file .sav để thêm thiết kế vào giỏ hàng
                          </p>

                          <div
                            className={`upload-area ${isDragOver ? 'drag-over' : ''} ${uploadedImage ? 'has-image' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            {uploadedImage ? (
                              <div className="uploaded-image">
                                <div className="file-info">
                                  <i className="fas fa-file-code fa-3x text-success mb-2"></i>
                                  <p className="file-name">File .sav đã được chọn</p>
                                  <small className="text-muted">File đã sẵn sàng để upload</small>
                                </div>
                                <button
                                  className="remove-image"
                                  onClick={() => setUploadedImage(null)}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="upload-icon">
                                  <i className="fas fa-file-code"></i>
                                </div>
                                <div className="upload-text">
                                  {isDragOver ? (
                                    <span className="drop-here">Thả file .sav ở đây</span>
                                  ) : (
                                    <>
                                      <span className="drag-text">Kéo thả file .sav vào đây</span>
                                      <span className="or-text">hoặc</span>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  id="imageUpload"
                                  accept=".sav"
                                  onChange={handleImageUpload}
                                  style={{ display: 'none' }}
                                />
                                <label htmlFor="imageUpload" className="upload-btn">
                                  Chọn File .SAV
                                </label>
                              </>
                            )}
                          </div>

                          <style jsx>{`
                            .upload-section {
                              margin-bottom: 2rem;
                            }
                            
                            .upload-area {
                              border: 2px dashed #ddd;
                              border-radius: 12px;
                              padding: 2rem 2rem;
                              text-align: center;
                              background: #fafafa;
                              transition: all 0.3s ease;
                              cursor: pointer;
                              position: relative;
                              min-height: 200px;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                            }
                            
                            .upload-area:hover {
                              border-color: #28a745;
                              background: #f8fff9;
                            }
                            
                            .upload-area.drag-over {
                              border-color: #28a745;
                              background: #e8f5e8;
                              transform: scale(1.02);
                            }
                            
                            .upload-area.has-image {
                              border-style: solid;
                              border-color: #28a745;
                              background: #f8fff9;
                            }
                            
                            .upload-icon {
                              font-size: 3rem;
                              color: #6c757d;
                              margin-bottom: 1rem;
                            }
                            
                            .drag-over .upload-icon {
                              color: #28a745;
                              transform: scale(1.1);
                            }
                            
                            .drag-text {
                              display: block;
                              font-size: 1.1rem;
                              color: #495057;
                              margin-bottom: 0.5rem;
                            }
                            
                            .or-text {
                              display: block;
                              color: #6c757d;
                              font-size: 0.9rem;
                              margin-bottom: 1rem;
                            }
                            
                            .drop-here {
                              display: block;
                              font-size: 1.3rem;
                              font-weight: bold;
                              color: #28a745;
                              animation: pulse 0.6s ease-in-out;
                            }
                            
                            @keyframes pulse {
                              0% { transform: scale(1); }
                              50% { transform: scale(1.05); }
                              100% { transform: scale(1); }
                            }
                            
                            .upload-btn {
                              background: linear-gradient(135deg, #28a745, #1e7e34);
                              color: white;
                              padding: 0.75rem 2rem;
                              border-radius: 25px;
                              text-decoration: none;
                              font-weight: 500;
                              transition: all 0.3s ease;
                              border: none;
                              cursor: pointer;
                              box-shadow: 0 2px 10px rgba(40, 167, 69, 0.3);
                            }
                            
                            .upload-btn:hover {
                              transform: translateY(-2px);
                              box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
                              background: linear-gradient(135deg, #1e7e34, #155724);
                            }
                            
                            .uploaded-image {
                              position: relative;
                              width: 100%;
                              max-width: 300px;
                            }
                            
                            .file-info {
                              text-align: center;
                              padding: 1rem;
                            }
                            
                            .file-name {
                              font-weight: 600;
                              color: #28a745;
                              margin-bottom: 0.5rem;
                            }
                            
                            .remove-image {
                              position: absolute;
                              top: -10px;
                              right: -10px;
                              background: #dc3545;
                              color: white;
                              border: none;
                              border-radius: 50%;
                              width: 30px;
                              height: 30px;
                              cursor: pointer;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
                              transition: all 0.3s ease;
                            }
                            
                            .remove-image:hover {
                              background: #c82333;
                              transform: scale(1.1);
                            }
                          `}</style>
                        </div>
                      </div>
                    </div>
                  )}

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











