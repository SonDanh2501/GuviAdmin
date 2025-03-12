import { Popover } from "antd";
import React from "react";
import "./index.scss";
import { formatMoney } from "../../../helper/formatMoney";
import icons from "../../../utils/icons";

const { IoCaretUp, IoCaretDown, IoHelpCircleOutline } = icons;
const CustomHeaderDatatable = ({
  title,
  subValue,
  typeSubValue,
  textToolTip,
  color,
  size,
  position,
  sortValue,
  setSortValue,
}) => {

  return (
    <div
      className={`custom-table-header ${
        position === "left" ? "left" : position === "right" ? "right" : "center"
      }`}
    >
      <div className="custom-table-header__label">
        <span className="custom-table-header__label--title">{title}</span>
        {textToolTip && (
          <Popover
            content={textToolTip}
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "white",
            }}
          >
            <div>
              <IoHelpCircleOutline
                size={size ? size : 14}
                color={color ? color : "white"}
              />
            </div>
          </Popover>
        )}
        {sortValue && (
          <div className="custom-table-header__label--sort">
            <span onClick={() => setSortValue(1)}>
              <IoCaretUp color={`${sortValue === 1 ? "#43464b" : "#ffffff"}`} />
            </span>
            <span onClick={() => setSortValue(-1)}>
              <IoCaretDown color={`${sortValue === -1 ? "#43464b" : "#ffffff"}`} />
            </span>
          </div>
        )}
        {subValue !== undefined && subValue !== null && (
          <span
            className={`custom-table-header__sub-value ${
              position === "left"
                ? "left"
                : position === "right"
                ? "right"
                : "center"
            }`}
            style={{
              color:
                title === "Doanh thu"
                  ? "#FFE100"
                  : title === "Doanh thu dự kiến"
                  ? "#FFE100"
                  : "white",
            }}
          >
            {typeSubValue === "money"
              ? formatMoney(subValue)
              : typeSubValue === "percent"
              ? Number(subValue) + " %"
              : Number(subValue)}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomHeaderDatatable;
