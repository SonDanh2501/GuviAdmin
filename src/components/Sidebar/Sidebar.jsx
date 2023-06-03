import { NavLink, useNavigate } from "react-router-dom";

import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse, Nav } from "reactstrap";
import logo from "../../assets/images/LogoS.png";
import { getBrand } from "../../redux/actions/brand";
import { getUser } from "../../redux/selectors/auth";
import router from "../../routes/router";
import "./Sidebar.scss";
import { getToken } from "../../helper/tokenHelper";

const Sidebar = ({ onClick }) => {
  const user = useSelector(getUser);
  const token = useSelector(getToken);

  const [collapsed, setCollapsed] = useState(true);
  const [collapsedService, setCollapsedService] = useState(true);
  const [collapsedReport, setCollapsedReport] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  const toggleServiceNavbar = () => setCollapsedService(!collapsedService);
  const toggleReportNavbar = () => setCollapsedReport(!collapsedReport);

  return (
    <div className="div-sidebar">
      <div className="div-logo">
        <img src={logo} className="img-logo" />
      </div>
      <div responsive className="container-sidebar">
        {router?.map((item, key) => {
          return (
            <div key={key}>
              {item?.role === user?.role && (
                <div>
                  {item?.side?.map((itemSide, indexSide) => {
                    return (
                      <>
                        <ul className="nav nav-pills flex-column">
                          {itemSide?.tab.length === 0 && (
                            <li>
                              <NavLink to={itemSide?.path}>
                                {({ isActive }) => (
                                  <div
                                    className={
                                      isActive ? "active-link" : "unactive-link"
                                    }
                                  >
                                    <img
                                      src={itemSide?.icon}
                                      className="img-icon"
                                    />
                                    <a
                                      className={
                                        isActive
                                          ? "active-text"
                                          : "unactive-text"
                                      }
                                    >
                                      {itemSide?.name}
                                    </a>
                                  </div>
                                )}
                              </NavLink>
                            </li>
                          )}
                          {itemSide?.tab?.length > 0 && (
                            <li>
                              <NavLink
                                to={itemSide?.path}
                                onClick={
                                  itemSide?.layout === "job"
                                    ? toggleNavbar
                                    : itemSide?.layout === "group"
                                    ? toggleServiceNavbar
                                    : null
                                }
                              >
                                {({ isActive }) => (
                                  <div
                                    className={
                                      isActive ? "active-link" : "unactive-link"
                                    }
                                  >
                                    <img
                                      src={itemSide?.icon}
                                      className="img-icon"
                                    />
                                    <a
                                      className={
                                        isActive
                                          ? "active-text"
                                          : "unactive-text"
                                      }
                                    >
                                      {itemSide?.name}
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
                                  itemSide?.layout === "job"
                                    ? !collapsed
                                    : itemSide?.layout === "group"
                                    ? !collapsedService
                                    : null
                                }
                              >
                                <Nav className="nav" navbar>
                                  {itemSide?.tab?.map((i, index) => {
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
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
