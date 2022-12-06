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
import { loadingAction } from "../../redux/actions/loading";

const Header = ({ onClick, hideSidebar, color }) => {
  const dispatch = useDispatch();
  const brand = useSelector(getBrand);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(logoutAction.logoutRequest(navigate));
  };

  return (
    <div className="container-header">
      <div className="menu">
        <button onClick={onClick} className="btn-menu">
          <i
            style={{ width: 40, height: 40 }}
            class="uil uil-align-justify"
          ></i>
        </button>
        {/* <p className="text-brand">{brand}</p> */}
      </div>
      <Nav className="align-items-center d-none d-md-flex" navbar>
        <UncontrolledDropdown nav>
          <DropdownToggle className="pr-0" nav>
            <Media className="align-items-center">
              <span className="avatar avatar-sm rounded-circle">
                <img alt="..." src={imageUser} className="img-user" />
              </span>
              <Media className="ml-2 d-none d-lg-block">
                <h5 className="text-name">{user?.name}</h5>
              </Media>
            </Media>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-arrow" right>
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
