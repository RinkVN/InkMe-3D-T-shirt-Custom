import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CurrentDoler from "./CurrentDoler";
import { Avatar } from "@mui/material";
import { useMyContext } from "../../context/MyConext";
import { getUserById } from "../../services/UserServices";
import avatarDefault from "../../img/avatar_defaut.jpg";

const HeaderTopbar = (props) => {
  const { userId, logout } = useMyContext();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserById(userId);
      if (res) setUser(res);
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const handleLogout = () => {
    setUser(null);
    logout();
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="header-top-wrapper">
        <p>
          <Link onClick={ClickHandler} to="del:+41888567890">
            (+84)968338829
          </Link>
            - 24/7
        </p>
        <p> 🔥 Miễn phí vận chuyển với đơn hàng trên 1000.000đ </p>
        <div className="header-top-right">
          <div className="social-icon d-flex align-items-center">
            <Link onClick={ClickHandler} to="#">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link onClick={ClickHandler} to="#">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link onClick={ClickHandler} to="#">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link onClick={ClickHandler} to="#">
              <i className="fab fa-pinterest-p"></i>
            </Link>
          </div>
          <CurrentDoler />
          {/* <div>
            <h3>Login</h3>
            <h3>SignUp</h3>
          </div> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {user ? (
              <>
                <Avatar
                  alt={user?.name}
                  src={
                    Array.isArray(user.images) &&
                    user.images.length > 0 &&
                    user.images[0]
                      ? user.images[0]
                      : avatarDefault
                  }
                  sx={{ width: 35, height: 35 }}
                />
                <p>{user?.name}</p>
              </>
            ) : (
              <>
                <p onClick={() => navigate("/login")}>Login</p>
              </>
            )}
            {user && <p onClick={() => handleLogout()}>|| Logout</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTopbar;
