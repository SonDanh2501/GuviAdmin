import { Link } from "react-router-dom";
import icons from "../utils/icons";

const { IoHome, IoPerson } = icons;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const routerAffiliate = [
  // Affiliate
  getItem(
    <Link style={{ textDecoration: "none" }} to="/affiliate">
      Affiliate
    </Link>,
    "/",
    <IoHome />,
    null,
    "dashboard"
  ),
  // Referend list
  getItem(
    <Link style={{ textDecoration: "none" }} to="/referend-list">
      DS đã giới thiệu
    </Link>,
    "/referend-list",
    <IoPerson />,
    null,
    "dashboard"
  ),
];

export default routerAffiliate;
