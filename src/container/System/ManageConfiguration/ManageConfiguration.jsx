import { Row } from "antd";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

import "./ManageConfiguration.scss";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getElementState } from "../../../redux/selectors/auth";

const ManageConfiguration = () => {
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);

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
              className={
                checkElement?.includes(item?.role)
                  ? "btn-item"
                  : "btn-item-hide"
              }
              onClick={() => onClick(item)}
            >
              <a className="text-btn">{item?.title}</a>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() =>
          navigate("/adminManage/manage-configuration/reward_collaborator")
        }
      >
        Phần thưởng
      </Button>
    </div>
  );
};

export default ManageConfiguration;

const DATA = [
  {
    id: 1,
    title: "Nguyên nhân huỷ",
    value: "reason_cancel",
    role: "get_reason_cancel_setting",
  },
  {
    id: 2,
    title: "Nhóm khách hàng",
    value: "group_customer",
    role: "get_group_customer_setting",
  },
  {
    id: 3,
    title: "Ứng dụng khách hàng",
    value: "app_customer",
    role: "get_app_customer_setting",
  },
  {
    id: 4,
    title: "Ứng dụng CTV",
    value: "app_collaborator",
    role: "get_app_collaborator_setting",
  },
  {
    id: 5,
    title: "Cấu hình QrCode",
    value: "config_qr",
  },
  {
    id: 6,
    title: "Tạo tài khoản quản trị",
    value: "create_account",
    role: "get_user_system",
  },
  {
    id: 7,
    title: "Tạo câu hỏi cho CTV",
    value: "create_quizz",
    role: "get_exam_test_setting",
  },
  {
    id: 8,
    title: "Tạo lí do phạt",
    value: "reason_punish",
    role: "get_reason_punish_setting",
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
    role: "get_role_permission_setting",
  },
];
