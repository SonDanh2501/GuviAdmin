import "./Navigator.scss";
import { Link, NavLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { getBrand } from "../../redux/actions/brand";
import logo from "../../assets/images/LogoS.png";

const Navigator = () => {
  const dispatch = useDispatch();
  const changeBrand = useCallback((title) => {
    dispatch(getBrand.getBrandRequest(title));
  });

  return (
    <div className="pt-3 container min-height-100vh" responsive>
      <div className="div-header">
        <img src={logo} className="logo" />
      </div>
      {/* <NavLink activeClassName="active" to="/" exact>Home</NavLink> */}
      <ul className="nav nav-pills flex-column mt-5">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/"
            onClick={() => changeBrand("Trang chủ")}
          >
            <i className="uil uil-estate icon"></i>
            Trang chủ
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/system/user-manage"
            onClick={() => changeBrand("Quản lý người dùng")}
          >
            <i className="uil uil-user-square icon"></i>
            Quản lý người dùng
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/system/collaborator-manage"
            onClick={() => changeBrand("Quản lý CTV")}
          >
            <i className="uil uil-user-square icon"></i>
            Quản lý CTV
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/promotion/manage-promotion"
            onClick={() => changeBrand("Quản lý Promotion")}
          >
            <i className="uil uil-pricetag-alt icon"></i>
            Quản lý Promotion
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/settings/manage-banner"
            onClick={() => changeBrand("Quản lý Banner")}
          >
            <i className="uil uil-money-bill icon"></i>
            Quản lý Banner
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/settings/manage-news"
            onClick={() => changeBrand("Quản lý bài viết Guvi")}
          >
            <i className="uil uil-postcard icon"></i>
            Quản lý bài viết Guvi
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/services/manage-group-service"
            onClick={() => changeBrand("Quản lý group-service")}
          >
            <i className="uil uil-book-reader icon"></i>
            Quản lý group-service
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/feedback/manage-feedback"
            onClick={() => changeBrand("Quản lý phản hồi")}
          >
            <i className="uil uil-feedback icon"></i>
            Quản lý phản hồi
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/settings/manage-reason">
            Quản lý lý do huỷ việc
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/notification/manage-notification">
            Quản lý thông báo
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/adminManage/manage-admin">
            Quản lý Admin
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigator;
