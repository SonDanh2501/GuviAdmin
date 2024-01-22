import React, { memo } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../../helper/formatMoney";
import { getLanguageState } from "../../../../redux/selectors/auth";

const DetailBill = (props) => {
  const {
    code_promotion,
    event_promotion,
    tip_collaborator,
    service_fee,
    total_fee,
    final_fee,
    initial_fee,
    total_date_work,
  } = props;
  const lang = useSelector(getLanguageState);
  return (
    <div className="detail-bill_container">
      <h6>Thông tin thanh toán đơn hàng</h6>
      {total_date_work && total_date_work > 1 && (
        <div className="div-flex-row">
          <p className="fw-500">Số buổi</p>
          <p>{total_date_work}</p>
        </div>
      )}
      <div className="div-flex-row">
        <p className="fw-500">Tạm tính</p>
        <p>{formatMoney(initial_fee)}</p>
      </div>
      {code_promotion && (
        <div className="div-flex-row">
          <p className="fw-500">
            Khuyến mãi &nbsp;&nbsp;
            <span className="detail-bill_p-code-promotion">
              {code_promotion?.code}
            </span>
          </p>
          <p className="detail-bill_p-discount">
            - {formatMoney(code_promotion?.discount)}
          </p>
        </div>
      )}
      {event_promotion && event_promotion.length > 0 && (
        <>
          <p className="fw-500">Chương trình khuyến mãi</p>
          <ul>
            {event_promotion.map((item, index) => {
              const _title = item?._id?.title
                ? item?._id?.title[lang]
                : item?.title[lang];
              return (
                <li key={index} className="div-flex-row">
                  <p> - {_title}</p>
                  <p className="detail-bill_p-discount">
                    - {formatMoney(item?.discount)}
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <div className="div-flex-row">
        <p className="fw-500">Phí dịch vụ</p>
        <p>{formatMoney(service_fee)}</p>
      </div>
      {tip_collaborator !== 0 && (
        <div className="div-flex-row">
          <p className="fw-500">Tiền tip</p>
          <p>{formatMoney(tip_collaborator)}</p>
        </div>
      )}
      <div className="div-flex-row detail-bill_last-item">
        <p className="fw-500">Tổng tiền</p>
        <div>
          <del>{formatMoney(total_fee)}</del>
          <p className="detail-bill_p-final-fee">{formatMoney(final_fee)}</p>
        </div>
      </div>
    </div>
  );
};
export default memo(DetailBill);
