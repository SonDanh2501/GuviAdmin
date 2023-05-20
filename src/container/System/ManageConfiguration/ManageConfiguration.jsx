import { Row } from "antd";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

import "./ManageConfiguration.scss";
import { useEffect } from "react";

const ManageConfiguration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClick = (item) => {
    switch (item?.value) {
      case "reason_cancel":
        navigate("/adminManage/manage-configuration/manage-reason");
        break;
      case "group_customer":
        navigate("/adminManage/manage-configuration/manage-group-customer");
        break;
      case "app_customer":
        navigate("/adminManage/manage-configuration/manage-app-customer");
        break;
      case "app_collaborator":
        navigate("/adminManage/manage-configuration/manage-app-collaborator");
        break;
      case "config_qr":
        navigate("/adminManage/manage-configuration/setting-qrcode");
        break;
      case "create_account":
        navigate("/adminManage/manage-configuration/create-account");
        break;
      case "create_quizz":
        navigate("/adminManage/manage-configuration/create_quizz");
        break;
      case "reason_punish":
        navigate("/adminManage/manage-configuration/reason_punish");
        break;
      case "setting_service":
        navigate("/services/manage-group-service");
        break;
      case "setting_role":
        navigate("/adminManage/manage-configuration/setting_role");
        break;

      default:
        break;
    }
  };

  return (
    <div className="container-configuration">
      <div className="div-list-btn">
        {DATA.map((item) => {
          return (
            <div
              key={item?.id}
              className="btn-item"
              onClick={() => onClick(item)}
            >
              <a className="text-btn">{item?.title}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageConfiguration;

const DATA = [
  {
    id: 1,
    title: "Nguyên nhân huỷ",
    value: "reason_cancel",
  },
  {
    id: 2,
    title: "Nhóm khách hàng",
    value: "group_customer",
  },
  {
    id: 3,
    title: "Ứng dụng khách hàng",
    value: "app_customer",
  },
  {
    id: 4,
    title: "Ứng dụng CTV",
    value: "app_collaborator",
  },
  {
    id: 5,
    title: "Cấu hình QrCode",
    value: "config_qr",
  },
  {
    id: 6,
    title: "Tạo tài khoản",
    value: "create_account",
  },
  {
    id: 7,
    title: "Tạo câu hỏi cho CTV",
    value: "create_quizz",
  },
  {
    id: 8,
    title: "Tạo lí do phạt",
    value: "reason_punish",
  },
  {
    id: 9,
    title: "Cấu hình dịch vụ",
    value: "setting_service",
  },
  {
    id: 10,
    title: "Cấu hình quyền quản trị",
    value: "setting_role",
  },
];
