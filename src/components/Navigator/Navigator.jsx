import "./Navigator.scss";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo.png";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { getBrand } from "../../redux/actions/brand";

const Navigator = () => {
  const dispatch = useDispatch();
  const changeBrand = useCallback((title) => {
    dispatch(getBrand.getBrandRequest(title));
  });

  return (
    <div className="pt-3 container" responsive>
      <div className="div-header">
        <img src={logo} className="logo" />
        <h3 className="name-guvi">GUVI</h3>
      </div>
      {/* <NavLink activeClassName="active" to="/" exact>Home</NavLink> */}
      <ul className="nav nav-pills flex-column mt-5">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/system/user-manage"
            onClick={() => changeBrand("Quản lý người dùng")}
          >
            Quản lý người dùng
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/system/collaborator-manage"
            onClick={() => changeBrand("Quản lý CTV")}
          >
            Quản lý CTV
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/promotion/manage-promotion"
            onClick={() => changeBrand("Quản lý Promotion")}
          >
            Quản lý Promotion
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/settings/manage-banner"
            onClick={() => changeBrand("Quản lý Banner")}
          >
            Quản lý Banner
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/settings/manage-news"
            onClick={() => changeBrand("Quản lý bài viết Guvi")}
          >
            Quản lý bài viết Guvi
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/services/manage-group-service"
            onClick={() => changeBrand("Quản lý group-service")}
          >
            Quản lý group-service
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/settings/manage-reason">
            Quản lý lý do huỷ việc
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/notification/manage-notification">
            Quản lý thông báo
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/adminManage/manage-admin">
            Quản lý Admin
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigator;
