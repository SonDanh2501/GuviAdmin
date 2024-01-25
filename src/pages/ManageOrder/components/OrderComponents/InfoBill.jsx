import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../../helper/formatMoney";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { Button } from "antd";

const InfoBill = (props) => {
  const { data, title, handleCancel, titleService } = props;
  const lang = useSelector(getLanguageState);
  const [arrExtend, setArrExtend] = useState([]);
  const [totalDateWork, setTotalDateWork] = useState(1);
  useEffect(() => {
    const tempArr = [];
    data?.info?.service?.optional_service?.map((item) => {
      item?.extend_optional?.map((i) => {
        tempArr.push(i);
      });
    });
    setArrExtend(tempArr);
    setTotalDateWork(data?.date_work_schedule.length);
  }, [data]);
  console.log("dât ", data);
  return (
    <div className="info-bill-container b-shadow">
      <div className="info-bill-container_title">
        <div className="info-bill-container_title-service">
          {/* {title && (
            <p className="info-bill-container_title-service_title">{title}</p>
          )} */}
          {titleService && <span>{titleService}</span>}
        </div>
        {handleCancel && (
          <Button type="primary" danger onClick={handleCancel}>
            Huỷ Đơn hàng
          </Button>
        )}
      </div>

      <div className="gird-3-1-1-1 info-bill_header">
        <p>Mô tả</p>
        <p>Giá</p>
        <p>Số lượng</p>
        <p className="text-align-end">Thành tiền</p>
      </div>
      {arrExtend?.map((item, index) => {
        let _pricePerItem = item?.price;
        let _price = item?.price;
        let _count = item?.count;
        let _description = item?.description[lang];
        if (_pricePerItem === 0) {
          _count = 0;
        }
        if (totalDateWork > 1) {
          _price = totalDateWork * _price;
          _count = totalDateWork;
        }
        if (item?.count > 1) {
          _pricePerItem = item?.price / item?.count;
        }
        if (_price === 0) {
          _pricePerItem = 0;
          _count = 0;
        }
        if (_description.length > 30 || _description === "+1 giờ") {
          _description = "";
        }
        if (totalDateWork > 1) {
          _pricePerItem = 0;
        }
        return (
          <div key={index} className="gird-3-1-1-1 info-bill_item b-shadow-2">
            <div>
              <p>
                {item?.title[lang]} {item?.kind === "leather" && "(da)"}{" "}
                {item?.kind === "fabric" && "(vải/nỉ)"}
              </p>
              <p>{_description}</p>
            </div>
            {_pricePerItem !== 0 ? (
              <p>{formatMoney(_pricePerItem)}</p>
            ) : (
              <p></p>
            )}
            {_count !== 0 && <p>{_count}</p>}
            {_price !== 0 && (
              <p className="text-align-end">{formatMoney(_price)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default memo(InfoBill);
