import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Button from '@mui/material/Button';

import { FaEye } from 'react-icons/fa6';
import Pagination from '@mui/material/Pagination';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import HomeIcon from '@mui/icons-material/Home';
import Chip from '@mui/material/Chip';
import { emphasize } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { deleteData, fetchDataFromApi } from '../../utils/api';



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

const Category = () => {

  const [catData, setCatData] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {

    window.scrollTo(0, 0);
    context.setProgress(20);
    fetchDataFromApi('/api/category').then((res) => {
      setCatData(res);
      console.log(res);
      context.setProgress(100);
    })

  }, []);

  const deleteCategory = (id) => {
    deleteData(`/api/category/${id}`).then((res) => {
      fetchDataFromApi('/api/category').then((res) => {
        setCatData(res);
      })
    })
  }

  const handleChange = (event, value) => {
    context.setProgress(40);
    fetchDataFromApi(`/api/category?page=${value}`).then((res) => {
      setCatData(res);
      console.log(res);
      context.setProgress(100);
    })
  };

  return (
    <>
      <div className="right-content w-100">

        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className='mb-0 d-flex align-items-center'>Danh sách danh mục sản phẩm</h5>

          <div className="ml-auto d-flex align-items-center">

            <Breadcrumbs aria-label='breadcrumb' className='ml-auto breadcrumbs_' >
              <StyledBreadcrumb
                component="a"
                href='#'
                label="Phân loại"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="Danh sách danh mục"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>

            <Link to="/category/add">
              <Button className='btn-blue ml-3 pl-3 pr-3'>Thêm Danh Mục</Button>
            </Link>

          </div>
        </div>

        <div className='card shadow border-0 p-3'>

          <div className='table-responsive mt-3'>
            <table className='table table-bordered table-striped v-align'>
              <thead className='thead-dark'>
                <tr>
                  <th>#ID</th>
                  <th style={{ width: '300px' }}>Ảnh</th>
                  <th>Danh mục</th>
                  <th>Danh mục con</th>
                  <th>Màu</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>

                {
                  catData?.categoryList?.length !== 0 && catData?.categoryList?.map((item, index) => {
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
                                <img className='w-100'
                                  src={`${item.images[0]}`}
                                  alt="" />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{item.name}</td>
                        <td>
                        {
                          context.subCatData?.subCategoryList?.length !== 0 &&
                          context.subCatData?.subCategoryList?.map((subCat, index) => {
                            return (
                             <p value={subCat.id} key={index}>
                              {subCat.subCat}
                                </p>
                            )
                          })
                        }
                        </td>
                        <td>{item.color}</td>
                        <td>
                          <div className='actions d-flex align-items-center justify-content-center'>
                            <Link to="/product/details">
                              <Button className='secondary' color='secondary'><FaEye /></Button>
                            </Link>

                            <Link to={`/category/edit/${item.id}`}>
                              <Button className='success' color='success'>
                                <FaPencilAlt />
                              </Button>
                            </Link>

                            <Button className='error' color='error' onClick={() => deleteCategory(item.id)}>
                              <MdDelete />
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
            catData?.totalPages > 1 &&
            <div className="d-flex tableFooter">
              <Pagination className='pagination'
                count={catData?.totalPages}
                onChange={handleChange}
                color='primary'
                showFirstButton showLastButton
              />
            </div>
          }

        </div>

      </div>

    </div >
    </>
  )
}

export default Category;