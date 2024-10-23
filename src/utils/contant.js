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
import CB_BANK from "../assets/images/bank_cb.svg";
import OCEAN_BANK from "../assets/images/bank_ocean.svg";
import HD_BANK from "../assets/images/bank_hd.svg";
import PVC_BANK from "../assets/images/bank_pvc.svg";
// Flag list
import CHINA_FLAG from "../assets/images/flag_china.svg";
import VIETNAM_FLAG from "../assets/images/flag_vietnam.svg";
import AMERICAN_FLAG from "../assets/images/flag_american.svg";
import BRUNEI_FLAG from "../assets/images/flag_brunei.svg";
import INDONESIA_FLAG from "../assets/images/flag_indonesia.svg";
import LAOS_FLAG from "../assets/images/flag_laos.svg";
import MALAYSIA_FLAG from "../assets/images/flag_malaysia.svg";
import PHILIPPINES_FLAG from "../assets/images/flag_philippines.svg";
import SINGAPO_FLAG from "../assets/images/flag_singapo.svg";
import THAILAND_FLAG from "../assets/images/flag_thailand.svg";
import TIMOR_FLAG from "../assets/images/flag_timor.svg";
import moment from "moment";

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



/* ~~~ List ~~~ */
/* 1. Danh sách ngân hàng */
export const bankList = [
  {
    code: "vietcom_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={VIETCOM_BANK}></img>
        <span className="text-xs font-normal">Vietcombank</span>
      </div>
    ),
    image: VIETCOM_BANK,
    name: "Ngân hàng Thương mại cổ phần Ngoại thương Việt Nam (VIETCOMBANK)",
  },
  {
    code: "mb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={MB_BANK}></img>
        <span className="text-xs font-normal">MBBank</span>
      </div>
    ),
    image: MB_BANK,
    name: "Ngân hàng Quân đội (MBBank)",
  },
  {
    code: "vietin_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={VIETIN_BANK}></img>
        <span className="text-xs font-normal">Vietinbank</span>
      </div>
    ),
    image: VIETIN_BANK,
    name: "Ngân hàng Thương mại cổ phần Công Thương Việt Nam (VIETINBANK)",
  },
  {
    code: "techcom_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={TECHCOM_BANK}></img>
        <span className="text-xs font-normal">Techcombank</span>
      </div>
    ),
    image: TECHCOM_BANK,
    name: "Ngân hàng Thương mại cổ phần Kỹ Thương Việt Nam (TECHCOMBANK)",
  },
  {
    code: "agri_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={ARGI_BANK}></img>
        <span className="text-xs font-normal">Agribank</span>
      </div>
    ),
    image: ARGI_BANK,
    name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (AGRIBANK)",
  },
  {
    code: "bidv_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={BIDV_BANK}></img>
        <span className="text-xs font-normal">BIDV</span>
      </div>
    ),
    image: BIDV_BANK,
    name: "Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam (BIDV)",
  },
  {
    code: "sacom_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={SACOM_BANK}></img>
        <span className="text-xs font-normal">Sacombank</span>
      </div>
    ),
    image: SACOM_BANK,
    name: "Ngân hàng Thương mại cổ phần Sài Gòn Thương Tín (SACOMBANK)",
  },
  {
    code: "acb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={ACB_BANK}></img>
        <span className="text-xs font-normal">ACB</span>
      </div>
    ),
    image: ACB_BANK,
    name: "Ngân hàng Thương mại cổ phần Á Châu (ACB)",
  },
  {
    code: "vp_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={VP_BANK}></img>
        <span className="text-xs font-normal">VPBank</span>
      </div>
    ),
    image: VP_BANK,
    name: "Ngân hàng Thương mại cổ phần Việt Nam Thịnh Vượng (VPBANK)",
  },
  {
    code: "tp_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={TP_BANK}></img>
        <span className="text-xs font-normal">TPBank</span>
      </div>
    ),
    image: TP_BANK,
    name: "Ngân hàng Thương mại cổ phần Tiên Phong (TPBANK)",
  },
  {
    code: "vib_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={VIB_BANK}></img>
        <span className="text-xs font-normal">VIB</span>
      </div>
    ),
    image: VIB_BANK,
    name: "Ngân hàng Thương mại cổ phần Quốc tế Việt Nam (VIB)",
  },
  {
    code: "shb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={SHB_BANK}></img>
        <span className="text-xs font-normal">SHB</span>
      </div>
    ),
    image: SHB_BANK,
    name: "Ngân hàng Thương mại cổ phần Sài Gòn-Hà Nội (SHB)",
  },
  {
    code: "pvc_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={PVC_BANK}></img>
        <span className="text-xs font-normal">PVCOMB</span>
      </div>
    ),
    image: PVC_BANK,
    name: "Ngân hàng TMCP Đại Chúng Việt Nam (PVCOMBANK)",
  },
  {
    code: "ocean_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={OCEAN_BANK}></img>
        <span className="text-xs font-normal">OCEANB</span>
      </div>
    ),
    image: OCEAN_BANK,
    name: "Ngân hàng Đại Dương (OceanBank)",
  },
  {
    code: "cb_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={CB_BANK}></img>
        <span className="text-xs font-normal">CBB</span>
      </div>
    ),
    image: CB_BANK,
    name: "Ngân hàng xây dựng (CBBANK)",
  },
  {
    code: "hd_bank",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <img className="w-full h-6" src={HD_BANK}></img>
        <span className="text-xs font-normal">HDBANK</span>
      </div>
    ),
    image: HD_BANK,
    name: "Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh (HDBANK)",
  },
];
/* 2. Danh sách các nước */
export const countryList = [
  {
    code: "vietnam",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={VIETNAM_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Việt Nam</span>
        </div>
      </div>
    ),
    image: VIETNAM_FLAG,
    name: "Việt Nam",
  },
  {
    code: "american",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={AMERICAN_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Hoa Kì</span>
        </div>
      </div>
    ),
    image: AMERICAN_FLAG,
    name: "Hoa Kì",
  },
  {
    code: "china",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={CHINA_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Trung Quốc</span>
        </div>
      </div>
    ),
    image: CHINA_FLAG,
    name: "Trung Quốc",
  },
  {
    code: "singapore",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={SINGAPO_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Singapore</span>
        </div>
      </div>
    ),
    image: SINGAPO_FLAG,
    name: "Singapore",
  },

  {
    code: "philippines",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={PHILIPPINES_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Philippines</span>
        </div>
      </div>
    ),
    image: PHILIPPINES_FLAG,
    name: "Philippines",
  },
  {
    code: "malaysia",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={MALAYSIA_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Malaysia</span>
        </div>
      </div>
    ),
    image: MALAYSIA_FLAG,
    name: "Malaysia",
  },
  {
    code: "thailand",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={THAILAND_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Thái Lan</span>
        </div>
      </div>
    ),
    image: CHINA_FLAG,
    name: "Thái Lan",
  },
  {
    code: "indonesia",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={INDONESIA_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Indonesia</span>
        </div>
      </div>
    ),
    image: INDONESIA_FLAG,
    name: "Indonesia",
  },
  {
    code: "timor",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={TIMOR_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Đông Timor</span>
        </div>
      </div>
    ),
    image: TIMOR_FLAG,
    name: "Đông Timor",
  },
  {
    code: "brunei",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={BRUNEI_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Brunei</span>
        </div>
      </div>
    ),
    image: BRUNEI_FLAG,
    name: "Brunei",
  },

  {
    code: "laos",
    label: (
      <div style={{ gap: "12px" }} className="flex items-center">
        <div>
          <img className="w-full h-7" src={LAOS_FLAG}></img>
        </div>
        <div>
          <span className="text-xs font-normal">Lào</span>
        </div>
      </div>
    ),
    image: LAOS_FLAG,
    name: "Lào",
  },
];
/* 3. Danh sách các kỹ năng của đối tác */
export const listSkills = [
  { code: 1, label: "Vệ sinh nhà cửa" },
  { code: 2, label: "Giúp việc nhà" },
  { code: 3, label: "Nấu ăn" },
  { code: 4, label: "Chăm em bé" },
];
/* 4. Danh sách các ngôn ngữ */
export const listLanguages = [
  { code: 1, label: "Tiếng Việt" },
  { code: 2, label: "Tiếng Anh" },
  { code: 3, label: "Tiếng Hàn" },
  { code: 4, label: "Tiếng Trung" },
  { code: 5, label: "Tiếng Nhật" },
];
/* 5. Danh sách các đường dẫn */
export const path = {
  HOME: "/",
  HOMEPAGE: "/home",
  LOGIN: "/login",
  LOG_OUT: "/logout",
  SYSTEM: "/system",
};

/* ~~~ Function ~~~ */
/* 1. Hàm render sao từ giá trị đánh giá (number) truyền vào */
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
/* 2. Hàm tính phần trăm của giá trị con (child) trên tổng (total) */
export const calculateNumberPercent = (total, child) => {
  let percent = (child / total) * 100;
  return percent ? Math.round((percent + Number.EPSILON) * 100) / 100 : 0;
};
/* 3. Hàm dời phần từ trong mảng (array) từ vị trí hiện tại thành vị trí truyền vào (position) 
conditionFind là điều kiện để tìm ra phần tử cần đổi vị trí trong mảng array */
export const moveElement = (array, position, conditionFind) => {
  let newArray = [...array]; // Temp array
  const index = newArray.findIndex(conditionFind); // Check if having data or not
  if (index !== -1) {
    const [element] = newArray.splice(index, 1); // Get the element
    newArray.splice(position, 0, element); // Insert into array
    return newArray;
  }
};
/* 4. Hàm sắp xếp theo bảng chữ cái */
export const sortList = (list,valueSort) => {
  return list.sort((a, b) => a[valueSort].localeCompare(b[valueSort]));
}
/* 5. Hàm thiết lập mảng giá trị thành mảng phù hợp cho inputCustome */
export const formatArray = (array, code, label, subLabel) => {
  const updatedArray = array.map((item) => {
    return {
      ...item,
      code: item[code],
      label: subLabel ? item[label] + " " + item[subLabel] : item[label],
    };
  });
  return updatedArray; 
};
/* 6. Hàm so sánh hai mốc thời gian */
export const compareDateIsBefore = (firstDate, secondDate) => { 
  const date1 = moment(firstDate)
  const date2 = moment(secondDate)
  if (date1.isBefore(date2)) {
    return true;
  } else {
    return false;
  }
}
/* 7. Hàm che số điện thoại */
export const convertPhoneNumber = (phoneNumber, length) => {
  if (!phoneNumber || length >= phoneNumber.length) {
    return phoneNumber;
  }
  const mask = '*'.repeat(length); 
  const visiblePart = phoneNumber.slice(length); 
  return mask + visiblePart;
}