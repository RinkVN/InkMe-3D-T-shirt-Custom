import { useContext, useState } from "react";
import Logo from "../../assets/images/logo.webp";
import { MyContext } from "../../App";
import { useEffect } from "react";
import patern from "../../assets/images/pattern.webp";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import GoogleIcons from "../../assets/images/GoogleIcons.png";
import { postData } from "../../utils/api";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formfields, setFormfields] = useState({
    email: "",
    phone: "",
    password: "",
    isAdmin: true,
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    setFormfields({
      ...formfields,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    context.setIsHideSidebarAndHeader(true);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

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

    postData("/api/user/signin", formfields).then((res) => {
      try {
        if (res.error !== true) {
          localStorage.setItem("token", res.token);

          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id,
          };

          localStorage.setItem("user", JSON.stringify(user));

          context.setAlterBox({
            open: true,
            error: false,
            message: "Sign in successfully",
          });
          setTimeout(() => {
            // history("/dashboard");
            setLoading(false);
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          setLoading(false);
          context.setAlterBox({
            open: true,
            error: true,
            message: "Sign in failed",
          });
        }
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

  return (
    <>
      <img src={patern} alt="pattern" className="loginPattern" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} alt="logo" width="60px" />
            <h5 className="">Đăng nhập</h5>
          </div>

          <div className="wrapper mt-3 card border">
            <form onSubmit={signIn}>
              <div
                className={`form-group position-relative ${
                  inputIndex === 0 && "focus"
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
                className={`form-group position-relative ${
                  inputIndex === 1 && "focus"
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
                <Button type="submit" className="btn-blue btn-big w-100">
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

                <Button
                  variant="outlined"
                  className="w-100 btn-lg btn-big loginWithGoogle"
                >
                  <img src={GoogleIcons} width="20px" alt="" /> Đăng nhập bằng
                  Google
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer">
            <span className="text-center">
              Bạn chưa có tài khoản?{" "}
              <Link to={"/signup"} className="link color">
                Đăng ký
              </Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
