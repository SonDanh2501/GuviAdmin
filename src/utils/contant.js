export const INIT_STATE = {
  customers: {
    data: [],
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
  },
  news: {
    data: [],
  },
  reasons: {
    data: [],
  },
  auth: {
    token: "",
    isCheckLogin: false,
    user: {},
  },
  service: {
    groupService: [],
    services: [],
  },
  brand: {
    title: "Trang chủ",
  },
  feedback: {
    data: [],
  },
};

export const path = {
  HOME: "/",
  HOMEPAGE: "/home",
  LOGIN: "/login",
  LOG_OUT: "/logout",
  SYSTEM: "/system",
};
