import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

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
    language: "vi",
  },
  service: {
    groupService: [],
    groupServiceTotal: 0,
    services: [],
    province: [],
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

export const renderStarFromNumber = (number, color, size) => {
  const integerPart = Math.floor(number);
  const decimalPart = number - integerPart;
  const stars = [];
  if (!Number(number)) {
    for (let i = 0; i < 5; i++) {
      stars.push(<IoStarOutline key={i} size={size || 16} />);
    }
    return stars;
  }

  for (let i = 0; i < 5; i++) {
    if (i < integerPart) {
      stars.push(<IoStar key={i} color={color || "orange"} size={size || 16} />);
    } else if (i === integerPart && decimalPart > 0) {
      // In ra ngôi sao có phần thập phân
      stars.push(
        <IoStarHalf key={i} color={color || "orange"} size={size || 16} />
      );
    } else {
      stars.push(
        <IoStarOutline key={i} color={color || "orange"} size={size || 16} />
      );
    }
  }
  return stars;
};

export const calculateNumberPercent = (total, child) => {
  let percent = (child / total) * 100;
  return percent ? Math.round((percent + Number.EPSILON) * 100) / 100 : 0;
};