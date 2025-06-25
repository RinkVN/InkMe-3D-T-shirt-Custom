import { Slider } from '@mui/material';
import React from 'react';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Link } from 'react-router-dom';

const Product = ({ product, addToCart }) => {
  const productSliderBig = React.useRef();
  const productSliderSml = React.useRef();
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  }
  console.log(product.productSize);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const ProductSliderSmlOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false
};

const ProductSliderOptions = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
};
const goToSlide = (index) => {
  productSliderBig.current.slickGoTo(index);
  productSliderSml.current.slickGoTo(index);
}

  return (
    <div className="row g-5">
        <div className="col-md-5">
          <div className="sliderWrapper pt-3 pb-3 ps-4 pe-4">
            <h6 className="mb-3">Ảnh sản phẩm</h6>
            <Slider {...ProductSliderOptions} ref={productSliderBig}
              className="sliderBig mb-2">
              {
                product?.images?.map((item, index) => {
                  return (
                    <div className="item" key={index}>
                      <img src={item} alt=""
                        className="w-100" />
                    </div>
                  )
                })
              }
            </Slider>
            <Slider {...ProductSliderSmlOptions} ref={productSliderSml}
              className="sliderSml">
              {
                product?.images?.map((item, index) => {
                  return (
                    <div className="item" key={index} onClick={() => goToSlide(index)}>
                      <img src={item} alt=""
                        className="w-100" />
                    </div>
                  )
                })
              }
            </Slider>
          </div>
        </div>
      <div className="col-lg-7">
        <div className="product-details-content">
          <div className="star pb-4">
            <span>{product.discount}%</span>
            <span>{product.rating} <i className="fa-solid fa-star"></i></span>
          </div>
          <h3 className="pb-4 split-text right">{product.name}</h3>
          <p className="mb-4">
            {product.description}
          </p>
          <div className="price-list d-flex align-items-center">
            <span>{product.price} VND</span>
            <del>{product.oldPrice} VND</del>
          </div>
          <div className="color-list">
            <span>Color :</span>
            <ul className="size-list">
              {product.color.map((color, index) => (
                <li key={index}>{color}</li>
              ))}

            </ul>
          </div>
          <div className="color-list">
            <span>Size :</span>
            <ul className="size-list">
              {product.productSize.map((size, index) => (
                <li key={index}>{size}</li>
              ))}
            </ul>
          </div>
          <div className="cart-wrp">
            <div className="shop-button d-flex align-items-center">
              <button className="theme-btn" onClick={() => addToCart(product)}>
                <i className="fa-regular fa-basket-shopping"></i> Add To Cart
              </button>
              <Link to="#" className="star-icon">
                <i className="fal fa-star"></i>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;









