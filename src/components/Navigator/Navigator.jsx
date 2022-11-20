import "./Navigator.scss";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo.png";

const Navigator = () => {
  return (
    <div className="pt-3 container">
      <div className="div-header">
        <img src={logo} className="logo" />
        <h3 className="name-guvi">GUVI</h3>
      </div>
      {/* <NavLink activeClassName="active" to="/" exact>Home</NavLink> */}
      <ul className="nav nav-pills flex-column mt-5">
        <li className="nav-item">
          <NavLink className="nav-link" to="/system/user-manage">
            Quản lý người dùng
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/system/collaborator-manage">
            Quản lý CTV
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/promotion/manage-promotion">
            Quản lý Promotion
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/settings/manage-banner">
            Quản lý Banner
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/settings/manage-news">
            Quản lý bài viết Guvi
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/services/manage-group-service">
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
