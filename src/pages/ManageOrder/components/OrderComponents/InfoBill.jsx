import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../../helper/formatMoney";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { Button } from "antd";
import "./index.scss";
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
  return (
    <div className="infos-bill-container">
      <div className="infos-bill-container__title">
        {/* {title && (
            <p className="info-bill-container_title-service_title">{title}</p>
          )} */}
        {titleService && (
          <span className="infos-bill-container__title--service">
            {titleService}
          </span>
        )}

        {handleCancel && (
          <Button type="primary" danger onClick={handleCancel}>
            Huỷ Đơn hàng
          </Button>
        )}
      </div>
      <div className="infos-bill-container__table">
        <span className="infos-bill-container__table-header">Mô tả</span>
        <span className="infos-bill-container__table-header align-end">Giá</span>
        <span className="infos-bill-container__table-header align-center">Số lượng</span>
        <span className="infos-bill-container__table-header align-end">
          Thành tiền
        </span>
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
          // _price = totalDateWork * _price;
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
          <div key={index} className="infos-bill-container__row">
            <div>
              <span className="infos-bill-container__row--label">
                {titleService === "Vệ sinh máy lạnh" && "Treo tường - "}
                {item?.title[lang]} {item?.kind === "leather" && "(da)"}{" "}
                {item?.kind === "fabric" && "(vải/nỉ)"}
              </span>
              {_description && (
                <span className="infos-bill-container__row--label">{`(${_description})`}</span>
              )}
            </div>
            {_pricePerItem !== 0 ? (
              <span className="infos-bill-container__row--label align-end">
                {formatMoney(_pricePerItem)}
              </span>
            ) : (
              <p></p>
            )}
            {_count !== 0 && (
              <span className="infos-bill-container__row--label align-center">
                {_count}
              </span>
            )}
            {_price !== 0 && (
              <span className="infos-bill-container__row--label align-end">
                {formatMoney(_price)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default memo(InfoBill);
