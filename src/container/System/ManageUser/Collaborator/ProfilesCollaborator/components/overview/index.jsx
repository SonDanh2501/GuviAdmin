import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import "./styles.scss";
import { Col, Row } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { useEffect, useState } from "react";
import { getOverviewCollaborator } from "../../../../../../../api/collaborator";
import moment from "moment";
import { Link } from "react-router-dom";

const Overview = ({ id }) => {
  const [total, setTotal] = useState({
    total_favourite: 0,
    total_order: 0,
    total_hour: 0,
    remainder: 0,
    gift_remainder: 0,
  });
  const [data, setData] = useState([]);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getOverviewCollaborator(id)
      .then((res) => {
        setData(res?.arr_order?.reverse());
        setTotal({
          ...total,
          total_favourite: res?.total_favourite.length,
          total_hour: res?.total_hour,
          total_order: res?.total_order,
          remainder: res?.remainder,
          gift_remainder: res?.gift_remainder,
        });
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <div className="div-overview">
        <div className="div-body-overview">
          <a className="text-wallet">
            Ví Chính: {formatMoney(total?.remainder)}
          </a>
          <a className="text-wallet">
            Ví Thưởng: {formatMoney(total?.gift_remainder)}
          </a>
          <div className="div-total">
            <div className="div-item-total">
              <a className="number-total">{total.total_order}</a>
              <a className="detail-total">Số ca làm</a>
            </div>

            <div className="div-item-total">
              <a className="number-total">{total.total_hour}</a>
              <a className="detail-total">Số giờ làm</a>
            </div>

            <div className="div-item-total-favorite">
              <div className="div-number">
                <a className="number-total">{total.total_favourite}</a>
                <HeartFilled
                  style={{
                    color: "red",
                    marginLeft: 10,
                    fontSize: 20,
                  }}
                />
              </div>
              <a className="detail-total">Yêu thích</a>
            </div>
          </div>

          <div className="mt-4">
            <a className="text-order-near">Đơn gần nhất</a>
            {data.map((item, index) => {
              return (
                <div key={index} className="item-list-order">
                  <div className="div-detail-item">
                    <Link to={`/details-order/${item?.id_group_order}`}>
                      <a className="text-item">Mã: {item?.id_view}</a>
                    </Link>
                    <a className="text-item">
                      Dịch vụ:{" "}
                      {item?.type === "loop" && item?.is_auto_order
                        ? `${i18n.t("repeat", { lng: lang })}`
                        : item?.service?._id?.kind === "giup_viec_theo_gio"
                        ? `${i18n.t("cleaning", { lng: lang })}`
                        : item?.service?._id?.kind === "giup_viec_co_dinh"
                        ? `${i18n.t("cleaning_subscription", { lng: lang })}`
                        : item?.service?._id?.kind === "phuc_vu_nha_hang"
                        ? `${i18n.t("serve", { lng: lang })}`
                        : ""}
                    </a>
                    <a className="text-item">
                      Ngày làm:{" "}
                      {moment(item?.date_work).format("DD/MM/YYYY - HH:mm")}{" "}
                    </a>
                    <Link to={`/profile-customer/${item?.id_customer?._id}`}>
                      <a className="text-item">
                        Khách hàng: {item?.name_customer}
                      </a>
                    </Link>
                    <a className="text-item">Địa chỉ: {item?.address}</a>
                  </div>
                  <div className="item-detail-right">
                    <div>
                      <a className="title-status">Trạng thái: </a>
                      <a
                        className={
                          item?.status === "pending"
                            ? "text-pen-order"
                            : item?.status === "confirm"
                            ? "text-confirm-order"
                            : item?.status === "doing"
                            ? "text-doing-order"
                            : item?.status === "done"
                            ? "text-done-order"
                            : "text-cancel-order"
                        }
                      >
                        {item?.status === "pending"
                          ? `${i18n.t("pending", { lng: lang })}`
                          : item?.status === "confirm"
                          ? `${i18n.t("confirm", { lng: lang })}`
                          : item?.status === "doing"
                          ? `${i18n.t("doing", { lng: lang })}`
                          : item?.status === "done"
                          ? `${i18n.t("complete", { lng: lang })}`
                          : `${i18n.t("cancel", { lng: lang })}`}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
