import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Auth from "../layout/Auth.js";
import Dashboard from "../layout/Dashboard.js";
import Main from "../layout/Main/index.jsx";
import { getServiceAction } from "../redux/actions/service.js";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";
import AuthAffiliate from "../layout/authAffiliate.js";
import MainAffiliate from "../layout/MainAffiliate/index.jsx";

const MainPort = Number(process.env.REACT_APP_PORT_MAIN);
const AffiliatePort = Number(process.env.REACT_APP_PORT_AFFILIATE);

const App = () => {
  const currentPort = Number(window.location.port); // Cổng chạy hiện tại (dùng để phân biệt chạy affiliate hay admin trên môi trường develop)
  const currentUrl = window.location.hostname // Đường link URL hiện tại (dùng để phân biệt chạy affiliate hay admin trên môi trường product)
  const currentUrlName = currentUrl.split(".")[0];
  const isCheckLogin = useSelector(getIsCheckLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

    if (!isCheckLogin && currentPort === AffiliatePort)   {
      navigate("/auth/login-affiliate");
    }
    if (!isCheckLogin && currentPort === MainPort) {
      navigate("/auth/login");
    }
    if (
      !isCheckLogin &&
      (currentUrlName === "admin" ||
        currentUrlName === "admin-dev" ||
        currentUrlName === "admin-test")
    ) {
      navigate("/auth/login");
    }
    if (
      !isCheckLogin &&
      (currentUrlName === "affiliate" ||
        currentUrlName === "affiliate-dev" ||
        currentUrlName === "affiliate-test")
    ) {
      navigate("/auth/login-affiliate");
    }
    dispatch(getServiceAction.getServiceRequest());
  }, []);

  /* Việc check theo currentPort chỉ phù hợp cho chạy local thì mới lấy ra được 
  ví dụ: http://localhost:3000, http://localhost:3001, còn khi chạy trên server thì current sẽ random */
  /* Thêm một điều kiện để check nữa nếu port không đúng thì sẽ kiểm tra xem link URL: trang admin: admin, trang dev: admin-dev-guvico, trang test: admin-test-guvico*/
  return (
    <>
      {/* Dành cho việc chạy server chính */}
      {currentUrlName === "admin" ||
      currentUrlName === "admin-dev" ||
      currentUrlName === "admin-test" ? (
        isCheckLogin ? (
          <Main />
        ) : (
          <Auth />
        )
      ) : currentUrlName === "affiliate" ||
        currentUrlName === "affiliate-test" ||
        currentUrlName === "affiliate-dev" ? (
        isCheckLogin ? (
          <MainAffiliate />
        ) : (
          <AuthAffiliate />
        )
      ) : (
        ""
      )}
      {/* Dành cho việc chạy local */}
      {/* {currentPort === AffiliatePort && isCheckLogin ? (
        <MainAffiliate />
      ) : (
        <AuthAffiliate />
      )}
      {currentPort === MainPort && isCheckLogin ? <Main /> : <Auth />} */}
      {currentPort === AffiliatePort ? (
        isCheckLogin ? (
          <MainAffiliate />
        ) : (
          <AuthAffiliate />
        )
      ) : currentPort === MainPort ? (
        isCheckLogin ? (
          <Main />
        ) : (
          <Auth />
        )
      ) : (
        ""
      )}
    </>
  );
};

export default App;
