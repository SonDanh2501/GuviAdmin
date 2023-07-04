import { Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailsHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";

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
      <h5 className="mt-3">{`${i18n.t("detail_activity", { lng: lang })}`}</h5>
      {show && (
        <div>
          <div className="div-title">
            <a className="text-title">{`${i18n.t("order_detail", {
              lng: lang,
            })}`}</a>
          </div>
          <div className="div-details-service mt-2">
            <a className="title">
              {`${i18n.t("service", { lng: lang })}`}:{" "}
              <a className="text-service">
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
              </a>
            </a>
            <div className="div-datework">
              <a className="title">
                {`${i18n.t("time", {
                  lng: lang,
                })}`}
                :{" "}
              </a>
              <div className="div-times ml-2">
                <a>
                  -
                  {`${i18n.t("date_work", {
                    lng: lang,
                  })}`}
                  :{" "}
                  {moment(
                    new Date(dataGroup?.date_work_schedule[0]?.date)
                  ).format("DD/MM/YYYY")}
                </a>
                <a>
                  -{`${i18n.t("time_work", { lng: lang })}`}:{" "}
                  {timeWork(dataGroup)}
                </a>
              </div>
            </div>
            <a className="title">
              {`${i18n.t("address", {
                lng: lang,
              })}`}
              : <a className="text-service">{dataGroup?.address}</a>
            </a>
            {dataGroup?.note && (
              <a className="title">
                {`${i18n.t("note", {
                  lng: lang,
                })}`}
                : <a className="text-service">{dataGroup?.note}</a>
              </a>
            )}
            <div className="div-extra-service">
              <a className="title">
                {`${i18n.t("extra_service", { lng: lang })}`}:{" "}
              </a>
              {dataGroup?.service?.optional_service.map((item) => {
                return (
                  <div className="div-item-extra-service ml-2">
                    {item?._id === "632148d02bacd0aa8648657c"
                      ? item?.extend_optional?.map((item) => (
                          <a>- {item?.title?.[lang]}</a>
                        ))
                      : null}
                  </div>
                );
              })}
            </div>

            <a className="title">
              {`${i18n.t("payment", {
                lng: lang,
              })}`}
              :{" "}
              <a className="text-service">
                {dataGroup?.payment_method === "cash"
                  ? `${i18n.t("cash", { lng: lang })}`
                  : "G-point"}
              </a>
            </a>
            <div className="div-price">
              <a className="title">
                {`${i18n.t("provisional", { lng: lang })}`}:
              </a>
              <div className="detail-price">
                <div className="div-total">
                  <a>
                    -{" "}
                    {`${i18n.t("provisional_price", {
                      lng: lang,
                    })}`}
                    :
                  </a>
                  <a>{formatMoney(dataGroup?.initial_fee)}</a>
                </div>
                <div className="div-total">
                  <a>- {`${i18n.t("system_fee", { lng: lang })}`}:</a>
                  {dataGroup?.service_fee?.map((item) => (
                    <a>+{formatMoney(item?.fee)}</a>
                  ))}
                </div>
                {dataGroup?.code_promotion && (
                  <div className="div-total-promo">
                    <a>- {`${i18n.t("promotion", { lng: lang })}`}:</a>
                    <div className="div-promo">
                      <a>
                        + {`${i18n.t("code", { lng: lang })}`}:{" "}
                        {dataGroup?.code_promotion?.code}
                      </a>
                      <a style={{ color: "red", marginLeft: 5 }}>
                        {formatMoney(-dataGroup?.code_promotion?.discount)}
                      </a>
                    </div>
                  </div>
                )}
                {dataGroup?.event_promotion && (
                  <div className="div-event-promo">
                    <a>- {`${i18n.t("programme", { lng: lang })}`}:</a>
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
                                <a>- {item?.title?.[lang]}</a>
                                <a> +{formatMoney(item?.price)}</a>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
                <div className="div-total">
                  <a className="title">
                    - {`${i18n.t("total_money", { lng: lang })}`}:{" "}
                  </a>
                  <a className="title">{formatMoney(dataGroup?.final_fee)}</a>
                </div>
              </div>
            </div>

            <a className="title">
              {`${i18n.t("status", { lng: lang })}`}:{" "}
              {dataGroup?.status === "pending" ? (
                <a className="text-pending ">{`${i18n.t("pending", {
                  lng: lang,
                })}`}</a>
              ) : dataGroup?.status === "confirm" ? (
                <a className="text-confirm">{`${i18n.t("confirm", {
                  lng: lang,
                })}`}</a>
              ) : dataGroup?.status === "doing" ? (
                <a className="text-doing">{`${i18n.t("doing", {
                  lng: lang,
                })}`}</a>
              ) : dataGroup?.status === "done" ? (
                <a className="text-done">{`${i18n.t("complete", {
                  lng: lang,
                })}`}</a>
              ) : (
                <a className="text-cancel">{`${i18n.t("cancel", {
                  lng: lang,
                })}`}</a>
              )}
            </a>
          </div>
        </div>
      )}

      {dataActivity?.length > 0 && (
        <div className="ml-3">
          <div className="div-title">
            <a className="text-title">{`${i18n.t("work_with_order", {
              lng: lang,
            })}`}</a>
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
                  <a>
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
