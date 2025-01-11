import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../../helper/formatMoney";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { Button, Drawer, Modal, Tooltip } from "antd";
import { format } from "date-fns";
import "./index.scss";
import ButtonCustom from "../../../../components/button";
import icons from "../../../../utils/icons";

const {IoHelpCircleOutline} = icons
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
    payment_method,
    date_work_schedule,
    subtotal_fee,
    tax,
    net_income,
  } = props;
  const lang = useSelector(getLanguageState);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const onClose = () => {
    setIsOpenDrawer(false);
  };
  const onOpen = () => {
    setIsOpenDrawer(true);
  };
  return (
    <>
      <div className="detail-bill-container">
        <div className="detail-bill-container__child">
          <span className="detail-bill-container__child--label">
            Thông tin thanh toán đơn hàng
            <Tooltip title="Chi tiết đơn hàng" trigger="hover">
              <span
                onClick={() => setIsShowDetail(!isShowDetail)}
                className="detail-bill-container__child--content detail"
              >
                <IoHelpCircleOutline />
              </span>
            </Tooltip>
          </span>
          {total_date_work > 1 && date_work_schedule && (
            <span
              className="detail-bill-container__child--content high-light"
              onClick={onOpen}
            >
              Chi tiết ngày làm
            </span>
          )}
        </div>
        {payment_method && (
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">
              Thanh toán
            </span>
            <span className="detail-bill-container__child--content">
              {payment_method}
            </span>
          </div>
        )}
        {total_date_work > 1 && (
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">Số buổi</span>
            <span className="detail-bill-container__child--content">
              {total_date_work}
            </span>
          </div>
        )}
        <div className="detail-bill-container__child">
          <span className="detail-bill-container__child--label">Tạm tính</span>
          <span className="detail-bill-container__child--content">
            {formatMoney(initial_fee)}
          </span>
        </div>
        {code_promotion && (
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">
              Khuyến mãi: &nbsp;
              <span className="detail-bill-container__child--label-promotion-code">
                {code_promotion?.code}
              </span>
            </span>
            <span className="detail-bill-container__child--content minus">
              - {formatMoney(code_promotion?.discount)}
            </span>
          </div>
        )}
        {event_promotion && event_promotion.length > 0 && (
          <div className="detail-bill-container__child-list">
            <span className="detail-bill-container__child-list--label">
              Chương trình khuyến mãi
            </span>
            {event_promotion.map((item, index) => {
              const _title = item?._id?.title
                ? item?._id?.title[lang]
                : item?.title[lang];
              return (
                <div className="detail-bill-container__child-list--child">
                  <span className="detail-bill-container__child-list--child-label">
                    - {_title}
                  </span>
                  <span className="detail-bill-container__child-list--child-content">
                    - {formatMoney(item?.discount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <div className="detail-bill-container__child">
          <span className="detail-bill-container__child--label">
            Phí dịch vụ
          </span>
          <span className="detail-bill-container__child--content">
            {formatMoney(service_fee)}
          </span>
        </div>
        {tip_collaborator !== 0 && (
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">
              Tiền tip
            </span>
            <span className="detail-bill-container__child--content">
              {formatMoney(tip_collaborator)}
            </span>
          </div>
        )}

        <div className="detail-bill-container__child-final-price">
          <span className="detail-bill-container__child-final-price-label">
            Tổng tiền
          </span>
          <div className="detail-bill-container__child-final-price-container">
            <span className="detail-bill-container__child-final-price-container-before-discount">
              {formatMoney(total_fee)}
            </span>
            <span className="detail-bill-container__child-final-price-container-final-price">
              {formatMoney(final_fee)}
            </span>
          </div>
        </div>

        <Drawer title="Chi tiết ngày làm" onClose={onClose} open={isOpenDrawer}>
          <div>
            <div className="detail-bill_detail-date-work_header">
              <p>Ngày làm</p>
              <p>Tạm tính</p>
            </div>
            {date_work_schedule?.map((item, i) => {
              const _date = format(new Date(item?.date), "dd/MM/yyyy");
              return (
                <div
                  className="detail-bill_detail-date-work_header_item"
                  key={i}
                >
                  <p>{_date}</p>
                  <p>{formatMoney(item?.initial_fee || 0)}</p>
                </div>
              );
            })}
          </div>
        </Drawer>
      </div>
      <Modal
        title="Chi tiết đơn hàng"
        onCancel={() => setIsShowDetail(false)}
        open={isShowDetail}
        width={350}
        footer={[]}
      >
        <div className="detail-bill-container">
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">
              Thông tin thanh toán đơn hàng
            </span>
          </div>
          {payment_method && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">
                Thanh toán
              </span>
              <span className="detail-bill-container__child--content">
                {payment_method}
              </span>
            </div>
          )}
          {total_date_work > 1 && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">
                Số buổi
              </span>
              <span className="detail-bill-container__child--content">
                {total_date_work}
              </span>
            </div>
          )}
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">
              Tạm tính
            </span>
            <span className="detail-bill-container__child--content">
              {formatMoney(initial_fee)}
            </span>
          </div>
          {isShowDetail && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">
                Giá trị đơn hàng
              </span>
              <span className="detail-bill-container__child--content">
                {formatMoney(subtotal_fee)}
              </span>
            </div>
          )}
          {code_promotion && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">
                Khuyến mãi: &nbsp;
                <span className="detail-bill-container__child--label-promotion-code">
                  {code_promotion?.code}
                </span>
              </span>
              <span className="detail-bill-container__child--content minus">
                - {formatMoney(code_promotion?.discount)}
              </span>
            </div>
          )}
          {event_promotion && event_promotion.length > 0 && (
            <div className="detail-bill-container__child-list">
              <span className="detail-bill-container__child-list--label">
                Chương trình khuyến mãi
              </span>
              {event_promotion.map((item, index) => {
                const _title = item?._id?.title
                  ? item?._id?.title[lang]
                  : item?.title[lang];
                return (
                  <div className="detail-bill-container__child-list--child">
                    <span className="detail-bill-container__child-list--child-label">
                      - {_title}
                    </span>
                    <span className="detail-bill-container__child-list--child-content">
                      - {formatMoney(item?.discount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="detail-bill-container__child">
            <span className="detail-bill-container__child--label">
              Phí dịch vụ
            </span>
            <span className="detail-bill-container__child--content">
              {formatMoney(service_fee)}
            </span>
          </div>
          {tip_collaborator !== 0 && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">
                Tiền tip
              </span>
              <span className="detail-bill-container__child--content">
                {formatMoney(tip_collaborator)}
              </span>
            </div>
          )}
          {isShowDetail && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">Thuế</span>
              <span className="detail-bill-container__child--content">
                {formatMoney(tax)}
              </span>
            </div>
          )}
          <div className="detail-bill-container__child-final-price">
            <span className="detail-bill-container__child-final-price-label">
              Tổng tiền
            </span>
            <div className="detail-bill-container__child-final-price-container">
              <span className="detail-bill-container__child-final-price-container-before-discount">
                {formatMoney(total_fee)}
              </span>
              <span className="detail-bill-container__child-final-price-container-final-price">
                {formatMoney(final_fee)}
              </span>
            </div>
          </div>
          {isShowDetail && (
            <div className="detail-bill-container__child">
              <span className="detail-bill-container__child--label">
                Thu nhập ròng
              </span>
              <span className="detail-bill-container__child--content">
                {formatMoney(net_income)}
              </span>
            </div>
          )}
          <Drawer
            title="Chi tiết ngày làm"
            onClose={onClose}
            open={isOpenDrawer}
          >
            <div>
              <div className="detail-bill_detail-date-work_header">
                <p>Ngày làm</p>
                <p>Tạm tính</p>
              </div>
              {date_work_schedule?.map((item, i) => {
                const _date = format(new Date(item?.date), "dd/MM/yyyy");
                return (
                  <div
                    className="detail-bill_detail-date-work_header_item"
                    key={i}
                  >
                    <p>{_date}</p>
                    <p>{formatMoney(item?.initial_fee || 0)}</p>
                  </div>
                );
              })}
            </div>
          </Drawer>
        </div>
      </Modal>
    </>
  );
};
export default memo(DetailBill);
