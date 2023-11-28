import { useNavigate } from "react-router-dom";
import "./index.scss";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import React from "react"
import i18n from "../../../i18n";

const MamageReportCollaborator = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();


  const cardItemReport = [
    {
      title: "Báo cáo đơn hàng theo cộng tác viên",
      detail: "Báo cáo chi tiết từng ca làm của cộng tác viên",
      linkNavigate: "/report/manage-report/report-order-by-collaborator",
      checkPermition: "order_report"
    },
  ]


  
  
  const ItemReport = ({ title, detail, linkNavigate, checkPermition }) => {
    return (
      <React.Fragment>
         {checkElement?.includes(checkPermition) && (
        <div className="div-item-report">
        {/* <p className="text-title">{`${i18n.t(`${titleI18n}`, {
          lng: lang,
        })}`}</p> */}

        <p className="text-title">{title}</p>

        <p className="text-details">
          {detail}
        </p>

        {/* <p className="text-details">
          {`${i18n.t(`${detailI18n}`, { lng: lang })}`}
        </p> */}

        <p
          className="text-see-report"
          onClick={() => navigate(linkNavigate)}
        >
          {`${i18n.t("see_report", { lng: lang })}`}
        </p>
      </div>
         )}
      </React.Fragment>
    )
  }

  return (
    <div className="container-report-order-item">
      {cardItemReport?.map((item, index) => {
        return (
          // <ItemReport titleI18n={item.titleI18n} detailI18n={item.detailI18n} linkNavigate={item.linkNavigate} checkPermition={item.checkPermition} />
          <ItemReport title={item.title} detail={item.detail} linkNavigate={item.linkNavigate} checkPermition={item.checkPermition} />
        )
      })}
    </div>
  );
};

export default MamageReportCollaborator;
