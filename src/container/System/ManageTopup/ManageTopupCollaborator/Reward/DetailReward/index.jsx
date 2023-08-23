import { Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getDetailInfoRewardApi } from "../../../../../../api/topup";
import { formatMoney } from "../../../../../../helper/formatMoney";
import i18n from "../../../../../../i18n";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import "./styles.scss";

const DetailReward = () => {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState([]);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getDetailInfoRewardApi(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, [id]);

  const columns = [
    {
      title: () => (
        <p className="title-column">{`${i18n.t("code_order", {
          lng: lang,
        })}`}</p>
      ),
      render: (data) => (
        <Link to={`/details-order/${data?.id_group_order}`}>
          <p className="text-id-reward">{data?.id_view}</p>
        </Link>
      ),
    },
    {
      title: () => (
        <p className="title-column">{`${i18n.t("date_work", {
          lng: lang,
        })}`}</p>
      ),
      render: (data) => {
        return (
          <div className="div-time-detail-reward">
            <p className="text-time">
              {moment(data?.date_work).format("DD-MM-YYYY")}
            </p>
            <p className="text-time">
              {moment(data?.date_work).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => (
        <p className="title-column">{`${i18n.t("total_money", {
          lng: lang,
        })}`}</p>
      ),
      render: (data) => (
        <p className="text-money-reward">{formatMoney(data?.final_fee)}</p>
      ),
    },
    {
      title: () => (
        <p className="title-column">{`${i18n.t("time_work", {
          lng: lang,
        })}`}</p>
      ),
      render: (data) => (
        <p className="text-money-reward"> {data?.total_estimate} giờ</p>
      ),
    },
  ];

  return (
    <div>
      <p className="title-reward">
        {`${i18n.t("details_affiliate_bonus", { lng: lang })}`}
      </p>
      <div className="div-total-detail-reward">
        <p className="text-total">
          {`${i18n.t("collaborator", { lng: lang })}`}:{" "}
          {data?.id_collaborator?.full_name}
        </p>
        <p className="text-total">
          {`${i18n.t("bonus_money", { lng: lang })}`}:{" "}
          {formatMoney(data?.money ? data?.money : 0)}
        </p>
        <p className="text-total">
          {`${i18n.t("total_order", { lng: lang })}`}: {data?.total_order}
        </p>
        <p className="text-total">
          {`${i18n.t("total_hour", { lng: lang })}`}: {data?.total_job_hour}
        </p>
      </div>

      <div className="mt-3">
        <Table
          dataSource={data?.id_order}
          pagination={false}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default DetailReward;
