export const INIT_STATE = {
  customers: {
    data: [],
    totalItem: 0,
    groupCustomer: [],
    totalGroupCustomer: 0,
  },
  collaborators: {
    data: [],
    totalItem: 0,
  },
  promotions: {
    data: [],
    totalItem: 0,
  },
  banners: {
    data: [],
    totalItem: 0,
  },
  news: {
    data: [],
    totalItem: 0,
  },
  reasons: {
    data: [],
  },
  auth: {
    token: "",
    isCheckLogin: false,
    user: {},
    permission: [],
    checkElement: [],
  },
  service: {
    groupService: [],
    groupServiceTotal: 0,
    services: [],
  },
  brand: {
    title: "Trang chủ",
  },
  feedback: {
    data: [],
    totalItem: 0,
  },
  loading: {
    loading: false,
  },
  order: {
    data: [],
    totalItem: 0,
    dataSearch: [],
    totalDataSearch: 0,
  },
  topup: {
    data: [],
    totalItem: 0,
    dataCustomer: [],
    totalItemCustomer: 0,
    revenue: 0,
    expenditure: 0,
  },
  statistic: {
    historyActivity: [],
    lastestService: [],
    activeUser: [],
    serviceConnect: [],
    topCollaborator: [],
    totalTopCollaborator: 0,
  },
  notification: {
    data: [],
    totalItem: 0,
  },
};

export const path = {
  HOME: "/",
  HOMEPAGE: "/home",
  LOGIN: "/login",
  LOG_OUT: "/logout",
  SYSTEM: "/system",
};
