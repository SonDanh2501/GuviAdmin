import { FloatButton, Select, Tabs } from "antd";

import "./index.scss";

import { useEffect, useState } from "react";
import UserManage from "./TableCustomer/UserManage";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
import { getGroupCustomer } from "../../../../redux/selectors/customer";
import { getGroupCustomerApi } from "../../../../api/promotion";
import { useCookies } from "../../../../helper/useCookies";
import useWindowDimensions from "../../../../helper/useWindowDimensions";

const ManageCustomer = () => {
  const [status, setStatus] = useState("");
  const lang = useSelector(getLanguageState);
  const [dataGroup, setDataGroup] = useState([]);
  const [idGroup, setIdGroup] = useState("all");
  const dataTab = [{ value: "all", label: "Tất cả" }];
  const [saveToCookie, readCookie] = useCookies();
  const { width } = useWindowDimensions();

  useEffect(() => {
    setIdGroup(readCookie("tab-kh") === "" ? "all" : readCookie("tab-kh"));
    getGroupCustomerApi(0, 20)
      .then((res) => {
        setDataGroup(res?.data);
      })
      .catch((err) => {});
  }, []);

  dataGroup?.map((item) => {
    dataTab.push({
      value: item?._id,
      label: item?.name,
    });
  });

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("member");
    } else if (active === "3") {
      setStatus("silver");
    } else if (active === "4") {
      setStatus("gold");
    } else if (active === "5") {
      setStatus("platinum");
    } else if (active === "6") {
      setStatus("birthday");
    } else if (active === "7") {
      setStatus("block");
    } else {
      setStatus("");
    }
  };

  return (
    <>
      <div className="div-header-customer">
        <a className="title-cv">{`${i18n.t("list_customer", {
          lng: lang,
        })}`}</a>
      </div>

      <div className="div-container-customer">
        {width > 900 ? (
          <div className="div-tab-customer">
            {dataTab?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    idGroup === item?.value
                      ? "div-item-tab-select"
                      : "div-item-tab"
                  }
                  onClick={() => {
                    setIdGroup(item?.value);
                    saveToCookie("tab-kh", item?.value);
                  }}
                >
                  <a className="text-tab">{item?.label}</a>
                </div>
              );
            })}
          </div>
        ) : (
          <Select
            options={dataTab}
            value={idGroup}
            onChange={(e) => {
              setIdGroup(e);
              saveToCookie("tab-kh", e);
            }}
          />
        )}

        <div className="mt-3">
          <UserManage status={status} idGroup={idGroup} />
        </div>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCustomer;
