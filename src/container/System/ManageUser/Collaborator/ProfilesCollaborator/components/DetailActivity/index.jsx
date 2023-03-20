import { Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailsHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const DetailActivityCollaborator = () => {
  const { state } = useLocation();
  const { idOrder, idCollaborator } = state || {};
  const [dataGroup, setDataGroup] = useState([]);
  const [dataActivity, setDataActivity] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getDetailsHistoryActivityCollaborator(idOrder, {
      id_collaborator: idCollaborator,
    })
      .then((res) => {
        setDataActivity(res?.data);
        setDataGroup(res?.groupOrder);
        setShow(true);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [idOrder, idCollaborator]);

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
      <i
        class="uil uil-arrow-left"
        style={{ width: 50, height: 50 }}
        onClick={() => navigate(-1)}
      ></i>
      <h5 className="mt-3">Chi tiết hoạt động</h5>
      {show && (
        <div>
          <div className="div-title">
            <a className="text-title">Chi tiết đơn hàng</a>
          </div>
          <div className="div-details-service mt-2">
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
        </div>
      )}

      {dataActivity?.length > 0 && (
        <div className="ml-3">
          <div className="div-title">
            <a className="text-title">Hoạt động với đơn hàng</a>
          </div>
          <div>
            {dataActivity?.map((item, index) => {
              const money = item?.value?.toString();
              const subject = item?.id_admin_action
                ? item?.title_admin.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_collaborator
                ? item?.title_admin.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? item?.title_admin.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : "";

              const predicate = item?.id_address
                ? subject.replace(item?.id_address, item?.value_string)
                : item?.id_order
                ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
                : item?.id_promotion
                ? subject.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.title?.vi
                  )
                : item?.id_collaborator
                ? subject.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? subject.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_admin_action
                ? subject.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_transistion_collaborator
                ? subject.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : item?.id_transistion_customer
                ? subject.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  )
                : "";

              const object = item?.id_order
                ? predicate.replace(
                    item?.id_order?._id,
                    item?.id_order?.id_view
                  )
                : item?.id_transistion_collaborator
                ? predicate.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : item?.id_transistion_customer
                ? predicate.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  )
                : predicate.replace(
                    item?.id_reason_cancel?._id,
                    item?.id_reason_cancel?.title?.vi
                  );
              return (
                <div key={index} className="div-item-list">
                  <div className="div-name">
                    <a className="text-title">{object}</a>
                    <a
                      className={
                        money.slice(0, 1) === "-"
                          ? "text-money-deduction"
                          : "text-money-plus"
                      }
                    >
                      {item?.value === 0
                        ? ""
                        : money.slice(0, 1) === "-"
                        ? formatMoney(item?.value)
                        : "+" + formatMoney(item?.value)}
                    </a>
                  </div>
                  <a className="text-date">
                    {moment(new Date(item?.date_create)).format(
                      "DD/MM/yyy - HH:mm"
                    )}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailActivityCollaborator;
