import { Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import "./ManageConfiguration.scss";
import { Upload } from "antd";
import SettingQrCode from "./ScreenConfiguration/SettingQrcode";

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
        navigate("/adminManage/manage-configuration/lesson");
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
      case "group_promotion":
        navigate("/adminManage/manage-configuration/group_promotion_manage");
        break;
      case "business_config":
        navigate("/adminManage/manage-configuration/business_manage");
        break;
      default:
        break;
    }
  };

  const listNewConfiguration = [
    {
      title: "Cấu hình nguyên nhân hủy",
      detail: "Cấu hình nguyên nhân hủy",
      linkNavigate: "adminManage/manage-configuration/manage-reason",
    },
    {
      title: "Cầu hình nhóm khách hàng",
      detail: "Cầu hình nhóm khách hàng",
      linkNavigate: "adminManage/manage-configuration/manage-group-customer",
    },
    {
      title: "Cấu hình ứng dụng khách hàng",
      detail: "Cấu hình ứng dụng khách hàng",
      linkNavigate: "adminManage/manage-configuration/manage-app-customer",
    },
    {
      title: "Cấu hình ứng dụng đối tác",
      detail: "Cấu hình ứng dụng đối tác",
      linkNavigate: "adminManage/manage-configuration/manage-app-collaborator",
    },
    {
      title: "Cấu hình tài khoản quản trị",
      detail: "Cấu hình tài khoản quản trị",
      linkNavigate: "adminManage/manage-configuration/create-account",
    },
    {
      title: "Cấu hình bộ câu hỏi",
      detail: "Cấu hình bộ câu hỏi",
      linkNavigate: "adminManage/manage-configuration/lesson",
    },
    {
      title: "Cấu hình lí do phạt",
      detail: "Cấu hình lí do phạt",
      linkNavigate: "adminManage/manage-configuration/reason_punish",
    },
    {
      title: "Cấu hình quyền quản trị",
      detail: "Cấu hình quyền quản trị",
      linkNavigate: "adminManage/manage-configuration/setting_role",
    },
    {
      title: "Cấu hình điều kiện thưởng đối tác",
      detail: "Cấu hình điều kiện thưởng đối tác",
      linkNavigate: "adminManage/manage-configuration/reward_collaborator",
    },
    {
      title: "Cấu hình dịch vụ",
      detail: "Cấu hình dịch vụ",
      linkNavigate: "services/manage-group-service",
    },
    {
      title: "Cấu hình nhóm khuyến mãi",
      detail: "Cấu hình nhóm khuyến mãi",
      linkNavigate: "adminManage/manage-configuration/group_promotion_manage",
    },
    {
      title: "Cấu hình đối tác kinh doanh",
      detail: "Cấu hình đối tác kinh doanh",
      linkNavigate: "adminManage/manage-configuration/business_manage",
    },
    {
      title: "Cấu hình hình ảnh",
      detail: "Cấu hình hình ảnh",
      linkNavigate: "adminManage/manage-configuration/image_manage",
    },
    {
      title: "Cấu hình phạt",
      detail: "Thêm mới, chỉnh sửa các quy định phạt",
      linkNavigate: "configuration/punish",
    },
    {
      title: "Cấu hình thưởng",
      detail: "Thêm mới, chỉnh sửa các quy định thưởng",
      linkNavigate: "configuration/reward",
    },
  ];

  const handleOpenNewTab = (link) => {
    const url = `${window.location.origin}/${link}`;
    window.open(url, "_blank");
  };
  
  return (
    <div className="manage-report-cash-book">
      {listNewConfiguration?.map((item, index) => (
        <div key={index} className="manage-report-cash-book__child card-shadow">
          <div className="manage-report-cash-book__child--circle"></div>
          <div
            onClick={() => handleOpenNewTab(item.linkNavigate)}
            className="manage-report-cash-book__child--detail"
          >
            <span>Chi tiết</span>
          </div>
          <div className="manage-report-cash-book__child--numbered">
            <span>{index + 1}</span>
          </div>
          <div className="manage-report-cash-book__child--title">
            <span className="manage-report-cash-book__child--title-header">
              {item?.title}
            </span>
            <span className="manage-report-cash-book__child--title-sub-header">
              {item?.detail}
            </span>
          </div>
        </div>
      ))}
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
    title: "Cấu hình nhóm khuyến mãi",
    value: "group_promotion",
    role: "get_group_promotion_setting",
  },
  {
    id: 13,
    title: "Cấu hình đối tác kinh doanh",
    value: "business_config",
    role: "get_business_setting",
  },
  {
    id: 14,
    title: "Quản lý hình ảnh",
    value: "image_manager",
    role: "get_file_manager",
  },
];
