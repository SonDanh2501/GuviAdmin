import { Pagination } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCollaboratorRemainder,
  getHistoryCollaboratorRemainder,
} from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";

const History = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [remainder, setRemainder] = useState(0);
  // const [giftRemainder, setGiftRemainder] = useState(0);
  const [work_wallet, setWorkWallet] = useState(0);
  const [collaborator_wallet, setCollaboratorWallet] = useState(0);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getHistoryCollaboratorRemainder(id, 0, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });

    getCollaboratorRemainder(id)
      .then((res) => {
        setWorkWallet(res?.work_wallet);
        setCollaboratorWallet(res?.collaborator_wallet);

        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dispatch]);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 10 ? 10 : data.length;
    const start = page * dataLength - dataLength;
    getHistoryCollaboratorRemainder(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="div-monney">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p className="text-title-monney">
            {`${i18n.t("work_wallet", { lng: lang })}`}:
          </p>
          <p className="text-monney"> {formatMoney(work_wallet)}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p className="text-title-monney">
            {`${i18n.t("collaborator_wallet", { lng: lang })}`}:{" "}
          </p>
          <p className="text-monney">{formatMoney(collaborator_wallet)}</p>
        </div>
      </div>
      <div className="div-list-collaborator mt-3">
        {data?.map((item, index) => {
          const money = item?.value?.toString();
          return (
            <div className="div-item-list" key={index}>
              <div className="div-column-1">
                <p className="text-title">
                  {item?.title?.[lang]}{" "}
                  <p className="text-title">
                    {item?.id_order && item?.id_order?.id_view}
                  </p>
                </p>
                <p
                  className={
                    money?.slice(0, 1) === "-"
                      ? "text-money-deduction"
                      : "text-money-plus"
                  }
                >
                  {money?.slice(0, 1) === "-"
                    ? formatMoney(item?.value)
                    : "+" + formatMoney(item?.value)}
                </p>
              </div>
              <p className="text-date-history">
                {moment(new Date(item?.date_create)).format(
                  "DD/MM/yyy - HH:mm"
                )}
              </p>

              {(item?.current_work_wallet !== 0 && item?.current_collaborator_wallet !== 0 ) ? (
                <>
                  <div className="div-surplus">
                    <div className="div-text-title-surplus">
                      <p className="text-title-surplus">{`${i18n.t("work_wallet", {
                        lng: lang,
                      })}`}</p>
                    </div>
                    <p style={{ margin: 0 }}>:</p>
                    <div className="div-money">
                      <p className="text-money">
                        {item?.current_work_wallet
                          ? formatMoney(item?.current_work_wallet)
                          : formatMoney(0)}
                      </p>
                    </div>
                    <div className="div-icon">
                      {item?.status_current_work_wallet === "down" ? (
                        <i class="uil uil-arrow-down icon-deduction"></i>
                      ) : item?.status_current_work_wallet === "up" ? (
                        <i class="uil uil-arrow-up icon-plus"></i>
                      ) : (
                        <i class="uil uil-minus icon-minus"></i>
                      )}
                    </div>
                  </div>
                  <div className="div-surplus">
                    <div className="div-text-title-surplus">
                      <p className="text-title-surplus">{`${i18n.t("collaborator_wallet", {
                        lng: lang,
                      })}`}</p>
                    </div>
                    <p style={{ margin: 0 }}>:</p>
                    <div className="div-money">
                      <p className="text-money">
                        {item?.current_collaborator_wallet
                          ? formatMoney(item?.current_collaborator_wallet)
                          : formatMoney(0)}
                      </p>
                    </div>
                    <div className="div-icon">
                      {item?.status_current_collaborator_wallet === "down" ? (
                        <i class="uil uil-arrow-down icon-deduction"></i>
                      ) : item?.status_current_collaborator_wallet === "up" ? (
                        <i class="uil uil-arrow-up icon-plus"></i>
                      ) : (
                        <i class="uil uil-minus icon-minus"></i>
                      )}
                    </div>
                  </div>
                </>

              ) : (
                <>
                  <div className="div-surplus">
                    <div className="div-text-title-surplus">
                      <p className="text-title-surplus">{`${i18n.t("wallet_ctv", {
                        lng: lang,
                      })}`}</p>
                    </div>
                    <p style={{ margin: 0 }}>:</p>
                    <div className="div-money">
                      <p className="text-money">
                        {item?.current_remainder
                          ? formatMoney(item?.current_remainder)
                          : formatMoney(0)}
                      </p>
                    </div>
                    <div className="div-icon">
                      {item?.status_current_remainder === "down" ? (
                        <i class="uil uil-arrow-down icon-deduction"></i>
                      ) : item?.status_current_remainder === "up" ? (
                        <i class="uil uil-arrow-up icon-plus"></i>
                      ) : (
                        <i class="uil uil-minus icon-minus"></i>
                      )}
                    </div>
                  </div>
                  <div className="div-surplus">
                    <div className="div-text-title-surplus">
                      <p className="text-title-surplus">{`${i18n.t("gift_wallet", {
                        lng: lang,
                      })}`}</p>
                    </div>
                    <p style={{ margin: 0 }}>:</p>
                    <div className="div-money">
                      <p className="text-money">
                        {item?.current_gift_remainder
                          ? formatMoney(item?.current_gift_remainder)
                          : formatMoney(0)}
                      </p>
                    </div>
                    <div className="div-icon">
                      {item?.status_current_gift_remainder === "down" ? (
                        <i class="uil uil-arrow-down icon-deduction"></i>
                      ) : item?.status_current_gift_remainder === "up" ? (
                        <i class="uil uil-arrow-up icon-plus"></i>
                      ) : (
                        <i class="uil uil-minus icon-minus"></i>
                      )}
                    </div>
                  </div>
                </>

              )}


            </div>
          );
        })}
      </div>
      <div className="div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {totalData}
        </p>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalData}
            showSizeChanger={false}
            pageSize={10}
          />
        </div>
      </div>
    </>
  );
};

export default memo(History);
