import { Row } from "antd";
import moment from "moment";
import { useState } from "react";
import { formatMoney } from "../../../../../../../helper/formatMoney";

const DetailActivityCollaborator = () => {
  const [dataGroup, setDataGroup] = useState([]);
  const timeWork = (data) => {
    const start = moment(new Date(data?.date_work_schedule[0]?.date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd + "   (" + data?.total_estimate + " giờ )";
  };
  return (
    <div>
      <a>Chi tiết hoạt động</a>
      <Row>
        <div className="div-details-service">
          <a className="label-details">Chi tiết</a>
          <a className="title">
            Dịch vụ:{" "}
            <a className="text-service">
              {dataGroup?.type === "schedule"
                ? "Giúp việc cố định"
                : dataGroup?.type === "loop" && !dataGroup?.is_auto_order
                ? "Giúp việc theo giờ"
                : dataGroup?.type === "loop" && dataGroup?.is_auto_order
                ? "Lặp lại hàng tuần"
                : ""}
            </a>
          </a>
          <div className="div-datework">
            <a className="title">Thời gian: </a>
            <div className="div-times">
              <a>
                -Ngày làm:{" "}
                {moment(
                  new Date(dataGroup?.date_work_schedule[0]?.date)
                ).format("DD/MM/YYYY")}
              </a>
              <a>-Giờ làm: {timeWork(dataGroup)}</a>
            </div>
          </div>
          <a className="title">
            Địa điểm: <a className="text-service">{dataGroup?.address}</a>
          </a>
          {dataGroup?.note && (
            <a className="title">
              Ghi chú: <a className="text-service">{dataGroup?.note}</a>
            </a>
          )}
          <div style={{ flexDirection: "row" }}>
            <a className="title">Dịch vụ thêm: </a>
            {dataGroup?.service?.optional_service.map((item) => {
              return (
                <a>
                  {item?._id === "632148d02bacd0aa8648657c"
                    ? item?.extend_optional?.map((item) => (
                        <a>- {item?.title?.vi}</a>
                      ))
                    : null}
                </a>
              );
            })}
          </div>

          <a className="title">
            Thanh toán:{" "}
            <a className="text-service">
              {dataGroup?.payment_method === "cash" ? "Tiền mặt" : "G-point"}
            </a>
          </a>
          <div className="div-price">
            <a className="title">Tạm tính:</a>
            <div className="detail-price">
              <div className="div-total">
                <a>- Tổng tiền:</a>
                <a>{formatMoney(dataGroup?.initial_fee)}</a>
              </div>
              <div className="div-total">
                <a>- Phí dịch vụ:</a>
                {dataGroup?.service_fee?.map((item) => (
                  <a>+{formatMoney(item?.fee)}</a>
                ))}
              </div>
              {dataGroup?.code_promotion && (
                <div className="div-total-promo">
                  <a>- Khuyến mãi:</a>
                  <div className="div-promo">
                    <a>+ Mã code: {dataGroup?.code_promotion?.code}</a>
                    <a style={{ color: "red", marginLeft: 5 }}>
                      {formatMoney(-dataGroup?.code_promotion?.discount)}
                    </a>
                  </div>
                </div>
              )}
              {dataGroup?.event_promotion && (
                <div className="div-event-promo">
                  <a>- Chương trình:</a>
                  <div className="div-price-event">
                    {dataGroup?.event_promotion.map((item, key) => {
                      return (
                        <a className="text-event-discount">
                          {formatMoney(-item?.discount)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
              {dataGroup?.service?.optional_service.map((item) => {
                return (
                  <div>
                    {item?._id === "632148d02bacd0aa8648657c"
                      ? item?.extend_optional?.map((item) => {
                          return (
                            <div className="div-event-promo">
                              <a>- {item?.title?.vi}</a>
                              <a> +{formatMoney(item?.price)}</a>
                            </div>
                          );
                        })
                      : null}
                  </div>
                );
              })}
              <div className="div-total">
                <a className="title">- Giá: </a>
                <a className="title">{formatMoney(dataGroup?.final_fee)}</a>
              </div>
            </div>
          </div>

          <a className="title">
            Trạng thái:{" "}
            {dataGroup?.status === "pending" ? (
              <a className="text-pending ">Đang chờ làm</a>
            ) : dataGroup?.status === "confirm" ? (
              <a className="text-confirm">Đã nhận</a>
            ) : dataGroup?.status === "doing" ? (
              <a className="text-doing">Đang làm</a>
            ) : dataGroup?.status === "done" ? (
              <a className="text-done">Đã xong</a>
            ) : (
              <a className="text-cancel">Đã huỷ</a>
            )}
          </a>
        </div>
      </Row>
    </div>
  );
};

export default DetailActivityCollaborator;
