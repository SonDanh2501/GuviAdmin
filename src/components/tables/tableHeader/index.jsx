import { Popover } from "antd";
import React from "react";
import { IoHelpCircleOutline } from "react-icons/io5";
import "./index.scss";
import { formatMoney } from "../../../helper/formatMoney";

const CustomHeaderDatatable = ({
  title,
  subValue,
  typeSubValue,
  textToolTip,
  color,
  size,
  position,
}) => {
  return (
    <div
      className={`custom-table-header ${
        position === "left" ? "left" : position === "right" ? "right" : "center"
      }`}
    >
      <div className="custom-table-header__label">
        <span className="custom-table-header__label--title">
          {title}
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
        </span>
        {subValue !== undefined && subValue !== null && (
          <span
            className={`custom-table-header__sub-value ${
              position === "left"
                ? "left"
                : position === "right"
                ? "right"
                : "center"
            }`}
            style={{ color: title === "Doanh thu" ? "#eab308" : "white" }}
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
