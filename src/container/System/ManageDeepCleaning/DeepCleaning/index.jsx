import { Tabs } from "antd";
import { useEffect, useState } from "react";

import "./index.scss";
import TableDeepCleaning from "./TableDeepCleaning";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import i18n from "../../../../i18n";

const DeepCleaning = () => {
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const lang = useSelector(getLanguageState);

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("pending");
      setCurrentPage(1);
      setStartPage(0);
    } else if (active === "3") {
      setStatus("done");
      setCurrentPage(1);
      setStartPage(0);
    } else if (active === "4") {
      setStatus("cancel");
      setCurrentPage(1);
      setStartPage(0);
    } else {
      setStatus("all");
      setCurrentPage(1);
      setStartPage(0);
    }
  };
  return (
    <div>
      <Tabs defaultActiveKey="1" size="small" onChange={onChangeTab}>
        <Tabs.TabPane tab={`${i18n.t("all", { lng: lang })}`} key="1">
          <TableDeepCleaning
            status={status}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            startPage={startPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("pending", { lng: lang })}`} key="2">
          <TableDeepCleaning
            status={status}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            startPage={startPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("complete", { lng: lang })}`} key="3">
          <TableDeepCleaning
            status={status}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            startPage={startPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("cancel_modal", { lng: lang })}`} key="4">
          <TableDeepCleaning
            status={status}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            startPage={startPage}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default DeepCleaning;
