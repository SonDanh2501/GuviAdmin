import { DatePicker, Select, Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRevenueCollaboratorApi } from "../../../../api/topup";
import { formatMoney } from "../../../../helper/formatMoney";
import Punish from "./Punish";
import TopupCollaborator from "./Topup";
import "./TopupManage.scss";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import RewardCollaborator from "./Reward";
import i18n from "../../../../i18n";
const { RangePicker } = DatePicker;
const { Option } = Select;

const TopupManage = () => {
  const [type, setType] = useState("all");
  const [totalTopup, setTotalTopup] = useState("");
  const [totalWithdraw, setTotalWithdraw] = useState("");
  const [totalPunish, setTotalPunish] = useState("");
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getRevenueCollaboratorApi(
      moment().startOf("year").toISOString(),
      moment().toISOString()
    )
      .then((res) => {
        setTotalPunish(res?.totalPunish);
        setTotalWithdraw(res?.totalWithdraw);
        setTotalTopup(res?.totalTopUp);
      })
      .catch((err) => {});
  }, [dispatch]);

  const onChangeTab = (active) => {
    if (active === "2") {
      setType("top_up");
    } else if (active === "3") {
      setType("withdraw");
    } else if (active === "1") {
      setType("all");
    }
  };

  return (
    <React.Fragment>
      <div className="div-total">
        <a className="total-revenue">
          {`${i18n.t("total_revenue", { lng: lang })}`}:
          <a className="text-money-revenue">
            <i class="uil uil-arrow-up icon-up"></i>
            {formatMoney(totalTopup)}
          </a>
        </a>
        <a className="total-expenditure">
          {`${i18n.t("total_expenditure", { lng: lang })}`}:
          <a className="text-money-expenditure">
            <i class="uil uil-arrow-down icon-down"></i>
            {formatMoney(totalWithdraw)}
          </a>
        </a>
        <a className="total-expenditure">
          {`${i18n.t("total_fines", { lng: lang })}`}:
          <a className="text-money-expenditure">{formatMoney(totalPunish)}</a>
        </a>
      </div>
      <div>
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab={`${i18n.t("all", { lng: lang })}`} key="1">
            <TopupCollaborator type={type} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("topup", { lng: lang })}`} key="2">
            <TopupCollaborator type={type} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("withdraw", { lng: lang })}`} key="3">
            <TopupCollaborator type={type} />
          </Tabs.TabPane>
          {checkElement?.includes("get_punish_cash_book_collaborator") && (
            <Tabs.TabPane
              tab={`${i18n.t("monetary_fine", { lng: lang })}`}
              key="4"
            >
              <Punish />
            </Tabs.TabPane>
          )}
          {checkElement?.includes("get_reward_cash_book_collaborator") && (
            <Tabs.TabPane
              tab={`${i18n.t("bonus_money", { lng: lang })}`}
              key="5"
            >
              <RewardCollaborator />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </React.Fragment>
  );
};

export default TopupManage;
