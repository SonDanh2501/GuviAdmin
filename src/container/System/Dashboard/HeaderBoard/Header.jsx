// reactstrap components
import { useEffect, useState } from "react";
import { getTotalReportApi } from "../../../../api/statistic";
import add from "../../../../assets/images/add.png";
import collaborator from "../../../../assets/images/collaborator.png";
import customer from "../../../../assets/images/customer.png";
import revenues from "../../../../assets/images/revenues.png";
import { formatMoney } from "../../../../helper/formatMoney";
import i18n from "../../../../i18n";
import "./headerBoard.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { Col, Row } from "antd";

const Header = () => {
  const [dataTotal, setDataTotal] = useState([]);
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    getTotalReportApi("", "")
      .then((res) => setDataTotal(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container-header-board">
      <div className="card">
        <img src={customer} className="img" />
        <div className="div-details">
          <a className="text-title">{`${i18n.t("customer", {
            lng: lang,
          })}`}</a>
          <a className="text-detail">
            {!dataTotal?.total_customer ? 0 : dataTotal?.total_customer}
          </a>
        </div>
      </div>

      <div className="card">
        <img src={collaborator} className="img" />
        <div className="div-details">
          <a className="text-title">
            {`${i18n.t("collaborator", { lng: lang })}`}
          </a>
          <a className="text-detail">
            {!dataTotal?.total_collaborator ? 0 : dataTotal?.total_collaborator}
          </a>
        </div>
      </div>

      <div className="card">
        <img src={add} className="img" />
        <div className="div-details">
          <a className="text-title">{`${i18n.t("total_order", {
            lng: lang,
          })}`}</a>
          <a className="text-detail">
            {!dataTotal?.total_order ? 0 : dataTotal?.total_order}
          </a>
        </div>
      </div>

      <div className="card">
        <img src={revenues} className="img" />
        <div className="div-details">
          <a className="text-title"> {`${i18n.t("revenue", { lng: lang })}`}</a>
          <a className="text-detail">
            {formatMoney(
              !dataTotal?.total_revenue ? 0 : dataTotal?.total_revenue
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
