import Home from "../container/System/Dashboard/DashBoard";
import ManageOrder from "../container/System/ManageOrder";
import ManageCustomer from "../container/System/ManageUser/Customer";
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

const router = [
  {
    path: "/",
    name: "dasboard",
    icon: home,
    component: Home,
    layout: "admin",
    tab: [],
    id_sidebar: "dashboard",
  },
  {
    path: "/group-order/manage-order",
    name: "GUVIJOBS",
    icon: bag,
    component: ManageOrder,
    layout: "job",
    tab: [
      {
        path: "/group-order/manage-order/all",
        name: "Tất cả",
        icon: bag,
      },
      {
        path: "/group-order/manage-order/doing",
        name: "Chưa hoàn tất",
        icon: bag,
      },
      {
        path: "/group-order/manage-order/done",
        name: "Hết hạn",
        icon: bag,
      },
    ],
    id_sidebar: "guvi_job",
  },
  {
    path: "/system/deep-cleaning",
    name: "service_request",
    icon: request,
    component: ManageOrder,
    layout: "admin",
    tab: [],
    id_sidebar: "request_service",
  },
  {
    path: "/system/user-manage",
    name: "customer",
    icon: customer,
    component: ManageCustomer,
    layout: "admin",
    tab: [],
    id_sidebar: "customer",
  },
  {
    path: "/system/collaborator-manage",
    name: "collaborator",
    icon: collaborator,
    component: ManageCollaborator,
    layout: "admin",
    tab: [],
    id_sidebar: "collaborator",
  },
  {
    path: "/services/manage-group-service/service",
    name: "service",
    icon: service,
    component: EditPriceService,
    layout: "group",
    tab: [
      {
        path: "/services/manage-group-service/service",
        name: "Tất cả",
        icon: bag,
      },
      // {
      //   path: "/services/manage-group-service/group-service",
      //   name: "Nhóm dịch vụ",
      //   icon: bag,
      // },
    ],
    id_sidebar: "service",
  },
  {
    path: "/promotion/manage-setting",
    name: "promotion",
    icon: ticket,
    component: ManageSetting,
    layout: "promotion",
    tab: [
      {
        path: "/promotion/manage-setting/promotion",
        name: "Khuyến mãi",
        icon: bag,
      },
      {
        path: "/promotion/manage-setting/banner",
        name: "Banner",
        icon: bag,
      },
      {
        path: "/promotion/manage-setting/news",
        name: "Bài viết",
        icon: bag,
      },
    ],
    id_sidebar: "promotion",
  },
  {
    path: "/feedback/manage-feedback",
    name: "CSKH",
    icon: like,
    component: ManageFeedback,
    layout: "admin",
    tab: [],
    id_sidebar: "support_customer",
  },
  {
    path: "/finance/manage-finance",
    name: "finance",
    icon: finance,
    component: ManageFinance,
    layout: "admin",
    tab: [],
    id_sidebar: "cash_book",
  },
  {
    path: "/topup/manage-topup",
    name: "Sổ quỹ",
    icon: cards,
    component: ManageTopup,
    layout: "admin",
    tab: [],
    id_sidebar: "cash_book",
  },
  {
    path: "/report/manage-report",
    name: "report",
    icon: document,
    component: ManageReport,
    layout: "admin",
    tab: [],
    id_sidebar: "report",
  },
  {
    path: "/notification/manage-push-notification",
    name: "notification",
    icon: notification,
    component: ManagePushNotification,
    layout: "admin",
    tab: [],
    id_sidebar: "notification",
  },
  {
    path: "/adminManage/manage-configuration",
    name: "setting",
    icon: setting,
    component: ManageConfiguration,
    layout: "admin",
    tab: [],
    id_sidebar: "setting",
  },

  // {
  //   role: "marketing_manager",
  //   side: [
  //     {
  //       path: "/",
  //       name: "Tổng quan",
  //       icon: home,
  //       component: Home,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/group-order/manage-order",
  //       name: "GUVIJOBS",
  //       icon: bag,
  //       component: ManageOrder,
  //       layout: "admin",
  //       tab: [
  //         {
  //           path: "/group-order/manage-order/all",
  //           name: "Tất cả công việc",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/doing",
  //           name: "Dịch vụ chưa hoàn tất",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/done",
  //           name: " Dịch vụ hết hạn",
  //           icon: bag,
  //         },
  //       ],
  //     },
  //     {
  //       path: "/system/user-manage",
  //       name: "Khách hàng",
  //       icon: customer,
  //       component: ManageCustomer,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/promotion/manage-setting",
  //       name: "Khuyến mãi",
  //       icon: ticket,
  //       component: ManageSetting,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/feedback/manage-feedback",
  //       name: "CSKH",
  //       icon: like,
  //       component: ManageFeedback,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/report/manage-report",
  //       name: "Báo cáo",
  //       icon: document,
  //       component: ManageReport,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/notification/manage-push-notification",
  //       name: "Thông báo",
  //       icon: notification,
  //       component: ManagePushNotification,
  //       layout: "admin",
  //       tab: [],
  //     },
  //   ],
  // },
  // {
  //   role: "marketing",
  //   side: [
  //     {
  //       path: "/",
  //       name: "Tổng quan",
  //       icon: home,
  //       component: Home,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/group-order/manage-order",
  //       name: "GUVIJOBS",
  //       icon: bag,
  //       component: ManageOrder,
  //       layout: "admin",
  //       tab: [
  //         {
  //           path: "/group-order/manage-order/all",
  //           name: "Tất cả công việc",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/doing",
  //           name: "Dịch vụ chưa hoàn tất",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/done",
  //           name: " Dịch vụ hết hạn",
  //           icon: bag,
  //         },
  //       ],
  //     },
  //     {
  //       path: "/system/user-manage",
  //       name: "Khách hàng",
  //       icon: customer,
  //       component: ManageCustomer,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/promotion/manage-setting",
  //       name: "Khuyến mãi",
  //       icon: ticket,
  //       component: ManageSetting,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/feedback/manage-feedback",
  //       name: "CSKH",
  //       icon: like,
  //       component: ManageFeedback,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/report/manage-report",
  //       name: "Báo cáo",
  //       icon: document,
  //       component: ManageReport,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/notification/manage-push-notification",
  //       name: "Thông báo",
  //       icon: notification,
  //       component: ManagePushNotification,
  //       layout: "admin",
  //       tab: [],
  //     },
  //   ],
  // },
  // {
  //   role: "support_customer",
  //   side: [
  //     {
  //       path: "/group-order/manage-order",
  //       name: "GUVIJOBS",
  //       icon: bag,
  //       component: ManageOrder,
  //       layout: "admin",
  //       tab: [
  //         {
  //           path: "/group-order/manage-order/all",
  //           name: "Tất cả công việc",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/doing",
  //           name: "Dịch vụ chưa hoàn tất",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/done",
  //           name: " Dịch vụ hết hạn",
  //           icon: bag,
  //         },
  //       ],
  //     },
  //     {
  //       path: "/system/deep-cleaning",
  //       name: "Yêu cầu dịch vụ",
  //       icon: request,
  //       component: ManageOrder,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/system/user-manage",
  //       name: "Khách hàng",
  //       icon: customer,
  //       component: ManageCustomer,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/feedback/manage-feedback",
  //       name: "CSKH",
  //       icon: like,
  //       component: ManageFeedback,
  //       layout: "admin",
  //       tab: [],
  //     },
  //   ],
  // },
  // {
  //   role: "support",
  //   side: [
  //     {
  //       path: "/group-order/manage-order",
  //       name: "GUVIJOBS",
  //       icon: bag,
  //       component: ManageOrder,
  //       layout: "admin",
  //       tab: [
  //         {
  //           path: "/group-order/manage-order/all",
  //           name: "Tất cả công việc",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/doing",
  //           name: "Dịch vụ chưa hoàn tất",
  //           icon: bag,
  //         },
  //         {
  //           path: "/group-order/manage-order/done",
  //           name: " Dịch vụ hết hạn",
  //           icon: bag,
  //         },
  //       ],
  //     },
  //     {
  //       path: "/system/deep-cleaning",
  //       name: "Yêu cầu dịch vụ",
  //       icon: request,
  //       component: ManageOrder,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/system/user-manage",
  //       name: "Khách hàng",
  //       icon: customer,
  //       component: ManageCustomer,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/system/collaborator-manage",
  //       name: "Cộng tác viên",
  //       icon: collaborator,
  //       component: ManageCollaborator,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/feedback/manage-feedback",
  //       name: "CSKH",
  //       icon: like,
  //       component: ManageFeedback,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/finance/manage-finance",
  //       name: "Tài chính",
  //       icon: finance,
  //       component: ManageFinance,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/topup/manage-topup",
  //       name: "Sổ quỹ",
  //       icon: cards,
  //       component: ManageTopup,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/report/manage-report",
  //       name: "Báo cáo",
  //       icon: document,
  //       component: ManageReport,
  //       layout: "admin",
  //       tab: [],
  //     },
  //   ],
  // },
  // {
  //   role: "accountant",
  //   side: [
  //     {
  //       path: "/topup/manage-topup",
  //       name: "Sổ quỹ",
  //       icon: cards,
  //       component: ManageTopup,
  //       layout: "admin",
  //       tab: [],
  //     },
  //     {
  //       path: "/report/manage-report",
  //       name: "Báo cáo",
  //       icon: document,
  //       component: ManageReport,
  //       layout: "admin",
  //       tab: [],
  //     },
  //   ],
  // },
];

export default router;
