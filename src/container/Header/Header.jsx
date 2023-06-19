import {
  BellOutlined,
  CaretDownOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Dropdown, List, Select, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../helper/tokenHelper";
import { languageAction, logoutAction } from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import { getLanguageState, getUser } from "../../redux/selectors/auth";
import "./Header.scss";

const Header = ({ onClick, hide }) => {
  const dispatch = useDispatch();
  const [data, setDate] = useState([]);
  const [status, setStatus] = useState(false);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);

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

  const handleChange = (e) => {
    dispatch(languageAction.languageRequest({ language: e }));
  };

  return (
    <div className="div-container-header">
      <div className="menu-icon" onClick={onClick}>
        {hide ? <i class="uil uil-bars icon-menu"></i> : <MenuUnfoldOutlined />}
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
              <a className="text-name">{user?.full_name}</a>
              <CaretDownOutlined className="icon-down" />
            </Space>
          </a>
        </Dropdown>
        <>
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
        </>

        <Select
          style={{ width: 120 }}
          value={lang}
          onChange={handleChange}
          options={[
            { value: "vi", label: "Việt Nam" },
            { value: "en", label: "English" },
          ]}
        />
      </div>
    </div>
  );
};

export default Header;
