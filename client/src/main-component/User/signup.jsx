import { useContext, useState } from "react";
import Logo from "../../img/logo.webp";
//import { MyContext } from "../../App";
import { useEffect } from "react";
import patern from "../../img/pattern.webp";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff, IoMdHome } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcons from "../../img/GoogleIcons.png";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaPhone } from "react-icons/fa6";
//import { postData } from "../../utils/api";
import { CircularProgress } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import { MyContext } from "../../context/MyContext";
import { baseUrl, postData } from "../../utils/api";
import hero1 from "../../img/hero/hero-1.gif";
import logo from "../../img/logo/inkme-logo-gradient.png";

// CSS cho trang signup
const signupStyles = `
  .signupSection {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .bg-gradient-primary {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%) !important;
  }

  .signup-box {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin: 2rem 1rem;
  }

  .signup-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .signup-subtitle {
    color: #718096;
    font-size: 1rem;
    margin-bottom: 0;
  }

  .signup-form .form-group {
    margin-bottom: 1.25rem;
  }

  .signup-form .form-control {
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.75rem 1rem 0.75rem 3rem;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    background: #f7fafc;
  }

  .signup-form .form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  .signup-form .icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
    z-index: 1;
  }

  .signup-form .toggleShowPassword {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #a0aec0;
    transition: color 0.3s ease;
  }

  .signup-form .toggleShowPassword:hover {
    color: #667eea;
  }

  .btn-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    padding: 0.875rem 2rem;
    font-weight: 600;
    text-transform: none;
    font-size: 1rem;
    transition: all 0.3s ease;
    color: white;
  }

  .btn-blue:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    color: white;
  }

  .btn-outline-light {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-outline-light:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  .login-text {
    color: #718096;
    font-size: 0.95rem;
  }

  .login-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .login-link:hover {
    color: #764ba2;
    text-decoration: underline;
  }

  .hero-content h1 {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.9;
  }

  @media (max-width: 991px) {
    .col-lg-7 {
      display: none !important;
    }
    
    .signup-box {
      margin: 1rem;
      padding: 2rem 1.5rem;
    }
    
    .signup-title {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .signup-box {
      padding: 1.5rem 1rem;
    }
  }
`;

// Thêm styles vào head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = signupStyles;
  document.head.appendChild(styleSheet);
}

const Signup = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const context = useContext(MyContext);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  //const context = useContext(MyContext)
  const history = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
    if (currentToken) {
      history('/');
    }
    //context.setIsHideSidebarAndHeader(true);
  }, [token, history]);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onChangeInput = (e) => {
    setFormfields({
      ...formfields,
      [e.target.name]: e.target.value,
    });
  };
  // const signUp = (e) => {
  //   e.preventDefault();
  //   console.log(formfields);
  // };

  const signUp = (e) => {
    e.preventDefault();
    try {
      if (formfields.name === "") {
        context.setAlterBox({
          open: true,
          error: true,
          message: "name can't be blank",
        });
        return false;
      }
      if (formfields.phone === "") {
        context.setAlterBox({
          open: true,
          error: true,
          message: "Phone can't be blank",
        });
        return false;
      }
      if (formfields.email === "") {
        context.setAlterBox({
          open: true,
          error: true,
          message: "Email can't be blank",
        });
        return false;
      }
      if (formfields.password === "") {
        context.setAlterBox({
          open: true,
          error: true,
          message: "Password can't be blank",
        });
        return false;
      }
      if (formfields.confirmPassword === "") {
        context.setAlterBox({
          open: true,
          error: true,
          message: "Confirm Password can't be blank",
        });
        return false;
      }

      setLoading(true);

      const res = postData(`/api/user/signup`, formfields);
      if (res.error !== true) {
        context.setAlterBox({
          open: true,
          error: true,
          message: "User created successfully",
        });

        setTimeout(() => {
          setLoading(false);
          history("/login");
        }, 2000);
      } else {
        context.setAlterBox({
          open: true,
          error: false,
          message: res.message,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <img src={patern} alt="pattern" className="loginPattern" />
      <section className="loginSection signupSection">
        <div className="container-fluid">
          <div className="row min-vh-100">
            <div className="col-lg-7 d-flex align-items-center justify-content-center bg-gradient-primary">
              <div className="text-center text-white p-5">
                <div className="hero-content">
                  <img
                    src={logo}
                    alt="logo-img"
                    className="img-fluid mb-4"
                    style={{ maxWidth: "400px" }}
                  />
                  <h1 className="display-4 fw-bold mb-4">
                    Chào mừng đến với InkMe 3D
                  </h1>
                  <p className="lead mb-4">
                    Nền tảng thiết kế và in ấn 3D hàng đầu Việt Nam.
                    Tạo ra những sản phẩm độc đáo theo phong cách riêng của bạn.
                  </p>
                  <img
                    src={hero1}
                    alt="hero-img"
                    className="img-fluid"
                    style={{ maxWidth: "300px" }}
                  />
                </div>

                <div className="mt-4">
                  <Link to={"/"}>
                    <Button className="btn-outline-light btn-lg px-4 py-2" style={{ color: "white" }} >
                      <IoMdHome className="me-2" /> Về trang chủ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-5 d-flex align-items-center justify-content-center">
              <div className="signup-box w-100" style={{ maxWidth: "400px" }}>
                <div className="text-center mb-4">
                  <img src={Logo} alt="logo" width="80px" className="mb-3" />
                  <h2 className="signup-title">Tạo tài khoản mới</h2>
                  <p className="signup-subtitle">Điền thông tin để bắt đầu</p>
                </div>

                <div className="signup-form">
                  <form onSubmit={signUp}>
                    <div
                      className={`form-group position-relative ${inputIndex === 0 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <FaUserCircle />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Họ và tên"
                        onFocus={() => focusInput(0)}
                        onBlur={() => setInputIndex(null)}
                        autoFocus
                        name="name"
                        onChange={onChangeInput}
                      />
                    </div>

                    <div
                      className={`form-group position-relative ${inputIndex === 1 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        onFocus={() => focusInput(1)}
                        onBlur={() => setInputIndex(null)}
                        name="email"
                        onChange={onChangeInput}
                      />
                    </div>

                    <div
                      className={`form-group position-relative ${inputIndex === 2 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <FaPhone />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Số điện thoại"
                        onFocus={() => focusInput(2)}
                        onBlur={() => setInputIndex(null)}
                        name="phone"
                        onChange={onChangeInput}
                      />
                    </div>

                    <div
                      className={`form-group position-relative ${inputIndex === 3 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <RiLockPasswordFill />
                      </span>
                      <input
                        type={`${isShowPassword === true ? "text" : "password"}`}
                        className="form-control"
                        placeholder="Điền mật khẩu"
                        onFocus={() => focusInput(3)}
                        onBlur={() => setInputIndex(null)}
                        name="password"
                        onChange={onChangeInput}
                      />

                      <span
                        className="toggleShowPassword"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
                      </span>
                    </div>

                    <div
                      className={`form-group position-relative ${inputIndex === 4 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <IoShieldCheckmarkSharp />
                      </span>
                      <input
                        type={`${isShowConfirmPassword === true ? "text" : "password"
                          }`}
                        className="form-control"
                        placeholder="Xác nhận mật khẩu"
                        onFocus={() => focusInput(4)}
                        onBlur={() => setInputIndex(null)}
                        name="confirmPassword"
                        onChange={onChangeInput}
                      />

                      <span
                        className="toggleShowPassword"
                        onClick={() =>
                          setIsShowConfirmPassword(!isShowConfirmPassword)
                        }
                      >
                        {isShowConfirmPassword === true ? (
                          <IoMdEyeOff />
                        ) : (
                          <IoMdEye />
                        )}
                      </span>
                    </div>

                    <FormControlLabel
                      control={<Checkbox />}
                      label="Tôi đồng ý với điều khoản & dịch vụ"
                    />

                    <div className="form-group">
                      <Button
                        type="submit"
                        className="btn-blue btn-big w-100"
                        style={{ background: "#2988BC" }}
                      >
                        {loading === false ? <CircularProgress /> : "Đăng ký"}
                      </Button>
                    </div>

                    <div className="form-group text-center mt-3">
                      <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                        <span className="line"></span>
                        <span className="txt">hoặc</span>
                        <span className="line"></span>
                      </div>

                      {/* <Button
                      type="submit"
                      variant="outlined"
                      className="w-100 btn-lg btn-big loginWithGoogle"
                    >
                      <img src={GoogleIcons} width="20px" alt="" /> Đăng nhập
                      bằng Google
                    </Button> */}
                    </div>
                  </form>

                  <div className="text-center mt-4">
                    <span className="login-text">
                      Đã có tài khoản?{" "}
                      <Link to={"/login"} className="login-link">
                        Đăng nhập ngay
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
