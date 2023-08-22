import { Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCollaboratorRemainder,
  getListTransitionByCollaborator,
  getTransitionDetailsCollaborator,
} from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";

const WithdrawTopup = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainder, setRemainder] = useState(0);
  const [giftRemainder, setGiftRemainder] = useState(0);
  const [topup, setTopup] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getCollaboratorRemainder(id)
      .then((res) => {
        setRemainder(res?.remainder);
        setGiftRemainder(res?.gift_remainder);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(loadingAction.loadingRequest(false));
      });
    getListTransitionByCollaborator(id, 0, 10)
      .then((res) => {
        setData(res?.data);
        setTotalData(res?.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });

    getTransitionDetailsCollaborator(id)
      .then((res) => {
        setTopup(res?.totalTopUp);
        setWithdraw(res?.totalWithdraw);
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
    getListTransitionByCollaborator(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => (
        <div className="div-time">
          <p className="text-time">
            {moment(new Date(data?.date_created)).format("DD/MM/YYYY")}
          </p>
          <p className="text-time">
            {moment(new Date(data?.date_created)).format("HH:mm")}
          </p>
        </div>
      ),
    },
    {
      title: `${i18n.t("money", { lng: lang })}`,
      render: (data) => (
        <p className="text-money-detail-ctv">{formatMoney(data?.money)}</p>
      ),
    },
    {
      title: `${i18n.t("withdraw_topup", { lng: lang })}`,
      render: (data) => {
        return (
          <>
            {data?.type_transfer === "top_up" ? (
              <div className="div-withdraw-topup">
                <i class="uil uil-money-insert icon-topup"></i>
                <p className="text-topup">{`${i18n.t("topup", {
                  lng: lang,
                })}`}</p>
              </div>
            ) : (
              <div className="div-withdraw-topup">
                <i class="uil uil-money-withdraw icon-withdraw"></i>
                <p className="text-withdraw">{`${i18n.t("withdraw", {
                  lng: lang,
                })}`}</p>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: `${i18n.t("content", { lng: lang })}`,
      dataIndex: "transfer_note",
    },
    {
      title: `${i18n.t("recharge_date", { lng: lang })}`,
      render: (data) => (
        <div className="div-time">
          <p className="text-time">
            {moment(new Date(data?.date_created)).format("DD/MM/yyy")}
          </p>
          <p className="text-time">
            {moment(new Date(data?.date_created)).format("HH:mm")}
          </p>
        </div>
      ),
    },
    {
      title: `${i18n.t("status", { lng: lang })}`,
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <p className="text-pending-topup">{`${i18n.t("processing", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "transfered" ? (
              <p className="text-transfered">{`${i18n.t("money_transferred", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "done" ? (
              <p className="text-done">{`${i18n.t("complete", {
                lng: lang,
              })}`}</p>
            ) : (
              <p className="text-cancel">{`${i18n.t("cancel", {
                lng: lang,
              })}`}</p>
            )}
          </div>
        );
      },
      width: "10%",
      align: "center",
    },
  ];

  return (
    <>
      <div className="div-head-customer">
        <div className="div-monney">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p className="text-title-monney">
              {`${i18n.t("wallet_ctv", { lng: lang })}`}:
            </p>
            <p className="text-monney"> {formatMoney(remainder)}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p className="text-title-monney">
              {`${i18n.t("gift_wallet", { lng: lang })}`}:{" "}
            </p>
            <p className="text-monney">{formatMoney(giftRemainder)}</p>
          </div>
        </div>
        <div className="div-monney">
          <div className="total-revenue">
            <p className="text">{`${i18n.t("total_topup", { lng: lang })}`}:</p>
            <p className="text-money-revenue">
              {formatMoney(topup)}
              <i class="uil uil-arrow-up icon-up"></i>
            </p>
          </div>
          <div className="total-expenditure">
            <p className="text">
              {`${i18n.t("total_withdraw", { lng: lang })}`}:
            </p>
            <p className="text-money-expenditure">
              {formatMoney(withdraw)}
              <i class="uil uil-arrow-down icon-down"></i>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: width < 900 ? 1000 : 0 }}
        />
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
          />
        </div>
      </div>
    </>
  );
};

export default memo(WithdrawTopup);
