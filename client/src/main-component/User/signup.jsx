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
    position: relative;
    min-height: 120vh;
    overflow-x: hidden;
  }

  .signupSection::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%);
    z-index: 1;
  }

  .bg-gradient-primary {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%) !important;
    position: relative;
    z-index: 2;
  }

  .bg-gradient-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
    z-index: -1;
  }

  .signup-box {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(30px);
    border-radius: 24px;
    padding: 3rem 2.5rem;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin: 2rem auto;
    position: relative;
    z-index: 10;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
  }

  .signup-box:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 35px 70px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  .signup-title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }

  .signup-subtitle {
    color:rgb(255, 255, 255);
    font-size: 1rem;
    margin-bottom: 0;
    font-weight: 500;
  }

  .signup-form .form-group {
    margin-bottom: 1.5rem;
    position: relative;
  }

  .signup-form .form-control {
    border: 2px solid rgba(226, 232, 240, 0.6);
    border-radius: 16px;
    padding: 1rem 1.25rem 1rem 3.5rem;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    color: #2d3748;
    width: 100%;
  }

  .signup-form .form-control::placeholder {
    color: #94a3b8;
    font-weight: 400;
    transition: all 0.3s ease;
  }

  .signup-form .form-control:focus {
    border-color: #667eea;
    box-shadow: 
      0 0 0 4px rgba(102, 126, 234, 0.15),
      0 10px 20px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
  }

  .signup-form .form-control:focus::placeholder {
    color: #cbd5e1;
    transform: translateY(-2px);
  }

  .signup-form .icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    z-index: 2;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }

  .signup-form .form-group.focus .icon,
  .signup-form .form-control:focus + .icon {
    color: #667eea;
    transform: translateY(-50%) scale(1.1);
  }

  .signup-form .toggleShowPassword {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #94a3b8;
    transition: all 0.3s ease;
    font-size: 1.1rem;
    padding: 0.25rem;
    border-radius: 8px;
  }

  .signup-form .toggleShowPassword:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-50%) scale(1.1);
  }

  .btn-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 16px;
    padding: 1rem 2rem;
    font-weight: 700;
    text-transform: none;
    font-size: 1rem;
    letter-spacing: 0.02em;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 
      0 10px 20px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .btn-blue::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  .btn-blue:hover::before {
    left: 100%;
  }

  .btn-blue:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 20px 40px rgba(102, 126, 234, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);
    color: white;
  }

  .btn-blue:active {
    transform: translateY(-1px);
  }

  .btn-outline-light {
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 16px;
    padding: 0.875rem 2rem;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }

  .btn-outline-light::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .btn-outline-light:hover::before {
    left: 100%;
  }

  .btn-outline-light:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }

  .login-text {
    color:rgb(255, 255, 255);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .login-link {
    color:rgb(0, 196, 255);
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    position: relative;
  }

  .login-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  .login-link:hover::after {
    width: 100%;
  }

  .login-link:hover {
    color: #764ba2;
    text-decoration: none;
  }

  .hero-content h1 {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .hero-content p {
    font-size: 1.1rem;
    line-height: 1.7;
    opacity: 0.95;
    font-weight: 400;
  }

  .hero-content img {
    transition: transform 0.3s ease;
  }

  .hero-content img:hover {
    transform: scale(1.05);
  }

  /* Checkbox styling */
  .MuiFormControlLabel-root {
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .MuiFormControlLabel-label {
    font-size: 0.9rem;
    color:rgb(255, 255, 255);
    font-weight: 500;
  }

  .MuiCheckbox-root {
    color: #94a3b8 !important;
  }

  .MuiCheckbox-root.Mui-checked {
    color: #667eea !important;
  }

  /* Divider styling */
  .or {
    margin: 1.5rem 0;
  }

  .line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.4), transparent);
    flex: 1;
  }

  .txt {
    padding: 0 1rem;
    color:rgb(255, 255, 255);
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Loading animation */
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  .btn-blue .MuiCircularProgress-root {
    animation: pulse 1.5s ease-in-out infinite;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .signup-box {
      padding: 2.5rem 2rem;
    }
  }

  @media (max-width: 991px) {
    .col-lg-7 {
      display: none !important;
    }
    
    .signup-box {
      margin: 1.5rem auto;
      padding: 2.5rem 2rem;
      max-width: 480px;
    }
    
    .signup-title {
      font-size: 1.75rem;
    }

    .hero-content h1 {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 768px) {
    .signupSection {
      padding: 1rem 0;
    }

    .signup-box {
      margin: 1rem;
      padding: 2rem 1.5rem;
      border-radius: 20px;
    }

    .signup-title {
      font-size: 1.6rem;
    }

    .signup-form .form-control {
      padding: 0.875rem 1rem 0.875rem 3.25rem;
      font-size: 0.95rem;
      border-radius: 14px;
    }

    .signup-form .icon {
      left: 1rem;
      font-size: 1rem;
    }

    .signup-form .toggleShowPassword {
      right: 1rem;
      font-size: 1rem;
    }

    .btn-blue {
      padding: 0.875rem 1.5rem;
      font-size: 0.95rem;
      border-radius: 14px;
    }
  }

  @media (max-width: 576px) {
    .signup-box {
      margin: 0.75rem;
      padding: 1.75rem 1.25rem;
      border-radius: 18px;
    }

    .signup-title {
      font-size: 1.5rem;
    }

    .signup-subtitle {
      font-size: 0.9rem;
    }

    .signup-form .form-group {
      margin-bottom: 1.25rem;
    }

    .signup-form .form-control {
      padding: 0.8rem 0.875rem 0.8rem 3rem;
      font-size: 0.9rem;
      border-radius: 12px;
    }

    .signup-form .icon {
      left: 0.875rem;
      font-size: 0.95rem;
    }

    .signup-form .toggleShowPassword {
      right: 0.875rem;
      font-size: 0.95rem;
    }

    .btn-blue {
      padding: 0.8rem 1.25rem;
      font-size: 0.9rem;
      border-radius: 12px;
    }

    .btn-outline-light {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
    }
  }

  @media (max-width: 480px) {
    .signup-box {
      margin: 0.5rem;
      padding: 1.5rem 1rem;
      border-radius: 16px;
    }

    .signup-title {
      font-size: 1.375rem;
    }

    .signup-subtitle {
      font-size: 0.85rem;
    }

    .signup-form .form-control {
      padding: 0.75rem 0.75rem 0.75rem 2.75rem;
      font-size: 0.875rem;
      border-radius: 10px;
    }

    .signup-form .icon {
      left: 0.75rem;
      font-size: 0.9rem;
    }

    .signup-form .toggleShowPassword {
      right: 0.75rem;
      font-size: 0.9rem;
    }

    .btn-blue {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border-radius: 10px;
    }

    .login-text, .login-link {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 375px) {
    .signup-box {
      margin: 0.25rem;
      padding: 1.25rem 0.875rem;
    }

    .signup-title {
      font-size: 1.25rem;
    }

    .signup-subtitle {
      font-size: 0.8rem;
    }
  }

  /* Animation entrance */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .signup-box {
    animation: slideInUp 0.6s ease-out;
  }

  .hero-content > * {
    animation: slideInUp 0.8s ease-out;
  }

  .hero-content > *:nth-child(2) {
    animation-delay: 0.1s;
  }

  .hero-content > *:nth-child(3) {
    animation-delay: 0.2s;
  }

  .hero-content > *:nth-child(4) {
    animation-delay: 0.3s;
  }

  /* Focus states */
  .signup-form .form-group.focus {
    transform: translateY(-2px);
  }

  .signup-form .form-group.focus .form-control {
    border-color: #667eea;
    box-shadow: 
      0 0 0 4px rgba(102, 126, 234, 0.15),
      0 10px 20px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.95);
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
  const [loading, setLoading] = useState(false);
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

            <div className="col-lg-5 d-flex align-items-center justify-content-center position-relative">
              <div className="signup-box w-100" style={{ maxWidth: "480px" }}>
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    <img src={logo} alt="logo" style={{ maxWidth: "120px", height: "auto" }} />
                  </div>
                  <h2 className="signup-title">Tạo tài khoản mới</h2>
                  <p className="signup-subtitle">Tham gia cùng chúng tôi để khám phá thế giới in 3D</p>
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
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={20} color="inherit" className="me-2" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Tạo tài khoản"
                        )}
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
