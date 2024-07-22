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
  }) => {
    return (
      <React.Fragment>
        <div className="div-table-header">
          <div className="table-header-label">
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: title === "Doanh thu" ? "#2463eb" : "none",
              }}
            >
              {title}
            </p>
            {textToolTip ? (
              <Popover
                content={textToolTip}
                placement="top"
                overlayInnerStyle={{
                  backgroundColor: "white",
                }}
              >
                <div>
                  <IoHelpCircleOutline
                    size={size ? size : 18}
                    color={color ? color : "white"}
                  />
                  {/* <i
                    style={{
                      color: title === "Doanh thu" ? "#2463eb" : "none",
                    }}
                    class="uil uil-question-circle icon-question"
                  ></i> */}
                </div>
              </Popover>
            ) : (
              <></>
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
      </React.Fragment>
    );
  };

export default CustomHeaderDatatable;