import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaEye } from 'react-icons/fa6';
import Pagination from '@mui/material/Pagination';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Rating } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Chip from '@mui/material/Chip';
import { emphasize } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { deleteData, fetchDataFromApi } from '../../utils/api';
import Checkbox from '@mui/material/Checkbox';




//breadcrumb
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const data = [
  ["Year", "Sales", "Expenses", "Profit"],
  ["2014", 1000, 400, 200],
  ["2015", 1170, 460, 250],
  ["2016", 660, 1120, 300],
  ["2017", 1030, 540, 350],
];

export const options = {
  'backgroundColor': 'transparent',
  'chartArea': { width: '100%', height: '100%' },
};

const Products = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showBy, setShowBy] = useState('');
  const [showBysetCatBy, setCatBy] = useState('');

  const [productList, setProductList] = useState([]);
  const [catData, setCatData] = useState([]);

  const open = Boolean(anchorEl);

  const ITEM_HEIGHT = 48;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, value) => {
    context.setProgress(40);
    fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
      setProductList(res);
      console.log(res);
      context.setProgress(100);
    })
  };

  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    context.setProgress(40);
    fetchDataFromApi('/api/products').then((res) => {
      setProductList(res);
      context.setProgress(100);
    })
  }, []);

  const deleteProduct = (id) => {
    context.setProgress(40);
    deleteData(`/api/products/${id}`).then((res) => {
      context.setProgress(100);
      context.setAlterBox({
        open: true,
        error: false,
        message: "Xóa sản phẩm thành công"
      })
      fetchDataFromApi('/api/products').then((res) => {
        setProductList(res);
      })
    })
  }

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className='mb-0 d-flex align-items-center'>Danh sách sản phẩm</h5>

          <div className="ml-auto d-flex align-items-center">

            <Breadcrumbs aria-label='breadcrumb' className='ml-auto breadcrumbs_' >
              <StyledBreadcrumb
                component="a"
                href='#'
                label="Sản phẩm"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="Danh sách sản phẩm"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>

            <Link to="/product/upload">
              <Button className='btn-blue ml-3 pl-3 pr-3'>Thêm sản phẩm</Button>
            </Link>

          </div>
        </div>
        <div className='card shadow border-0 p-3'>
          <h3 className='hd'>Sản phẩm bán chạy</h3>

          <div className="row cardFilters mt-3">
            <div className="col-md-3">
              <h4>Sắp xếp theo</h4>
              <FormControl size='small' className='w-100'>
                <Select
                  value={showBy}
                  onChange={(e) => setShowBy(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  labelId='demo-simple-small-label'
                  className='w-100'
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value={10}>Tảng</MenuItem>
                  <MenuItem value={20}>Giá</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="col-md-3">
              <h4>Danh Mục</h4>
              <FormControl size='small' className='w-100'>
                <Select
                  value={showBysetCatBy}
                  onChange={(e) => setCatBy(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  labelId='demo-simple-small-label'
                  className='w-100'
                >
                  <MenuItem value="">
                    <em value={null}>None</em>
                  </MenuItem>

                  {
                    context.catData?.categoryList?.length !== 0 &&
                    context.catData?.categoryList?.map((cat, index) => {
                      return (
                        <MenuItem className="text-capitalize"
                          value={cat.id} key={index}>{cat.name}
                        </MenuItem>
                      )
                    })
                  }


                </Select>
              </FormControl>
            </div>
          </div>

          <div className='table-responsive mt-3'>
            <table className='table table-bordered v-align'>
              <thead className='thead-dark'>
                <tr>
                  <th>#ID</th>
                  <th style={{ width: '250px' }}>Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Danh mục con</th>
                  <th>Nhãn hiệu</th>
                  <th>Giá bán</th>
                  <th>Giảm giá</th>
                  <th>Số lượng</th>
                  <th>Rams sản phẩm</th>
                  <th>Kích thước</th>
                  <th>Cân nặng</th>
                  <th>Đánh giá</th>
                  <th>Đặt hàng</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>

                {
                  productList?.products?.length !== 0 && productList.products?.map((item, index) => {
                    return (
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Checkbox /> <span>#{index + 1}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center productBox">
                            <div className="imgWrapper">
                              <div className="img">
                                <img className='w-100 shadow border'
                                  src={`${item?.images[0]}`}
                                  alt="" />
                              </div>
                            </div>
                            <div className="info pl-0">
                              <h6>{item?.name}</h6>
                              <p>{item?.description}</p>
                            </div>
                          </div>
                        </td>
                        <td>{item?.category?.name}</td>
                        {/* <td>{item?.subCat.subCat}</td> */}
                        <td>{item?.brand}</td>
                        <td>
                          <del className='old'>{item?.oldPrice}</del>
                          <span className='new text-danger'>{item?.price}</span>
                        </td>
                        <td>10%</td>
                        <td>{item?.countInStock}</td>

                        <td>
                          {item?.productRams?.map((ram) => {
                            return (
                              <span className='badge badge-primary mr-2'>{ram}</span>
                            )
                          })}
                        </td>

                        <td>
                          {item?.productSize?.map((size) => {
                            return (
                              <span className='badge badge-primary mr-2'>{size}</span>
                            )
                          })}
                        </td>

                        <td>{item?.productWeight}</td>
                        <td>
                          <Rating name="read-only" defaultValue={item?.rating}
                            precision={0.5} size='small' readOnly />
                        </td>
                        <td>380</td>
                        <td>
                          <div className='actions d-flex align-items-center justify-content-center'>
                            <Link to={`/product/details/${item?.id}`}>
                              <Button className='secondary' color='secondary'><FaEye /></Button>
                            </Link>
                            <Link to={`/product/edit/${item?.id}`}>
                              <Button className='success' color='success'><FaPencilAlt /></Button>
                            </Link>
                            <Button className='error' color='error'
                              onClick={() => deleteProduct(item?.id)}><MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>

            </table>

            {
              productList?.totalPages > 1 &&
              < div className="d-flex tableFooter">
                <p>showing <b>12</b> of <b>100</b> results </p>
                <Pagination className='pagination' count={productList?.totalPages} onChange={handleChange}
                  color='primary' showFirstButton showLastButton />
              </div>
            }

          </div>

        </div>

      </div >
    </>
  )
}

export default Products;