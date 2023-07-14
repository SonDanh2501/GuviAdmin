import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getReportBalanceCollaborator } from "../../../api/finance";
import CustomDatePicker from "../../../components/customDatePicker";
import LoadingPagination from "../../../components/paginationLoading";
import { formatMoney } from "../../../helper/formatMoney";
import { errorNotify } from "../../../helper/toast";
import i18n from "../../../i18n";
import { getLanguageState } from "../../../redux/selectors/auth";
import "./index.scss";
const width = window.innerWidth;

const ManageFinance = () => {
  const [totalEndingRemainder, setTotalEndingRemainder] = useState(0);
  const [totalOpeningRemainder, setTotalOpeningRemainder] = useState(0);
  const [totalEndingGiftRemainder, setTotalEndingGiftRemainder] = useState(0);
  const [totalOpeningGiftRemainder, setTotalOpeningGiftRemainder] = useState(0);
  const [totalEndingPayPoint, setTotalEndingPayPoint] = useState(0);
  const [totalOpeningPayPoint, setTotalOpeningPayPoint] = useState(0);
  const [startDate, setStartDate] = useState(
    moment().startOf("month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getReportBalanceCollaborator(0, 20, startDate, endDate)
      .then((res) => {
        setTotalOpeningRemainder(res?.total_opening_remainder);
        setTotalEndingRemainder(res?.total_ending_remainder);
        setTotalOpeningGiftRemainder(res?.total_opening_gift_remainder);
        setTotalEndingGiftRemainder(res?.total_ending_gift_remainder);
        setTotalOpeningPayPoint(res?.total_opening_pay_point);
        setTotalEndingPayPoint(res?.total_ending_pay_point);
      })
      .catch((err) => {});
  }, []);

  const onChangeDay = () => {
    setIsLoading(true);
    getReportBalanceCollaborator(0, 20, startDate, endDate)
      .then((res) => {
        setIsLoading(false);
        setTotalOpeningRemainder(res?.total_opening_remainder);
        setTotalEndingRemainder(res?.total_ending_remainder);
        setTotalOpeningGiftRemainder(res?.total_opening_gift_remainder);
        setTotalEndingGiftRemainder(res?.total_ending_gift_remainder);
        setTotalOpeningPayPoint(res?.total_opening_pay_point);
        setTotalEndingPayPoint(res?.total_ending_pay_point);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <h5>{`${i18n.t("wallet_balance", { lng: lang })}`}</h5>
      <div className="div-date">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
        />
        {startDate && (
          <a className="text-date">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(new Date(endDate)).format("DD/MM/YYYY")}
          </a>
        )}
      </div>
      <div className="div-contai-wallet">
        <a className="text-beginnig">{`${i18n.t("beginning", {
          lng: lang,
        })}`}</a>
        <div className="div-wallet-row">
          <div className="div-item-wallet">
            <a className="text-name-wallet">{`${i18n.t(
              "main_wallet_collaborator",
              { lng: lang }
            )}`}</a>
            <a className="text-money-remainder">
              {formatMoney(totalOpeningRemainder)}
            </a>
          </div>
          <div className="div-item-wallet">
            <a className="text-name-wallet">{`${i18n.t(
              "collaborator_gift_wallet",
              { lng: lang }
            )}`}</a>
            <a className="text-money-gift">
              {formatMoney(totalOpeningGiftRemainder)}
            </a>
          </div>
          <div className="div-item-wallet-last">
            <a className="text-name-wallet">{`${i18n.t("customer_wallet", {
              lng: lang,
            })}`}</a>
            <a className="text-money-paypoint">
              {formatMoney(totalOpeningPayPoint)}
            </a>
          </div>
        </div>
      </div>
      <div className="div-contai-wallet mt-3">
        <a className="text-beginnig">{`${i18n.t("end_of_term", {
          lng: lang,
        })}`}</a>
        <div className="div-wallet-row">
          <div className="div-item-wallet">
            <a className="text-name-wallet">{`${i18n.t(
              "main_wallet_collaborator",
              { lng: lang }
            )}`}</a>
            <a className="text-money-remainder">
              {formatMoney(totalEndingRemainder)}
            </a>
          </div>
          <div className="div-item-wallet">
            <a className="text-name-wallet">{`${i18n.t(
              "collaborator_gift_wallet",
              { lng: lang }
            )}`}</a>
            <a className="text-money-gift">
              {formatMoney(totalEndingGiftRemainder)}
            </a>
          </div>
          <div className="div-item-wallet-last">
            <a className="text-name-wallet">{`${i18n.t("customer_wallet", {
              lng: lang,
            })}`}</a>
            <a className="text-money-paypoint">
              {formatMoney(totalEndingPayPoint)}
            </a>
          </div>
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ManageFinance;
