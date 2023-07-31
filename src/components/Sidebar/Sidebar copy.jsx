import { Link, NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { getBrand } from "../../redux/actions/brand";
import logo from "../../assets/images/LogoS.png";
import home from "../../assets/images/home.svg";
import bag from "../../assets/images/bag.svg";
import customer from "../../assets/images/2user.svg";
import collaborator from "../../assets/images/collaborator.svg";
import notification from "../../assets/images/notification.svg";
import setting from "../../assets/images/setting.svg";
import ticket from "../../assets/images/ticket.svg";
import cards from "../../assets/images/cards.svg";
import like from "../../assets/images/like.svg";
import document from "../../assets/images/document.svg";
import service from "../../assets/images/service.svg";
import request from "../../assets/images/request.svg";
import finance from "../../assets/images/finance.svg";
import "./Sidebar.scss";
import { Collapse, Input, Nav, NavbarToggler, NavItem } from "reactstrap";
import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { getUser } from "../../redux/selectors/auth";

const Sidebar = ({ onClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const changeBrand = useCallback((title, brand) => {
    dispatch(getBrand.getBrandRequest(title));
    if (brand === "home") {
      navigate("/");
    }
  });

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
      <div className="container-sidebar" responsive>
        {user?.role === "admin" ? (
          <ul className="nav nav-pills flex-column ">
            <li>
              <NavLink to="/">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={home} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Tổng quan
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/group-order/manage-order" onClick={toggleNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={bag} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      GUVIJOBS
                    </a>
                    {collapsed ? (
                      <i class="uil uil-angle-right icon-right"></i>
                    ) : (
                      <i class="uil uil-angle-down icon-right"></i>
                    )}
                  </div>
                )}
              </NavLink>

              <Collapse isOpen={!collapsed}>
                <Nav className="nav" navbar>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/all">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Tất cả công việc
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/doing">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ chưa hoàn tất
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/done">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ hết hạn
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </li>
            <li>
              <NavLink to="/system/deep-cleaning">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={request} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Yêu cầu dịch vụ
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/system/user-manage">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={customer} className="img-icon" />
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
                    <img src={collaborator} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Cộng tác viên
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services/edit-service"
                onClick={toggleServiceNavbar}
              >
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={service} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Dịch vụ
                    </a>
                  </div>
                )}
              </NavLink>
              {/* <Collapse isOpen={!collapsedService}>
                <Nav className="nav" navbar>
                  <NavItem>
                    <NavLink to="/services/manage-group-service/all">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Tất cả dịch vụ
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/services/manage-group-service/doing">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Nhóm dịch vụ
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse> */}
            </li>
            <li>
              <NavLink to="/promotion/manage-setting">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={ticket} className="img-icon" />
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
                    <img src={like} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      CSKH
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/finance/manage-finance">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={finance} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Tài chính
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/topup/manage-topup">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={cards} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Sổ Quỹ
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/report/manage-report" onClick={toggleReportNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={document} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Báo cáo
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/notification/manage-push-notification">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={notification} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Thông báo
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        ) : user?.role === "marketing" || user?.role === "marketing_manager" ? (
          <ul className="nav nav-pills flex-column ">
            <li>
              <NavLink to="/">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={home} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Tổng quan
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/group-order/manage-order" onClick={toggleNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={bag} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      GUVIJOBS
                    </a>
                    {collapsed ? (
                      <i class="uil uil-angle-right icon-right"></i>
                    ) : (
                      <i class="uil uil-angle-down icon-right"></i>
                    )}
                  </div>
                )}
              </NavLink>

              <Collapse isOpen={!collapsed}>
                <Nav className="nav" navbar>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/all">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Tất cả công việc
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/doing">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ chưa hoàn tất
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/done">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ hết hạn
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </li>
            <li>
              <NavLink to="/system/user-manage">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={customer} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Khách hàng
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/promotion/manage-setting">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={ticket} className="img-icon" />
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
                    <img src={like} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      CSKH
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/notification/manage-push-notification">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={notification} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Thông báo
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/report/manage-report" onClick={toggleReportNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={document} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Báo cáo
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        ) : user?.role === "support_customer" ? (
          <ul className="nav nav-pills flex-column ">
            <li>
              <NavLink to="/group-order/manage-order" onClick={toggleNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={bag} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      GUVIJOBS
                    </a>
                    {collapsed ? (
                      <i class="uil uil-angle-right icon-right"></i>
                    ) : (
                      <i class="uil uil-angle-down icon-right"></i>
                    )}
                  </div>
                )}
              </NavLink>

              <Collapse isOpen={!collapsed}>
                <Nav className="nav" navbar>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/all">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Tất cả công việc
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/doing">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ chưa hoàn tất
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/done">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ hết hạn
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </li>
            <li>
              <NavLink to="/system/deep-cleaning">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={request} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Yêu cầu dịch vụ
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/system/user-manage">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={customer} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Khách hàng
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
                    <img src={like} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      CSKH
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        ) : user?.role === "accountant" ? (
          <ul className="nav nav-pills flex-column ">
            <li>
              <NavLink to="/topup/manage-topup">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={cards} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Sổ Quỹ
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/report/manage-report" onClick={toggleReportNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={document} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Báo cáo
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        ) : user?.role === "support" ? (
          <ul className="nav nav-pills flex-column ">
            <li>
              <NavLink to="/group-order/manage-order" onClick={toggleNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={bag} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      GUVIJOBS
                    </a>
                    {collapsed ? (
                      <i class="uil uil-angle-right icon-right"></i>
                    ) : (
                      <i class="uil uil-angle-down icon-right"></i>
                    )}
                  </div>
                )}
              </NavLink>

              <Collapse isOpen={!collapsed}>
                <Nav className="nav" navbar>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/all">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Tất cả công việc
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/doing">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ chưa hoàn tất
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/group-order/manage-order/done">
                      {({ isActive }) => (
                        <div
                          className={
                            isActive ? "active-link-nav" : "unactive-link-nav"
                          }
                        >
                          <i class="uil uil-shopping-bag icon"></i>
                          <a
                            className={
                              isActive ? "active-text-nav" : "unactive-text-nav"
                            }
                          >
                            Dịch vụ hết hạn
                          </a>
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </li>
            <li>
              <NavLink to="/system/deep-cleaning">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={request} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Yêu cầu dịch vụ
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/system/user-manage">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={customer} className="img-icon" />
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
                    <img src={collaborator} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Cộng tác viên
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/topup/manage-topup">
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={cards} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Sổ Quỹ
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
                    <img src={like} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      CSKH
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/report/manage-report" onClick={toggleReportNavbar}>
                {({ isActive }) => (
                  <div className={isActive ? "active-link" : "unactive-link"}>
                    <img src={document} className="img-icon" />
                    <a className={isActive ? "active-text" : "unactive-text"}>
                      Báo cáo
                    </a>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        ) : (
          <></>
        )}
        {user?.role === "admin" && (
          <div className="configuration">
            <NavLink to="/adminManage/manage-configuration">
              {({ isActive }) => (
                <div
                  className={
                    isActive
                      ? "active-link-configuration"
                      : "unactive-link-configuration"
                  }
                >
                  <img src={setting} className="img-icon" />
                  <a
                    className={
                      isActive
                        ? "active-text-configuration"
                        : "unactive-text-configuration"
                    }
                  >
                    Cấu hình
                  </a>
                </div>
              )}
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
