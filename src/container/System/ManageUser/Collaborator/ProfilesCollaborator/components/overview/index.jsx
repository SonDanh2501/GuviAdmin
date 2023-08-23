import { HeartFilled } from "@ant-design/icons";
import { Switch } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCollaboratorsById,
  getOverviewCollaborator,
  verifyCollaborator,
} from "../../../../../../../api/collaborator";
import ModalCustom from "../../../../../../../components/modalCustom";
import LoadingPagination from "../../../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./styles.scss";

const Overview = ({ id }) => {
  const [total, setTotal] = useState({
    total_favourite: 0,
    total_order: 0,
    total_hour: 0,
    remainder: 0,
    gift_remainder: 0,
  });
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);
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

    getCollaboratorsById(id)
      .then((res) => {
        setDataDetail(res);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  }, [id]);

  const onVerifyCollaborator = useCallback((id, is_verify) => {
    setIsLoading(true);
    verifyCollaborator(id)
      .then((res) => {
        getCollaboratorsById(id)
          .then((res) => {
            setDataDetail(res);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
          });
        setModalVerify(false);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, []);

  return (
    <>
      <div className="div-overview">
        <div className="div-body-overview">
          <div className="div-head-overview">
            <div className="div-wallet">
              <p className="text-wallet">
                Ví Chính: {formatMoney(total?.remainder)}
              </p>
              <p className="text-wallet">
                Ví Thưởng: {formatMoney(total?.gift_remainder)}
              </p>
            </div>
            <Switch
              style={{
                width: 40,
                backgroundColor: dataDetail?.is_verify ? "#00cf3a" : "",
              }}
              onClick={() => setModalVerify(true)}
              checked={dataDetail?.is_verify}
              disabled={dataDetail?.is_verify ? true : false}
            />
          </div>
          <div className="div-total">
            <div className="div-item-total">
              <p className="number-total">{total.total_order}</p>
              <p className="detail-total">Số ca làm</p>
            </div>

            <div className="div-item-total">
              <p className="number-total">{total.total_hour}</p>
              <p className="detail-total">Số giờ làm</p>
            </div>

            <div className="div-item-total-favorite">
              <div className="div-number">
                <p className="number-total">{total.total_favourite}</p>
                <HeartFilled
                  style={{
                    color: "red",
                    marginLeft: 10,
                    fontSize: 20,
                  }}
                />
              </div>
              <p className="detail-total">Yêu thích</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-order-near">Đơn gần nhất</p>
            {data.map((item, index) => {
              return (
                <div key={index} className="item-list-order">
                  <div className="div-detail-item">
                    <Link to={`/details-order/${item?.id_group_order}`}>
                      <p className="text-item">Mã: {item?.id_view}</p>
                    </Link>
                    <p className="text-item">
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
                    </p>
                    <p className="text-item">
                      Ngày làm:{" "}
                      {moment(item?.date_work).format("DD/MM/YYYY - HH:mm")}{" "}
                    </p>
                    <Link to={`/profile-customer/${item?.id_customer?._id}`}>
                      <p className="text-item">
                        Khách hàng: {item?.name_customer}
                      </p>
                    </Link>
                    <p className="text-item">Địa chỉ: {item?.address}</p>
                  </div>
                  <div className="item-detail-right">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <p className="title-status mr-2">Trạng thái: </p>
                      <p
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
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModalCustom
        isOpen={modalVerify}
        title="Xác thực cộng tác viên"
        handleOk={() =>
          onVerifyCollaborator(dataDetail?._id, dataDetail?.is_verify)
        }
        textOk="Xác thực"
        handleCancel={() => setModalVerify(false)}
        body={<p>Bạn có chắc xác thực cho CTV này? {dataDetail?.full_name}</p>}
      />
      {isLoading && <LoadingPagination />}
    </>
  );
};

export default Overview;
