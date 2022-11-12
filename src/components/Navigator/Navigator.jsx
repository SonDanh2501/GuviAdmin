import "./Navigator.scss";
import { Link, NavLink } from "react-router-dom";

const Navigator = () => {
  return (
    <div className="topnav">
      {/* <NavLink activeClassName="active" to="/" exact>Home</NavLink> */}
      <NavLink activeClassName="active" to="/system/user-manage">
        Quản lý người dùng
      </NavLink>
      <NavLink activeClassName="active" to="/system/collaborator-manage">
        Quản lý CTV
      </NavLink>
      <NavLink activeClassName="active" to="/promotion/manage-promotion">
        Quản lý Promotion
      </NavLink>
      <NavLink activeClassName="active" to="/settings/manage-banner">
        Quản lý Banner
      </NavLink>
      <NavLink activeClassName="active" to="/settings/manage-news">
        Quản lý bài viết Guvi
      </NavLink>
      <NavLink activeClassName="active" to="/settings/manage-reason">
        Quản lý lý do huỷ việc
      </NavLink>
      <NavLink activeClassName="active" to="/notification/manage-notification">
        Quản lý thông báo
      </NavLink>
      <NavLink activeClassName="active" to="/adminManage/manage-admin">
        Quản lý Admin
      </NavLink>
    </div>
  );
};

export default Navigator;
