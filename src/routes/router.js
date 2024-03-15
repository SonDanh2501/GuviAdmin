import Home from "../container/System/Dashboard/DashBoard";
import ManageOrder from "../container/System/ManageOrder";
import ManageCustomer from "../container/System/ManageCustomer";
import ManageCollaborator from "../container/System/ManageUser/Collaborator";
import EditPriceService from "../container/System/ManageService/EditPriceService";
import ManageSetting from "../container/System/ManageSetting";
import ManageFeedback from "../container/System/ManageFeedback";
import ManageFinance from "../container/System/ManageFinance";
import ManageTopup from "../container/System/ManageTopup";
import ManageReport from "../container/System/ManageReport";
import ManagePushNotification from "../container/System/ManagePushNotification";
import home from "../assets/images/home.svg";
import bag from "../assets/images/bag.svg";
import request from "../assets/images/request.svg";
import customer from "../assets/images/2user.svg";
import collaborator from "../assets/images/collaborator.svg";
import service from "../assets/images/service.svg";
import ticket from "../assets/images/ticket.svg";
import like from "../assets/images/like.svg";
import finance from "../assets/images/finance.svg";
import cards from "../assets/images/cards.svg";
import document from "../assets/images/document.svg";
import notification from "../assets/images/notification.svg";
import setting from "../assets/images/setting.svg";
import ManageConfiguration from "../container/System/ManageConfiguration/ManageConfiguration";
import ManageRequestService from "../container/System/ManageRequestService";

import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

// const router = [
//   {
//     path: "/",
//     name: "dasboard",
//     icon: home,
//     component: Home,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "dashboard",
//   },
//   {
//     path: "/group-order/manage-order",
//     name: "GUVIJOBS",
//     icon: bag,
//     component: ManageOrder,
//     layout: "job",
//     tab: [
//       // {
//       //   path: "/group-order/manage-order/all",
//       //   name: "Tất cả",
//       //   icon: bag,
//       //   role: "all",
//       // },
//       // {
//       //   path: "/group-order/manage-order/doing",
//       //   name: "Chưa hoàn tất",
//       //   icon: bag,
//       //   role: "all",
//       // },
//       // {
//       //   path: "/group-order/manage-order/done",
//       //   name: "Hết hạn",
//       //   icon: bag,
//       //   role: "all",
//       // },
//     ],
//     id_sidebar: "guvi_job",
//   },
//   {
//     path: "/system/request-service-manage",
//     name: "service_request",
//     icon: request,
//     component: ManageRequestService,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "request_service",
//   },
//   {
//     path: "/system/user-manage",
//     name: "customer",
//     icon: customer,
//     component: ManageCustomer,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "customer",
//   },
//   {
//     path: "/system/collaborator-manage",
//     name: "collaborator",
//     icon: collaborator,
//     component: ManageCollaborator,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "collaborator",
//   },
//   {
//     path: "/services/manage-group-service/service",
//     name: "service",
//     icon: service,
//     component: EditPriceService,
//     layout: "admin",
//     tab: [
//       // {
//       //   path: "/services/manage-group-service/service",
//       //   name: "Tất cả",
//       //   icon: bag,
//       // },
//       // {
//       //   path: "/services/manage-group-service/group-service",
//       //   name: "Nhóm dịch vụ",
//       //   icon: bag,
//       // },
//     ],
//     id_sidebar: "service",
//   },
//   {
//     path: "/promotion/manage-setting",
//     name: "promotion",
//     icon: ticket,
//     component: ManageSetting,
//     layout: "promotion",
//     tab: [
//       {
//         path: "/promotion/manage-setting/promotion",
//         name: "Khuyến mãi",
//         role: "promotion",
//         icon: ticket,
//       },
//       {
//         path: "/promotion/manage-setting/banner",
//         name: "Banner",
//         role: "get_banner",
//         icon: ticket,
//       },
//       {
//         path: "/promotion/manage-setting/news",
//         name: "Bài viết",
//         role: "get_news",
//         icon: ticket,
//       },
//     ],
//     id_sidebar: "promotion",
//   },
//   {
//     path: "/feedback/manage-feedback",
//     name: "CSKH",
//     icon: like,
//     // component: ManageFeedback,
//     layout: "CSKH",
//     tab: [
//       {
//         path: "/customer-care/review-collaborator",
//         name: "Đánh giá CTV",
//         // role: "customer_care",
//         icon: ticket,
//       },
//       {
//         path: "/customer-care/feedback",
//         name: "Phản hồi",
//         // role: "customer_care",
//         icon: ticket,
//       }
//     ],
//     id_sidebar: "promotion",
//   },
//   {
//     path: "/finance/manage-finance",
//     name: "finance",
//     icon: finance,
//     component: ManageFinance,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "finance",
//   },
//   {
//     path: "/topup/manage-topup",
//     name: "Sổ quỹ",
//     icon: cards,
//     component: ManageTopup,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "cash_book",
//   },
//   {
//     path: "/report/manage-report",
//     name: "report",
//     icon: document,
//     component: ManageReport,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "report",
//   },
//   {
//     path: "/notification/manage-push-notification",
//     name: "notification",
//     icon: notification,
//     component: ManagePushNotification,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "notification",
//   },
//   {
//     path: "/adminManage/manage-configuration",
//     name: "setting",
//     icon: setting,
//     component: ManageConfiguration,
//     layout: "admin",
//     tab: [],
//     id_sidebar: "setting",
//   },

//   // {
//   //   role: "marketing_manager",
//   //   side: [
//   //     {
//   //       path: "/",
//   //       name: "Tổng quan",
//   //       icon: home,
//   //       component: Home,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/group-order/manage-order",
//   //       name: "GUVIJOBS",
//   //       icon: bag,
//   //       component: ManageOrder,
//   //       layout: "admin",
//   //       tab: [
//   //         {
//   //           path: "/group-order/manage-order/all",
//   //           name: "Tất cả công việc",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/doing",
//   //           name: "Dịch vụ chưa hoàn tất",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/done",
//   //           name: " Dịch vụ hết hạn",
//   //           icon: bag,
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       path: "/system/user-manage",
//   //       name: "Khách hàng",
//   //       icon: customer,
//   //       component: ManageCustomer,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/promotion/manage-setting",
//   //       name: "Khuyến mãi",
//   //       icon: ticket,
//   //       component: ManageSetting,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/feedback/manage-feedback",
//   //       name: "CSKH",
//   //       icon: like,
//   //       component: ManageFeedback,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/report/manage-report",
//   //       name: "Báo cáo",
//   //       icon: document,
//   //       component: ManageReport,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/notification/manage-push-notification",
//   //       name: "Thông báo",
//   //       icon: notification,
//   //       component: ManagePushNotification,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //   ],
//   // },
//   // {
//   //   role: "marketing",
//   //   side: [
//   //     {
//   //       path: "/",
//   //       name: "Tổng quan",
//   //       icon: home,
//   //       component: Home,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/group-order/manage-order",
//   //       name: "GUVIJOBS",
//   //       icon: bag,
//   //       component: ManageOrder,
//   //       layout: "admin",
//   //       tab: [
//   //         {
//   //           path: "/group-order/manage-order/all",
//   //           name: "Tất cả công việc",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/doing",
//   //           name: "Dịch vụ chưa hoàn tất",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/done",
//   //           name: " Dịch vụ hết hạn",
//   //           icon: bag,
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       path: "/system/user-manage",
//   //       name: "Khách hàng",
//   //       icon: customer,
//   //       component: ManageCustomer,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/promotion/manage-setting",
//   //       name: "Khuyến mãi",
//   //       icon: ticket,
//   //       component: ManageSetting,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/feedback/manage-feedback",
//   //       name: "CSKH",
//   //       icon: like,
//   //       component: ManageFeedback,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/report/manage-report",
//   //       name: "Báo cáo",
//   //       icon: document,
//   //       component: ManageReport,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/notification/manage-push-notification",
//   //       name: "Thông báo",
//   //       icon: notification,
//   //       component: ManagePushNotification,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //   ],
//   // },
//   // {
//   //   role: "support_customer",
//   //   side: [
//   //     {
//   //       path: "/group-order/manage-order",
//   //       name: "GUVIJOBS",
//   //       icon: bag,
//   //       component: ManageOrder,
//   //       layout: "admin",
//   //       tab: [
//   //         {
//   //           path: "/group-order/manage-order/all",
//   //           name: "Tất cả công việc",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/doing",
//   //           name: "Dịch vụ chưa hoàn tất",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/done",
//   //           name: " Dịch vụ hết hạn",
//   //           icon: bag,
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       path: "/system/deep-cleaning",
//   //       name: "Yêu cầu dịch vụ",
//   //       icon: request,
//   //       component: ManageOrder,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/system/user-manage",
//   //       name: "Khách hàng",
//   //       icon: customer,
//   //       component: ManageCustomer,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/feedback/manage-feedback",
//   //       name: "CSKH",
//   //       icon: like,
//   //       component: ManageFeedback,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //   ],
//   // },
//   // {
//   //   role: "support",
//   //   side: [
//   //     {
//   //       path: "/group-order/manage-order",
//   //       name: "GUVIJOBS",
//   //       icon: bag,
//   //       component: ManageOrder,
//   //       layout: "admin",
//   //       tab: [
//   //         {
//   //           path: "/group-order/manage-order/all",
//   //           name: "Tất cả công việc",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/doing",
//   //           name: "Dịch vụ chưa hoàn tất",
//   //           icon: bag,
//   //         },
//   //         {
//   //           path: "/group-order/manage-order/done",
//   //           name: " Dịch vụ hết hạn",
//   //           icon: bag,
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       path: "/system/deep-cleaning",
//   //       name: "Yêu cầu dịch vụ",
//   //       icon: request,
//   //       component: ManageOrder,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/system/user-manage",
//   //       name: "Khách hàng",
//   //       icon: customer,
//   //       component: ManageCustomer,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/system/collaborator-manage",
//   //       name: "Cộng tác viên",
//   //       icon: collaborator,
//   //       component: ManageCollaborator,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/feedback/manage-feedback",
//   //       name: "CSKH",
//   //       icon: like,
//   //       component: ManageFeedback,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/finance/manage-finance",
//   //       name: "Tài chính",
//   //       icon: finance,
//   //       component: ManageFinance,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/topup/manage-topup",
//   //       name: "Sổ quỹ",
//   //       icon: cards,
//   //       component: ManageTopup,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/report/manage-report",
//   //       name: "Báo cáo",
//   //       icon: document,
//   //       component: ManageReport,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //   ],
//   // },
//   // {
//   //   role: "accountant",
//   //   side: [
//   //     {
//   //       path: "/topup/manage-topup",
//   //       name: "Sổ quỹ",
//   //       icon: cards,
//   //       component: ManageTopup,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //     {
//   //       path: "/report/manage-report",
//   //       name: "Báo cáo",
//   //       icon: document,
//   //       component: ManageReport,
//   //       layout: "admin",
//   //       tab: [],
//   //     },
//   //   ],
//   // },
// ];
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const IconCustom = ({ icon }) => {
  return (
    <span className="anticon anticon-desktop ant-menu-item-icon">
      <embed style={{ padding: "50% 0" }} src={icon} />
    </span>
  );
};

const router = [
  getItem("Tổng quan", "/", <IconCustom icon={home} />, null, "dashboard"),
  getItem(
    "GUVIJOBS",
    "/group-order/manage-order",
    <IconCustom icon={bag} />,
    null,
    "guvi_job"
  ),
  getItem(
    "Yêu cầu dịch vụ",
    "/system/request-service-manage",
    <IconCustom icon={request} />,
    null,
    "request_service"
  ),
  getItem(
    "Khách hàng",
    "/system/user-manage",
    <IconCustom icon={customer} />,
    null,
    "customer"
  ),
  // getItem('Cộng tác viên', '/system/collaborator-manage', <IconCustom icon={collaborator} />, null, "collaborator"),

  getItem(
    "Cộng tác viên",
    "/system/collaborator-manage",
    <IconCustom icon={collaborator} />,
    [
      getItem(
        "Đang hoạt động",
        "/system/collaborator-verify-manage",
        null,
        null
      ),
      "collaborator",
      getItem(
        "Hồ sơ ứng tuyển",
        "/system/collaborator-not-verify-manage",
        null,
        null
      ),
      "collaborator",
    ],
    "collaborator"
  ),

  getItem(
    "Dịch vụ",
    "/services/manage-group-service/service",
    <IconCustom icon={service} />,
    null,
    "service"
  ),
  getItem(
    "Marketing",
    "sub1",
    <IconCustom icon={ticket} />,
    [
      getItem("Khuyến mãi", "/promotion/manage-setting", null, null),
      "promotion",
      getItem(
        "Banner",
        "/promotion/manage-setting/banner",
        null,
        null,
        "promotion"
      ),
      getItem(
        "Bài viết",
        "/promotion/manage-setting/news",
        null,
        null,
        "promotion"
      ),
    ],
    "promotion"
  ),
  getItem(
    "CSKH",
    "/feedback/manage-feedback",
    <IconCustom icon={like} />,
    [
      getItem(
        "Đánh giá CTV",
        "/customer-care/review-collaborator",
        null,
        null,
        "support_customer"
      ),
      getItem(
        "Phản hồi",
        "/customer-care/feedback",
        null,
        null,
        "support_customer"
      ),
      getItem(
        "Thưởng",
        "/reward/manage-reward",
        null,
        null,
        "/support_customer"
      ),
      getItem("Phạt", "/punish/manage-punish", null, null, "support_customer"),
    ],
    "support_customer"
  ),
  getItem(
    "Tài chính",
    "/finance/manage-finance",
    <IconCustom icon={finance} />,
    null,
    "finance"
  ),
  getItem(
    "Sổ quỹ",
    "transaction",
    <IconCustom icon={cards} />,
    [
      getItem(
        "CTV",
        "/transaction/manage-transaction-collaborator",
        null,
        null
      ),
      "cash_book",
      getItem(
        "Khách hàng",
        "/transaction/manage-transaction-customer",
        null,
        null
      ),
      "cash_book",
      getItem("Nhân viên", "/transaction/manage-transaction-staff", null, null),
      "cash_book",
    ],
    "cash_book"
  ),
  getItem(
    "Báo cáo",
    "/report/manage-report",
    <IconCustom icon={document} />,
    null,
    "report"
  ),
  getItem(
    "Thông báo",
    "/notification/manage-push-notification",
    <IconCustom icon={notification} />,
    null,
    "notification"
  ),
  getItem(
    "Cấu hình",
    "/adminManage/manage-configuration",
    <IconCustom icon={setting} />,
    null,
    "setting"
  ),
];

export default router;
