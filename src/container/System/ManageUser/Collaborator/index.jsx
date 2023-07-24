import { FloatButton, Select, Tabs } from "antd";
import { useEffect, useState } from "react";
import CollaboratorManage from "./TableCollaborator/CollaboratorManage";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
import { useCookies } from "../../../../helper/useCookies";
import useWindowDimensions from "../../../../helper/useWindowDimensions";

const ManageCollaborator = () => {
  const [status, setStatus] = useState("");
  const [saveToCookie, readCookie] = useCookies();
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    setStatus(readCookie("tab_collaborator"));
  }, []);

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("online");
    } else if (active === "3") {
      setStatus("offline");
    } else if (active === "4") {
      setStatus("locked");
    } else if (active === "5") {
      setStatus("verify");
    } else if (active === "6") {
      setStatus("not_verify");
    } else {
      setStatus("");
    }
  };
  const DATA = [
    {
      label: `${i18n.t("all", {
        lng: lang,
      })}`,
      value: "",
    },
    {
      label: `${i18n.t("active", {
        lng: lang,
      })}`,
      value: "online",
    },
    {
      label: `${i18n.t("locked", {
        lng: lang,
      })}`,
      value: "locked",
    },
    {
      label: `${i18n.t("unconfirmed", {
        lng: lang,
      })}`,
      value: "not_verify",
    },
  ];

  return (
    <>
      <div className="div-header-collaborator">
        <a className="title-cv">{`${i18n.t("collaborator_list", {
          lng: lang,
        })}`}</a>
      </div>

      <div className="div-container-collaborator">
        {/* <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab={`${i18n.t("all", { lng: lang })}`} key="1">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("active", { lng: lang })}`} key="2">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>

          <Tabs.TabPane tab={`${i18n.t("locked", { lng: lang })}`} key="4">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>

          <Tabs.TabPane tab={`${i18n.t("unconfirmed", { lng: lang })}`} key="6">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
        </Tabs> */}
        {width > 490 ? (
          <div className="div-tab-collaborator">
            {DATA?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setStatus(item?.value);
                    saveToCookie("tab_collaborator", item?.value);
                    saveToCookie("page_ctv", 1);
                    saveToCookie("start_page_ctv", 0);
                  }}
                  className={
                    status === item?.value
                      ? "div-item-tab-select"
                      : "div-item-tab"
                  }
                >
                  <a className="text-tab">{item?.label}</a>
                </div>
              );
            })}
          </div>
        ) : (
          <Select
            options={DATA}
            style={{ width: "100%" }}
            value={status}
            onChange={(e) => {
              setStatus(e);
              saveToCookie("tab_collaborator", e);
              saveToCookie("page_ctv", 1);
              saveToCookie("start_page_ctv", 0);
            }}
          />
        )}
        <div className="mt-3">
          <CollaboratorManage status={status} />
        </div>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCollaborator;
