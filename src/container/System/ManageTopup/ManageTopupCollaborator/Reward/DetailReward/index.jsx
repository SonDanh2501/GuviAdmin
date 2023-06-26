import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailInfoRewardApi } from "../../../../../../api/topup";
import { Table } from "antd";
import "./styles.scss";
import moment from "moment";
import { formatMoney } from "../../../../../../helper/formatMoney";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";

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
  }, []);

  const columns = [
    {
      title: `${i18n.t("code_order", { lng: lang })}`,
      render: (data) => (
        <Link to={`/details-order/${data?.id_group_order}`}>
          <a className="text-id-reward">{data?.id_view}</a>
        </Link>
      ),
    },
    {
      title: `${i18n.t("date_work", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-time-detail-reward">
            <a className="text-time">
              {moment(data?.date_work).format("DD-MM-YYYY")}
            </a>
            <a className="text-time">
              {moment(data?.date_work).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("total_money", { lng: lang })}`,
      render: (data) => <a>{formatMoney(data?.final_fee)}</a>,
    },
    {
      title: `${i18n.t("time_work", { lng: lang })}`,
      render: (data) => <a>{data?.total_estimate} giờ</a>,
    },
  ];

  return (
    <div>
      <a className="title-reward">
        {`${i18n.t("details_affiliate_bonus", { lng: lang })}`}
      </a>
      <div className="div-total-detail-reward">
        <a className="text-total">
          {`${i18n.t("collaborator", { lng: lang })}`}:{" "}
          {data?.id_collaborator?.full_name}
        </a>
        <a className="text-total">
          {`${i18n.t("bonus_money", { lng: lang })}`}:{" "}
          {formatMoney(data?.money ? data?.money : 0)}
        </a>
        <a className="text-total">
          {`${i18n.t("total_order", { lng: lang })}`}: {data?.total_order}
        </a>
        <a className="text-total">
          {`${i18n.t("total_hour", { lng: lang })}`}: {data?.total_job_hour}
        </a>
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
