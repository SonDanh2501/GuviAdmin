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
                  Trang chủ
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
                  Quản lý người dùng
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
                  Quản lý CTV
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/promotion/manage-promotion"
            onClick={() => changeBrand("Quản lý Promotion")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-pricetag-alt icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý Promotion
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings/manage-banner"
            onClick={() => changeBrand("Quản lý Banner")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-money-bill icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý Banner
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings/manage-news"
            onClick={() => changeBrand("Quản lý bài viết Guvi")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i className="uil uil-postcard icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý bài viết Guvi
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
                  Quản lý service
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
                  Quản lý phản hồi
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings/manage-reason"
            onClick={() => changeBrand("Quản lý lý do huỷ")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i class="uil uil-cancel icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý lý do huỷ
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
                  Quản lý đơn hàng
                </a>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/topup/manage-topup"
            onClick={() => changeBrand("Quản lý nạp/rút CTV")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i class="uil uil-money-withdrawal icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý nạp/rút CTV
                </a>
              </div>
            )}
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/topup/manage-topup-customer"
            onClick={() => changeBrand("Quản lý nạp KH")}
          >
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <i class="uil uil-money-withdrawal icon"></i>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý nạp point KH
                </a>
              </div>
            )}
          </NavLink>
        </li> */}
        <li>
          <NavLink to="/adminManage/manage-admin">
            {({ isActive }) => (
              <div className={isActive ? "active-link" : "unactive-link"}>
                <a className={isActive ? "active-text" : "unactive-text"}>
                  Quản lý Admin
                </a>
              </div>
            )}
          </NavLink>
        </li>
      </ul>
      <div>
        <Input
          id="exampleColor"
          name="color"
          placeholder="color placeholder"
          type="color"
          className="input-color"
          onChange={(e) => onChangeColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Sidebar;
