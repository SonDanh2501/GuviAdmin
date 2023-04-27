import { DatePicker, Input, Select, Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../../../helper/formatMoney";
import {
  getRevenueCollaborator,
  getTopupCollaborator,
} from "../../../../redux/actions/topup";
import { getUser } from "../../../../redux/selectors/auth";
import {
  getRevenueCTV,
  getTopupCTV,
  totalExpenditureCTV,
  totalTopupCTV,
} from "../../../../redux/selectors/topup";
import TopupCollaborator from "./Topup";
import "./TopupManage.scss";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TopupManage() {
  const [type, setType] = useState("all");
  const revenue = useSelector(getRevenueCTV);
  const expenditure = useSelector(totalExpenditureCTV);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRevenueCollaborator.getRevenueCollaboratorRequest({
        startDate: moment().startOf("year").toISOString(),
        endDate: moment(new Date()).toISOString(),
      })
    );
  }, [dispatch]);

  console.log(moment(new Date()).toISOString());

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
            {formatMoney(revenue)}
          </a>
        </a>
        <a className="total-expenditure">
          Tổng chi:
          <a className="text-money-expenditure">
            <i class="uil uil-arrow-down icon-down"></i>
            {formatMoney(expenditure)}
          </a>
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
        </Tabs>
      </div>
    </React.Fragment>
  );
}
