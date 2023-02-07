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
import Logo from "../../assets/images/LogoS.png";
import { BellOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Space, Dropdown, List } from "antd";
import { useState } from "react";
import { removeToken } from "../../helper/tokenHelper";

const Header = () => {
  const dispatch = useDispatch();
  const [data, setDate] = useState([]);
  const [status, setStatus] = useState(false);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  const onLogout = () => {
    removeToken();
    dispatch(loadingAction.loadingRequest(true));
    dispatch(logoutAction.logoutRequest(navigate));
  };

  const items = [
    {
      label: <a onClick={onLogout}>Logout</a>,
      key: "0",
    },
  ];

  return (
    <div className="container-header">
      <div className="menu">
        {/* <button onClick={onClick} className="btn-menu">
          <i
            style={{ width: 40, height: 40 }}
            class="uil uil-align-justify"
          ></i>
        </button> */}
        <img src={Logo} className="img-logo" onClick={() => navigate("/")} />
      </div>

      <div className="nav">
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <a className="text-name">{user?.name}</a>
              <CaretDownOutlined className="icon-down" />
            </Space>
          </a>
        </Dropdown>
        <div className="div-noti" onClick={() => setStatus(!status)}>
          {data.length > 0 && <div className="dot-noti" />}
          <BellOutlined className="icon" />
        </div>

        {status && (
          <div className="list">
            <List
              itemLayout="horizontal"
              dataSource={[1, 2, 3, 4]}
              renderItem={(item) => {
                return (
                  <div onClick={() => setStatus(false)}>
                    <a>Lee Minh dang</a>
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
