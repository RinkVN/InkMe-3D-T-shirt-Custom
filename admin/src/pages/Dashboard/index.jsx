import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { IoMdCart } from "react-icons/io";
import DashboardBox from "./components/dashboardBox";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { FaPencilAlt, FaUserCircle } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import { IoIosTimer } from 'react-icons/io';
import Button from '@mui/material/Button';
import { HiDotsVertical } from 'react-icons/hi';
import { Chart } from "react-google-charts";
import MenuItem from '@mui/material/MenuItem';
import { Breadcrumbs, Rating } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaEye } from 'react-icons/fa6';
import Pagination from '@mui/material/Pagination';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import { deleteData, fetchDataFromApi } from '../../utils/api';


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

const Dashboard = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showBy, setShowBy] = useState('');
  const [showBysetCatBy, setCatBy] = useState('');
  const open = Boolean(anchorEl);

  const [productList, setProductList] = useState([]);

  const ITEM_HEIGHT = 48;

  const context = useContext(MyContext);

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
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox color={['#1da256', '#48d483']} icon={<FaUserCircle />}
                grow={true} />
              <DashboardBox color={['#c012e2', '#eb64fe']} icon={<IoMdCart />} />
              <DashboardBox color={['#2c78e5', '#60aff5']} icon={<MdShoppingBag />} />
              <DashboardBox color={['#e1950e', '#f3cd29']} icon={<GiStarsStack />} />
            </div>
          </div>

          <div className="col-md-4 pl-0">
            <div className="box graphBox">
              <div className='d-flex align-items-center justify-content-between w-100 bottomEle'>
                <h4 className='text-white mb-0 mt-0'>Doanh thu</h4>
                <div className="ml-auto">
                  <Button className='ml-auto toggleIcon' onClick={handleClick}><HiDotsVertical /></Button>
                </div>

                <Menu
                  className='dropdownMenu'
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '20ch',
                    },
                  }}
                >

                  <MenuItem onClick={handleClose}>
                    <IoIosTimer />  Hôm Trước
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Tuần Trước
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Tháng Trước
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Năm Trước
                  </MenuItem>

                </Menu>

              </div>

              <h3 className='text-white font-weight-bold'> 10.000.000.000</h3>
              <p>10.000.000 trong tháng trước</p>

              <Chart
                chartType="PieChart"
                width="100%"
                height="180px"
                data={data}
                options={options}
              />

            </div>
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
                  <th>Số lượng</th>
                  <th>Đánh giá</th>
                  <th>Đặt hàng</th>
                  <th>Giảm giá</th>
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
                        <td>{item?.countInStock}</td>
                        <td>
                          <Rating name="read-only" defaultValue={item?.rating}
                            precision={0.5} size='small' readOnly />
                        </td>
                        <td>380</td>
                        <td>10%</td>
                        <td>
                          <div className='actions d-flex align-items-center justify-content-center'>
                            <Link to="/product/details">
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

      </div>
    </>
  )
}

export default Dashboard;