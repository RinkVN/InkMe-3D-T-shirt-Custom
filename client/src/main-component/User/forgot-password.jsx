import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { baseUrl, postData } from "../../utils/api";
import { MyContext } from "../../context/MyContext";
import Logo from "../../img/logo.webp";
import patern from "../../img/pattern.webp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const context = useContext(MyContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      context.setAlterBox({
        open: true,
        error: true,
        message: "Please enter your email",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await postData(`/api/user/forgot-password`, {
        email,
      });

      if (response.error === true) {
        context.setAlterBox({
          open: true,
          error: true,
          message: response.message || "Failed to process request",
        });
      } else {
        context.setAlterBox({
          open: true,
          error: false,
          message: "Password reset link has been sent to your email",
        });
        setEmail("");
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
            <h5 className="">Quên mật khẩu</h5>
          </div>

          <div className="wrapper mt-3 card border">
            <form onSubmit={handleSubmit}>
              <div
                className={`form-group position-relative ${inputIndex === 0 && "focus"
                  }`}
              >
                <span className="icon">
                  <MdEmail />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email của bạn"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <Button type="submit" className="btn-blue btn-big w-100">
                  {loading ? <CircularProgress /> : "Gửi yêu cầu"}
                </Button>
              </div>

              <div className="form-group text-center mt-3">
                <Link to="/login" className="link">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
