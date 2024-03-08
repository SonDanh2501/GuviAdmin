import React from "react";
import { formatMoney } from "../../../helper/formatMoney";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";

const ItemTotal = (props) => {
  const { title, description, value, convertMoney } = props;
  const content = (
    <div>
      <p>{description}</p>
    </div>
  );
  return (
    <div className="item-total_container">
      <div className="item-total_title">
        <p>{title || "Tổng giá trị"}</p> &nbsp;
        <Popover content={content} title="Tông giá trị">
          <InfoCircleOutlined />
        </Popover>
      </div>
      <p className="fw-500">{convertMoney ? formatMoney(value) : value}</p>
    </div>
  );
};
export default React.memo(ItemTotal);
