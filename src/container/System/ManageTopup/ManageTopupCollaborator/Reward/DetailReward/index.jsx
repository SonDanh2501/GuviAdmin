import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetailInfoRewardApi } from "../../../../../../api/topup";
import { Table } from "antd";
import "./styles.scss";
import moment from "moment";
import { formatMoney } from "../../../../../../helper/formatMoney";

const DetailReward = () => {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState([]);

  useEffect(() => {
    getDetailInfoRewardApi(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: "Mã đơn",
      render: (data) => (
        <Link to={`/details-order/${data?.id_group_order}`}>
          <a className="text-id-reward">{data?.id_view}</a>
        </Link>
      ),
    },
    {
      title: "Ngày làm",
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
      title: "Tổng tiền",
      render: (data) => <a>{formatMoney(data?.final_fee)}</a>,
    },
    {
      title: "Giờ làm",
      render: (data) => <a>{data?.total_estimate} giờ</a>,
    },
  ];

  return (
    <div>
      <a className="title-reward">Chi tiết thưởng tiền CTV</a>
      <div className="div-total-detail-reward">
        <a className="text-total">
          Tên CTV: {data?.id_collaborator?.full_name}
        </a>
        <a className="text-total">
          Tiền thưởng: {formatMoney(data?.money ? data?.money : 0)}
        </a>
        <a className="text-total">Tổng đơn làm: {data?.total_order}</a>
        <a className="text-total">Tổng giờ làm: {data?.total_job_hour}</a>
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
