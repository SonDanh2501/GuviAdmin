import { NavLink, useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse, Nav } from "reactstrap";
import logo from "../../assets/images/LogoS.png";
import { getBrand } from "../../redux/actions/brand";
import { getPermissionState, getUser } from "../../redux/selectors/auth";
import router from "../../routes/router";
import "./Sidebar.scss";

const Sidebar = ({ onClick }) => {
  const user = useSelector(getUser);
  const permission = useSelector(getPermissionState);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedService, setCollapsedService] = useState(true);
  const checkPermission = [];

  const toggleNavbar = () => setCollapsed(!collapsed);
  const toggleServiceNavbar = () => setCollapsedService(!collapsedService);

  permission?.map((item) => {
    checkPermission.push(item?.id_side_bar);
  });

  useEffect(() => {}, [checkPermission]);

  return (
    <div className="div-sidebar">
      <div className="div-logo">
        <img src={logo} className="img-logo" />
      </div>
      <div responsive className="container-sidebar">
        {router?.map((item, key) => {
          return (
            <div key={key}>
              <ul className="nav nav-pills flex-column">
                {item?.tab.length === 0 && (
                  <li
                    className={
                      checkPermission?.includes(item?.id_sidebar)
                        ? "li-nav-link"
                        : "li-nav-link-none"
                    }
                  >
                    <NavLink to={item?.path}>
                      {({ isActive }) => (
                        <div
                          className={isActive ? "active-link" : "unactive-link"}
                        >
                          <img src={item?.icon} className="img-icon" />
                          <a
                            className={
                              isActive ? "active-text" : "unactive-text"
                            }
                          >
                            {item?.name}
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </li>
                )}
                {item?.tab?.length > 0 && (
                  <li
                    className={
                      checkPermission?.includes(item?.id_sidebar)
                        ? "li-nav-link"
                        : "li-nav-link-none"
                    }
                  >
                    <NavLink
                      to={item?.path}
                      onClick={
                        item?.layout === "job"
                          ? toggleNavbar
                          : item?.layout === "group"
                          ? toggleServiceNavbar
                          : null
                      }
                    >
                      {({ isActive }) => (
                        <div
                          className={isActive ? "active-link" : "unactive-link"}
                        >
                          <img src={item?.icon} className="img-icon" />
                          <a
                            className={
                              isActive ? "active-text" : "unactive-text"
                            }
                          >
                            {item?.name}
                          </a>
                          {collapsed ? (
                            <i class="uil uil-angle-right icon-right"></i>
                          ) : (
                            <i class="uil uil-angle-down icon-right"></i>
                          )}
                        </div>
                      )}
                    </NavLink>
                    <Collapse
                      isOpen={
                        item?.layout === "job"
                          ? !collapsed
                          : item?.layout === "group"
                          ? !collapsedService
                          : null
                      }
                    >
                      <Nav className="nav-link-sidebar" navbar>
                        {item?.tab?.map((i, index) => {
                          return (
                            <NavLink to={i?.path} key={index}>
                              {({ isActive }) => (
                                <div
                                  className={
                                    isActive
                                      ? "active-link-nav"
                                      : "unactive-link-nav"
                                  }
                                >
                                  <i class="uil uil-shopping-bag icon"></i>
                                  <a
                                    className={
                                      isActive
                                        ? "active-text-nav"
                                        : "unactive-text-nav"
                                    }
                                  >
                                    {i?.name}
                                  </a>
                                </div>
                              )}
                            </NavLink>
                          );
                        })}
                      </Nav>
                    </Collapse>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
