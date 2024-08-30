import icons from "./icons";
// Bank list
import MB_BANK from "../assets/images/bank_mb.svg";
import VIETCOM_BANK from "../assets/images/bank_vietcom.svg";
import VIETIN_BANK from "../assets/images/bank_vietin.svg";
import TECHCOM_BANK from "../assets/images/bank_techcom.svg";
import ARGI_BANK from "../assets/images/bank_agri.svg";
import BIDV_BANK from "../assets/images/bank_bidv.svg";
import SACOM_BANK from "../assets/images/bank_sacombank.svg";
import ACB_BANK from "../assets/images/bank_acb.svg";
import VP_BANK from "../assets/images/bank_vp.svg";
import TP_BANK from "../assets/images/bank_tp.svg";
import VIB_BANK from "../assets/images/bank_vib.svg";
import SHB_BANK from "../assets/images/bank_shb.svg";
// Flag list
import VN_FLAG from "../assets/images/flag_vn.svg";
import US_FLAG from "../assets/images/flag_us.svg";

const { IoStar, IoStarHalf, IoStarOutline } = icons;

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

// Danh sách ngân hàng
export const bankList = [
  {
    value: "vietcom_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={VIETCOM_BANK}></img>
        <span className="text-sm font-normal">Vietcombank</span>
      </div>
    ),
    image: VIETCOM_BANK,
    name: "Ngân hàng Thương mại cổ phần Ngoại thương Việt Nam",
  },
  {
    value: "mb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={MB_BANK}></img>
        <span className="text-sm font-normal">MBBank</span>
      </div>
    ),
    image: MB_BANK,
    name: "Ngân hàng Quân đội",
  },
  {
    value: "vietin_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={VIETIN_BANK}></img>
        <span className="text-sm font-normal">Vietinbank</span>
      </div>
    ),
    image: VIETIN_BANK,
    name: "Ngân hàng Thương mại cổ phần Công Thương Việt Nam",
  },
  {
    value: "techcom_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={TECHCOM_BANK}></img>
        <span className="text-sm font-normal">Techcombank</span>
      </div>
    ),
    image: TECHCOM_BANK,
    name: "Ngân hàng Thương mại cổ phần Kỹ Thương Việt Nam",
  },
  {
    value: "agri_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={ARGI_BANK}></img>
        <span className="text-sm font-normal">Agribank</span>
      </div>
    ),
    image: ARGI_BANK,
    name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
  },
  {
    value: "bidv_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={BIDV_BANK}></img>
        <span className="text-sm font-normal">BIDV</span>
      </div>
    ),
    image: BIDV_BANK,
    name: "Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam",
  },
  {
    value: "sacom_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={SACOM_BANK}></img>
        <span className="text-sm font-normal">Sacombank</span>
      </div>
    ),
    image: SACOM_BANK,
    name: "Ngân hàng Thương mại cổ phần Sài Gòn Thương Tín",
  },
  {
    value: "acb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={ACB_BANK}></img>
        <span className="text-sm font-normal">ACB</span>
      </div>
    ),
    image: ACB_BANK,
    name: "Ngân hàng Thương mại cổ phần Á Châu",
  },
  {
    value: "vp_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={VP_BANK}></img>
        <span className="text-sm font-normal">VPBank</span>
      </div>
    ),
    image: VP_BANK,
    name: "Ngân hàng Thương mại cổ phần Việt Nam Thịnh Vượng",
  },
  {
    value: "tp_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={TP_BANK}></img>
        <span className="text-sm font-normal">TPBank</span>
      </div>
    ),
    image: TP_BANK,
    name: "Ngân hàng Thương mại cổ phần Tiên Phong",
  },
  {
    value: "vib_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={VIB_BANK}></img>
        <span className="text-sm font-normal">VIB</span>
      </div>
    ),
    image: VIB_BANK,
    name: "Ngân hàng Thương mại cổ phần Quốc tế Việt Nam",
  },
  {
    value: "shb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        {/* <IoStar /> */}
        <img className="w-full h-6" src={SHB_BANK}></img>
        <span className="text-sm font-normal">SHB</span>
      </div>
    ),
    image: SHB_BANK,
    name: "Ngân hàng Thương mại cổ phần Sài Gòn-Hà Nội",
  },
];

// Danh sách các nước
export const countryList = [
  {
    value: "vn",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-6" src={VN_FLAG}></img>
        </div>
        <div>
          <span className="text-sm font-normal">Việt Nam</span>
        </div>
      </div>
    ),
    image: VN_FLAG,
    name: "Việt Nam",
  },
  {
    value: "us",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-6" src={US_FLAG}></img>
        </div>
        <div>
          <span className="text-sm font-normal">Mỹ</span>
        </div>
      </div>
    ),
    image: US_FLAG,
    name: "Mỹ",
  },
];

// Nên đưa vào redux để sau này gọi ở chỗ khác (các trường hợp cần filter)
// Danh sách các kỹ năng của cộng tác viên
export const listSkills = [
  { value: 1, label: "Vệ sinh nhà cửa" },
  { value: 2, label: "Giúp việc nhà" },
  { value: 3, label: "Nấu ăn" },
  { value: 4, label: "Chăm em bé" },
];
// Danh sách các ngôn ngữ
export const listLanguages = [
  { value: 1, label: "Tiếng Anh" },
  { value: 2, label: "Tiếng Hàn" },
  { value: 3, label: "Tiếng Trung" },
];
// Hàm render sao từ giá trị đánh giá (number) truyền vào
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
      stars.push(
        <IoStar key={i} color={color || "orange"} size={size || 16} />
      );
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

// Hàm tính phần trăm của giá trị con (child) trên tổng (total)
export const calculateNumberPercent = (total, child) => {
  let percent = (child / total) * 100;
  return percent ? Math.round((percent + Number.EPSILON) * 100) / 100 : 0;
};

// Hàm dời phần từ trong mảng (array) từ vị trí hiện tại thành vị trí truyền vào (position)
// conditionFind là điều kiện để tìm ra phần tử cần đổi vị trí trong mảng array
export const moveElement = (array, position, conditionFind) => {
  let newArray = [...array]; // Temp array
  const index = newArray.findIndex(conditionFind); // Check if having data or not
  if (index !== -1) {
    const [element] = newArray.splice(index, 1); // Get the element
    newArray.splice(position, 0, element); // Insert into array
    return newArray;
  }
};
