import React, {Fragment, useState} from 'react';
import { useParams } from 'react-router-dom'
import { connect } from "react-redux";
import NavbarS2 from '../../components/NavbarS2/NavbarS2';
import PageTitle from '../../components/pagetitle/PageTitle'
import CtaSectionS2 from '../../components/CtaSectionS2/CtaSectionS2';
import FooterS3 from '../../components/footerS3/FooterS3';
import CursorMaus from '../../components/CursorMaus/CursorMaus';
import { addToCart } from "../../store/actions/action";
import Product from './product'
import ProductTabs from './alltab';
import { getProductById } from '../../services/ShopServices';



const ProductSinglePage =(props) => {
  
    const { slug } = useParams()
    const [product, setProduct] = useState(null);

    const {addToCart} = props;
    const products = async () => {
        const response = await getProductById(slug);
        setProduct(response);
    }
    products();
   
    

    return(
        <Fragment>
            <NavbarS2 hclass={'header-section-2 style-two'} />
            <PageTitle pageTitle={'Digital printing Service'} pagesub={'Product Single'}/> 
            <section className="product-details-section section-padding section-bg-2">
                <div className="container">
                    <div className="product-details-wrapper">
                        {product ? <Product
                            product={product}
                            addToCart={addToCart}
                        /> : null}
                        <ProductTabs />
                    </div>
                </div>
            </section>
            <CtaSectionS2 />
            <FooterS3 />
            <CursorMaus />
        </Fragment>
    )
};

const mapStateToProps = state => {
    return {
        products: state.data.products,
    }
};

export default connect(mapStateToProps, { addToCart })(ProductSinglePage);



