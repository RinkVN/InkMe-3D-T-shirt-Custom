import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { baseUrl, postData } from "../../utils/api";
import { MyContext } from "../../context/MyConext";
import Logo from "../../img/logo.webp";
import patern from "../../img/pattern.webp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const context = useContext(MyContext);

  useEffect(() => {
    if (!token) {
      context.setAlterBox({
        open: true,
        error: true,
        message: "Invalid or expired reset link",
      });
      navigate("/login");
    }
  }, [token, context, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      context.setAlterBox({
        open: true,
        error: true,
        message: "Please fill in all fields",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      context.setAlterBox({
        open: true,
        error: true,
        message: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await postData(`${baseUrl}/user/reset-password`, {
        token,
        password: formData.password,
      });

      if (response.error === true) {
        context.setAlterBox({
          open: true,
          error: true,
          message: response.message || "Failed to reset password",
        });
      } else {
        context.setAlterBox({
          open: true,
          error: false,
          message: "Password has been reset successfully",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      context.setAlterBox({
        open: true,
        error: true,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const focusInput = (index) => {
    setInputIndex(index);
  };

  return (
    <>
      <img src={patern} alt="pattern" className="loginPattern" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} alt="logo" width="60px" />
            <h5 className="">Đặt lại mật khẩu</h5>
          </div>

          <div className="wrapper mt-3 card border">
            <form onSubmit={handleSubmit}>
              <div
                className={`form-group position-relative ${
                  inputIndex === 0 && "focus"
                }`}
              >
                <span className="icon">
                  <RiLockPasswordFill />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu mới"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggleShowPassword"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
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
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Xác nhận mật khẩu mới"
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggleShowPassword"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
              </div>

              <div className="form-group">
                <Button type="submit" className="btn-blue btn-big w-100">
                  {loading ? <CircularProgress /> : "Đặt lại mật khẩu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
