import { Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import "./ManageConfiguration.scss";
import i18n from "../../../i18n";
import Chat from "../Chat";

const ManageConfiguration = () => {
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

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
      case "reward_collaborator":
        navigate("/adminManage/manage-configuration/reward_collaborator");
        break;
      case "image_manager":
        navigate("/adminManage/manage-configuration/image_manage");
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
              <a className="text-btn">{`${i18n.t(item?.title, {
                lng: lang,
              })}`}</a>
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
    title: "config_cancel_reason",
    value: "reason_cancel",
    role: "get_reason_cancel_setting",
  },
  {
    id: 2,
    title: "config_group_customer",
    value: "group_customer",
    role: "get_group_customer_setting",
  },
  {
    id: 3,
    title: "config_app_customer",
    value: "app_customer",
    role: "get_app_customer_setting",
  },
  {
    id: 4,
    title: "config_app_collaborator",
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
    title: "config_admin_account",
    value: "create_account",
    role: "get_user_system",
  },
  {
    id: 7,
    title: "config_question",
    value: "create_quizz",
    role: "get_exam_test_setting",
  },
  {
    id: 8,
    title: "config_punish_reason",
    value: "reason_punish",
    role: "get_reason_punish_setting",
  },
  {
    id: 9,
    title: "config_admin_right",
    value: "setting_role",
    role: "get_role_permission_setting",
  },
  {
    id: 10,
    title: "config_bonus_collaborator",
    value: "reward_collaborator",
    role: "get_reward_collaborator_setting",
  },
  {
    id: 11,
    title: "Cấu hình dịch vụ",
    value: "setting_service",
    role: "get_group_service_setting",
  },
  {
    id: 12,
    title: "Quản lý hình ảnh",
    value: "image_manager",
    role: "get_file_manager",
  },
];
