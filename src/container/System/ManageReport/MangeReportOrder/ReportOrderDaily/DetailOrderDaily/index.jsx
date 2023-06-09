import { useLocation } from "react-router-dom";
import "./index.scss";
import moment from "moment";
import { useEffect } from "react";
import { getReportOrder } from "../../../../../../api/report";

const ReportDetailOrderDaily = () => {
  const { state } = useLocation();
  const { date } = state;

  useEffect(() => {
    getReportOrder(
      0,
      20,
      moment(date).startOf("date").toISOString(),
      moment(date).endOf("date").toISOString(),
      ""
    )
      .then((res) => {})
      .catch((err) => {});
  }, [date]);

  return <div></div>;
};

export default ReportDetailOrderDaily;
