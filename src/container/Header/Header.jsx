import { useDispatch, useSelector } from "react-redux";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Nav,
  UncontrolledDropdown,
} from "reactstrap";
import { getUser } from "../../redux/selectors/auth";
import { getBrand } from "../../redux/selectors/brand";
import imageUser from "../../assets/images/user.png";
import "./Header.scss";
import { logoutAction } from "../../redux/actions/auth";
import { useNavigate } from "react-router-dom";

const Header = ({ onClick }) => {
  const dispatch = useDispatch();
  const brand = useSelector(getBrand);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logoutAction.logoutRequest());
    // <Navigate replace to="/auth/login" />;
    return navigate("/auth/login");
  };

  return (
    <div className="container-header">
      <div className="menu">
        <button onClick={onClick} className="btn-menu">
          <i class="uil uil-bars"></i>
        </button>
        <p className="text-brand">{brand}</p>
      </div>
      <Nav className="align-items-center d-none d-md-flex" navbar>
        <UncontrolledDropdown nav>
          <DropdownToggle className="pr-0" nav>
            <Media className="align-items-center">
              <span className="avatar avatar-sm rounded-circle">
                <img alt="..." src={imageUser} className="img-user" />
              </span>
              <Media className="ml-2 d-none d-lg-block">
                <span className="mb-0 text-sm font-weight-bold">
                  {user?.name}
                </span>
              </Media>
            </Media>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-arrow" right>
            {/* <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem> */}
            <DropdownItem divider />
            <DropdownItem href="#pablo" onClick={onLogout}>
              <i className="ni ni-user-run" />
              <span>Logout</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </div>
  );
};

export default Header;
