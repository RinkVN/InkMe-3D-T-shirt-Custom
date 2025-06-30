import { useContext, useState } from "react";
import Logo from "../../img/logo.webp";
import { useEffect } from "react";
import patern from "../../img/pattern.webp";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcons from "../../img/GoogleIcons.png";
import { baseUrl, postData } from "../../utils/api";
import { CircularProgress } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import { getUsers, loginWithGoogle } from "../../services/UserServices";
import { MyContext } from "../../context/MyContext";
import { GoogleLogin } from "@react-oauth/google";

// Thêm CSS inline cho trang login
const loginStyles = `
  .loginSection {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .loginPattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.1;
    z-index: 1;
  }

  .modern-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 10;
  }

  .login-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .login-subtitle {
    color: #718096;
    font-size: 1rem;
    margin-bottom: 0;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-control {
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.75rem 1rem 0.75rem 3rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f7fafc;
  }

  .form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  .loginSection .icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
    z-index: 1;
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
  }

  .btn-blue:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .toggleShowPassword {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #a0aec0;
    transition: color 0.3s ease;
  }

  .toggleShowPassword:hover {
    color: #667eea;
  }

  .link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .link:hover {
    color: #764ba2;
    text-decoration: underline;
  }

  .signup-text {
    color: #718096;
    font-size: 0.95rem;
  }

  .signup-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .signup-link:hover {
    color: #764ba2;
    text-decoration: underline;
  }

  .or {
    margin: 1.5rem 0;
  }

  .line {
    height: 1px;
    background: #e2e8f0;
    flex: 1;
  }

  .txt {
    padding: 0 1rem;
    color: #a0aec0;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .modern-card {
      margin: 1rem;
      padding: 2rem 1.5rem;
    }
    
    .login-title {
      font-size: 1.5rem;
    }
  }
`;

// Thêm styles vào head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = loginStyles;
  document.head.appendChild(styleSheet);
}

const LoginScreen = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const context = useContext(MyContext);

  const [formfields, setFormfields] = useState({
    email: "",
    phone: "",
    password: "",
    isAdmin: true,
  });

  //const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    setFormfields({
      ...formfields,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    //context.setIsHideSidebarAndHeader(true);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  // const signIn = (e) => {
  //   e.preventDefault();
  //   console.log("formfields", formfields);
  //   Login("lan@example.com", "lan123");
  // };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userList = await getUsers(); // Chờ dữ liệu trả về
        //  setUser(userList);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUser(); // Gọi hàm async bên trong useEffect
  }, []);

  const signIn = (e) => {
    e.preventDefault();

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

    setLoading(true);

    postData(`/api/user/signin`, formfields).then((res) => {
      try {
        if (res.error === true) {
          setLoading(false);
          context.setAlterBox({
            open: true,
            error: true,
            message: res.message || "Sign in failed",
          });
          return;
        }

        if (!res.token || !res.user) {
          setLoading(false);
          context.setAlterBox({
            open: true,
            error: true,
            message: "Invalid response from server",
          });
          return;
        }

        localStorage.setItem("token", res.token);

        const user = {
          name: res.user.name,
          email: res.user.email,
          userId: res.user.id,
        };

        localStorage.setItem('user', JSON.stringify(user));

        context.setAlterBox({
          open: true,
          error: false,
          message: "Sign in successfully",
        });
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        context.setAlterBox({
          open: true,
          error: true,
          message: "Sign in failed",
        });
        setLoading(false);
      }
    });
  };

  const handleSuccess = async (response) => {
    try {
      const res = await loginWithGoogle(response.credential);
      if (res.error === true) {
        setLoading(false);
        context.setAlterBox({
          open: true,
          error: true,
          message: res.message || "Sign in failed",
        });
        return;
      }
      setLoading(true);
      localStorage.setItem("token", res.token);
      context.setAlterBox({
        open: true,
        error: false,
        message: "Sign in successfully",
      });
      setTimeout(() => {
        setLoading(false);
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      context.setAlterBox({
        open: true,
        error: true,
        message: "Sign in failed",
      });
      setLoading(false);
    }
  };
  const handleError = (response) => {
    console.log(response);
  };

  return (
    <>
      <img src={patern} alt="pattern" className="loginPattern" />
      <section className="loginSection">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-lg-5 col-md-7">
              <div className="loginBox modern-card">
                <div className="logo text-center mb-4">
                  <img src={Logo} alt="logo" width="80px" />
                  <h2 className="login-title">Chào mừng trở lại</h2>
                  <p className="login-subtitle">Đăng nhập để tiếp tục</p>
                </div>

                <div className="wrapper">
                  <form onSubmit={signIn}>
                    <div
                      className={`form-group position-relative ${inputIndex === 0 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên đăng nhập"
                        onFocus={() => focusInput(0)}
                        onBlur={() => setInputIndex(null)}
                        autoFocus
                        name="email"
                        onChange={onChangeInput}
                      />
                    </div>

                    <div
                      className={`form-group position-relative ${inputIndex === 1 && "focus"
                        }`}
                    >
                      <span className="icon">
                        <RiLockPasswordFill />
                      </span>
                      <input
                        type={`${isShowPassword === true ? "text" : "password"}`}
                        className="form-control"
                        placeholder="Điền mật khẩu"
                        onFocus={() => focusInput(1)}
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

                    <div className="form-group">
                      <Button type="submit" className="btn-blue btn-big w-100" style={{ color: "white" }}>
                        {loading === true ? <CircularProgress /> : "Đăng Nhập"}
                      </Button>
                    </div>

                    <div className="form-group text-center mt-3">
                      <Link to={"/forgot-password"} className="link">
                        Quên mật khẩu
                      </Link>
                      <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                        <span className="line"></span>
                        <span className="txt">hoặc</span>
                        <span className="line"></span>
                      </div>

                      {/* Login with google */}
                      <div style={{ marginLeft: "40px" }}>
                        <GoogleLogin
                          onSuccess={handleSuccess}
                          onError={handleError}
                        ></GoogleLogin>
                      </div>
                      {/* <Button
                  variant="outlined"
                  className="w-100 btn-lg btn-big loginWithGoogle"
                >
                  <img src={GoogleIcons} width="20px" alt="" /> Đăng nhập bằng
                  Google
                </Button> */}
                    </div>
                  </form>
                </div>

                <div className="text-center mt-4">
                  <span className="signup-text">
                    Bạn chưa có tài khoản?{" "}
                    <Link to={"/signup"} className="signup-link">
                      Đăng ký ngay
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginScreen;
