import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailsHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";

const DetailActivityCollaborator = () => {
  const { state } = useLocation();
  const { idOrder, idCollaborator } = state || {};
  const [dataGroup, setDataGroup] = useState([]);
  const [dataActivity, setDataActivity] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

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
  }, [idOrder, idCollaborator, dispatch]);

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
      <h5 className="mt-3">{`${i18n.t("detail_activity", { lng: lang })}`}</h5>
      {show && (
        <div>
          <div className="div-title">
            <p className="text-title">{`${i18n.t("order_detail", {
              lng: lang,
            })}`}</p>
          </div>
          <div className="div-details-service mt-2">
            <p className="title">
              {`${i18n.t("service", { lng: lang })}`}:{" "}
              <p className="text-service">
                {dataGroup?.type === "loop" && dataGroup?.is_auto_order
                  ? `${i18n.t("repeat", { lng: lang })}`
                  : dataGroup?.service?._id?.kind === "giup_viec_theo_gio"
                  ? `${i18n.t("cleaning", { lng: lang })}`
                  : dataGroup?.service?._id?.kind === "giup_viec_co_dinh"
                  ? `${i18n.t("cleaning_subscription", {
                      lng: lang,
                    })}`
                  : dataGroup?.service?._id?.kind === "phuc_vu_nha_hang"
                  ? `${i18n.t("serve", { lng: lang })}`
                  : ""}
              </p>
            </p>
            <div className="div-datework">
              <p className="title">
                {`${i18n.t("time", {
                  lng: lang,
                })}`}
                :{" "}
              </p>
              <div className="div-times ml-2">
                <p className="text-time">
                  -
                  {`${i18n.t("date_work", {
                    lng: lang,
                  })}`}
                  :{" "}
                  {moment(
                    new Date(dataGroup?.date_work_schedule[0]?.date)
                  ).format("DD/MM/YYYY")}
                </p>
                <p className="text-time">
                  -{`${i18n.t("time_work", { lng: lang })}`}:{" "}
                  {timeWork(dataGroup)}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <p className="title">
                {`${i18n.t("address", {
                  lng: lang,
                })}`}
                :
              </p>
              <p className="text-service">{dataGroup?.address}</p>
            </div>
            {dataGroup?.note && (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="title">
                  {`${i18n.t("note", {
                    lng: lang,
                  })}`}
                  : :
                </p>
                <p className="text-service">{dataGroup?.note}</p>
              </div>
            )}
            <div className="div-extra-service">
              <p className="title">
                {`${i18n.t("extra_service", { lng: lang })}`}:{" "}
              </p>
              {dataGroup?.service?.optional_service.map((item) => {
                return (
                  <div className="div-item-extra-service ml-2">
                    {item?._id === "632148d02bacd0aa8648657c"
                      ? item?.extend_optional?.map((item) => (
                          <p className="text-item">- {item?.title?.[lang]}</p>
                        ))
                      : null}
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <p className="title">
                {`${i18n.t("payment", {
                  lng: lang,
                })}`}
                :{" "}
              </p>
              <p className="text-service">
                {dataGroup?.payment_method === "cash"
                  ? `${i18n.t("cash", { lng: lang })}`
                  : "G-point"}
              </p>
            </div>
            <div className="div-price">
              <p className="title">
                {`${i18n.t("provisional", { lng: lang })}`}:
              </p>
              <div className="detail-price">
                <div className="div-total">
                  <p className="text-money">
                    -{" "}
                    {`${i18n.t("provisional_price", {
                      lng: lang,
                    })}`}
                    :
                  </p>
                  <p className="text-money">
                    {formatMoney(dataGroup?.initial_fee)}
                  </p>
                </div>
                <div className="div-total">
                  <p className="text-money">
                    - {`${i18n.t("system_fee", { lng: lang })}`}:
                  </p>
                  {dataGroup?.service_fee?.map((item) => (
                    <p className="text-money">+{formatMoney(item?.fee)}</p>
                  ))}
                </div>
                {dataGroup?.code_promotion && (
                  <div className="div-total-promo">
                    <p style={{ margin: 0 }}>
                      - {`${i18n.t("promotion", { lng: lang })}`}:
                    </p>
                    <div className="div-promo">
                      <p className="text-money">
                        + {`${i18n.t("code", { lng: lang })}`}:{" "}
                        {dataGroup?.code_promotion?.code}
                      </p>
                      <p style={{ color: "red", marginLeft: 5, margin: 0 }}>
                        {formatMoney(-dataGroup?.code_promotion?.discount)}
                      </p>
                    </div>
                  </div>
                )}
                {dataGroup?.event_promotion && (
                  <div className="div-event-promo">
                    <p className="text-programme">
                      - {`${i18n.t("programme", { lng: lang })}`}:
                    </p>
                    <div className="div-price-event">
                      {dataGroup?.event_promotion.map((item, key) => {
                        return (
                          <p className="text-event-discount">
                            {formatMoney(-item?.discount)}
                          </p>
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
                                <p style={{ margin: 0 }}>
                                  - {item?.title?.[lang]}
                                </p>
                                <p style={{ margin: 0 }}>
                                  {" "}
                                  +{formatMoney(item?.price)}
                                </p>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
                <div className="div-total">
                  <p className="title">
                    - {`${i18n.t("total_money", { lng: lang })}`}:{" "}
                  </p>
                  <p className="title">{formatMoney(dataGroup?.final_fee)}</p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <p className="title">{`${i18n.t("status", { lng: lang })}`}: </p>
              {dataGroup?.status === "pending" ? (
                <p className="text-pending ">{`${i18n.t("pending", {
                  lng: lang,
                })}`}</p>
              ) : dataGroup?.status === "confirm" ? (
                <p className="text-confirm">{`${i18n.t("confirm", {
                  lng: lang,
                })}`}</p>
              ) : dataGroup?.status === "doing" ? (
                <p className="text-doing">{`${i18n.t("doing", {
                  lng: lang,
                })}`}</p>
              ) : dataGroup?.status === "done" ? (
                <p className="text-done">{`${i18n.t("complete", {
                  lng: lang,
                })}`}</p>
              ) : (
                <p className="text-cancel">{`${i18n.t("cancel", {
                  lng: lang,
                })}`}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {dataActivity?.length > 0 && (
        <div className="ml-3">
          <div className="div-title">
            <p className="text-title">{`${i18n.t("work_with_order", {
              lng: lang,
            })}`}</p>
          </div>
          <div>
            {dataActivity?.map((item, index) => {
              const money = item?.value?.toString();
              const subject = item?.id_user_system
                ? item?.title_admin.replace(
                    item?.id_user_system?._id,
                    item?.id_user_system?.full_name
                  )
                : item?.id_admin_action
                ? item?.title_admin.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_customer
                ? item?.title_admin.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_collaborator
                ? item?.title_admin.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.title_admin.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.code
                  );

              const predicate = item?.id_punish
                ? subject.replace(
                    item?.id_punish?._id,
                    item?.id_punish?.note_admin
                  )
                : item?.id_reason_punish
                ? subject.replace(
                    item?.id_reason_punish?._id,
                    item?.id_reason_punish?.title?.vi
                  )
                : item?.id_order
                ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
                : item?.id_reward
                ? subject.replace(
                    item?.id_reward?._id,
                    item?.id_reward?.title?.vi
                  )
                : item?.id_info_reward_collaborator
                ? subject.replace(
                    item?.id_info_reward_collaborator?._id,
                    item?.id_info_reward_collaborator?.id_reward_collaborator
                      ?.title?.vi
                  )
                : item?.id_transistion_collaborator
                ? subject.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
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
                : item?.id_promotion
                ? subject.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.title?.vi
                  )
                : item?.id_admin_action
                ? subject.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_address
                ? subject.replace(item?.id_address, item?.value_string)
                : subject.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );

              const object = item?.id_reason_cancel
                ? predicate.replace(
                    item?.id_reason_cancel?._id,
                    item?.id_reason_cancel?.title?.vi
                  )
                : item?.id_collaborator
                ? predicate.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? predicate.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_address
                ? predicate.replace(item?.id_address, item?.value_string)
                : item?.id_order
                ? predicate.replace(
                    item?.id_order?._id,
                    item?.id_order?.id_view
                  )
                : item?.id_transistion_collaborator
                ? predicate.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : predicate.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );
              return (
                <div key={index} className="div-item-list">
                  <div className="div-name">
                    <p className="text-title">{object}</p>
                    <p
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
                    </p>
                  </div>
                  <p style={{ margin: 0 }}>
                    {moment(new Date(item?.date_create)).format(
                      "DD/MM/yyy - HH:mm"
                    )}
                  </p>
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
