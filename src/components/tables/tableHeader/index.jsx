import { Popover } from 'antd';
import React from 'react'
import { IoHelpCircleOutline } from "react-icons/io5";
import './index.scss'

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
          position === "left"
            ? "left"
            : position === "right"
            ? "right"
            : "center"
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
        </div>
        <div className="sub-value">
          {subValue ? (
            <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
              {subValue}
            </p>
          ) : (
            <div style={{ marginTop: "35px" }}></div>
          )}
        </div>
      </div>
    );
  };

export default CustomHeaderDatatable;