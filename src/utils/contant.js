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
  },
  service: {
    groupService: [],
  },
  brand: {
    title: "",
  },
};

export const path = {
  HOME: "/",
  HOMEPAGE: "/home",
  LOGIN: "/login",
  LOG_OUT: "/logout",
  SYSTEM: "/system",
};
