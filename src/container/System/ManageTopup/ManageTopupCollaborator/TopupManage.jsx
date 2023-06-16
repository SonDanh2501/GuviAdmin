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
import { getElementState } from "../../../../redux/selectors/auth";
import RewardCollaborator from "./Reward";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TopupManage() {
  const [type, setType] = useState("all");
  const [totalTopup, setTotalTopup] = useState("");
  const [totalWithdraw, setTotalWithdraw] = useState("");
  const [totalPunish, setTotalPunish] = useState("");
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);

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
          Tổng thu:
          <a className="text-money-revenue">
            <i class="uil uil-arrow-up icon-up"></i>
            {formatMoney(totalTopup)}
          </a>
        </a>
        <a className="total-expenditure">
          Tổng chi:
          <a className="text-money-expenditure">
            <i class="uil uil-arrow-down icon-down"></i>
            {formatMoney(totalWithdraw)}
          </a>
        </a>
        <a className="total-expenditure">
          Tổng phạt:
          <a className="text-money-expenditure">{formatMoney(totalPunish)}</a>
        </a>
      </div>
      <div>
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab="Tất cả" key="1">
            <TopupCollaborator type={type} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Nạp tiền" key="2">
            <TopupCollaborator type={type} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rút tiền" key="3">
            <TopupCollaborator type={type} />
          </Tabs.TabPane>
          {checkElement?.includes("get_punish_cash_book_collaborator") && (
            <Tabs.TabPane tab="Phạt tiền" key="4">
              <Punish />
            </Tabs.TabPane>
          )}
          {checkElement?.includes("get_reward_cash_book_collaborator") && (
            <Tabs.TabPane tab="Thưởng tiền" key="5">
              <RewardCollaborator />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </React.Fragment>
  );
}
