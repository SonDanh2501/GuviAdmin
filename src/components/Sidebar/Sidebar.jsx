import { Link, NavLink, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { getBrand } from "../../redux/actions/brand";
import logo from "../../assets/images/LogoS.png";
import "./Sidebar.scss";
import { Input } from "reactstrap";

const Sidebar = ({ onChangeColor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeBrand = useCallback((title, brand) => {
    dispatch(getBrand.getBrandRequest(title));
    if (brand === "home") {
      navigate("/");
    }
  });

  return (
    <div className="pt-3 container min-height-100vh" responsive>
      <div className="div-header">
        <img
          src={logo}
          className="logo"
          onClick={() => {
            changeBrand("Trang chủ", "home");
          }}
        />
      </div>
      {/* <NavLink activeClassName="active" to="/" exact>Home</NavLink> */}
      <ul className="nav nav-pills flex-column mt-5">
        <li>
          <NavLink to="/" onClick={() => changeBrand("Trang chủ")}>
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-estate icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Tổng quan
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/group-order/manage-order"
            onClick={() => changeBrand("Quản lý đơn hàng")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i class="uil uil-shopping-bag icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Guvi Jobs
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/system/user-manage"
            onClick={() => changeBrand("Quản lý người dùng")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-user-square icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Khách hàng
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/system/collaborator-manage"
            onClick={() => changeBrand("Quản lý CTV")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-user-square icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Cộng tác viên
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services/manage-group-service"
            onClick={() => changeBrand("Quản lý group-service")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-book-reader icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Dịch vụ
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/promotion/manage-setting">
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-pricetag-alt icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Khuyến mãi
                </a>
              </div>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/feedback/manage-feedback"
            onClick={() => changeBrand("Quản lý phản hồi")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-feedback icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Hỗ trợ
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/topup/manage-topup">
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i class="uil uil-money-withdrawal icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Tài chính
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/report/manage-report">
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i class="uil uil-cancel icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Báo cáo
                </a>
              </div>
            )}
          </NavLink>
        </li>
      </ul>

      <NavLink to="/adminManage/manage-configuration">
        {({ isActive }) => (
          <div className={isActive ? "active-link" : "unactive-link"}>
            <a className={isActive ? "active-text" : "unactive-text"}>
              <i class="uil uil-setting icon"></i>
              Cấu hình
            </a>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default Sidebar;
