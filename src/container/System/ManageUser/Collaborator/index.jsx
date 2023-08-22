import { FloatButton, Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "../../../../helper/useCookies";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import CollaboratorManage from "./TableCollaborator/CollaboratorManage";
import "./index.scss";

const ManageCollaborator = () => {
  const [status, setStatus] = useState("online");
  const [saveToCookie, readCookie] = useCookies();
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    setStatus(
      readCookie("tab_collaborator") === "online" ||
        readCookie("tab_collaborator") === ""
        ? "online"
        : readCookie("tab_collaborator")
    );
  }, []);

  const DATA = [
    {
      label: `${i18n.t("active", {
        lng: lang,
      })}`,
      value: "online",
    },
    {
      label: `${i18n.t("all", {
        lng: lang,
      })}`,
      value: "all",
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
        <p className="title-cv">{`${i18n.t("collaborator_list", {
          lng: lang,
        })}`}</p>
      </div>

      <div className="div-container-collaborator">
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
                  <p className="text-tab">{item?.label}</p>
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
