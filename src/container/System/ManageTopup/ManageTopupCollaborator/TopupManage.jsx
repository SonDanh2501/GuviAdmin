import { Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRevenueCollaboratorApi } from "../../../../api/topup";
import { formatMoney } from "../../../../helper/formatMoney";
import { useCookies } from "../../../../helper/useCookies";
import i18n from "../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import Punish from "./Punish";
import RewardCollaborator from "./Reward";
import TopupCollaborator from "./Topup";
import "./TopupManage.scss";

const TopupManage = () => {
  const [type, setType] = useState("all");
  const [totalTopup, setTotalTopup] = useState("");
  const [totalWithdraw, setTotalWithdraw] = useState("");
  const [totalPunish, setTotalPunish] = useState("");
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [saveToCookie, readCookie] = useCookies();
  const [activeKey, setActiveKey] = useState("1");

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
    setActiveKey(
      readCookie("tab_ctv_topup") === "" ? "1" : readCookie("tab_ctv_topup")
    );
  }, [dispatch]);

  const onChangeTab = (active) => {
    setActiveKey(active);
    saveToCookie("tab_ctv_topup", active);
    if (active === "2") {
      setType("top_up");
    } else if (active === "3") {
      setType("withdraw");
    } else if (active === "1") {
      setType("all");
    }
  };

  return (
    <>
      <div className="div-total">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p className="total-revenue">
            {`${i18n.t("total_revenue", { lng: lang })}`}:
          </p>
          <p className="text-money-revenue">
            <i class="uil uil-arrow-up icon-up"></i>
            {formatMoney(totalTopup)}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p className="total-expenditure">
            {`${i18n.t("total_expenditure", { lng: lang })}`}:
          </p>
          <p className="text-money-expenditure">
            <i class="uil uil-arrow-down icon-down"></i>
            {formatMoney(totalWithdraw)}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p className="total-expenditure">
            {`${i18n.t("total_fines", { lng: lang })}`}:
          </p>
          <p className="text-money-expenditure">{formatMoney(totalPunish)}</p>
        </div>
      </div>
      <div>
        <Tabs activeKey={activeKey} size="small" onChange={onChangeTab}>
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
    </>
  );
};

export default TopupManage;
