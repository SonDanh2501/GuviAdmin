import { Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getTopupPointCustomerApi } from "../../../../../api/topup";

const TopupPoint = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();

  useEffect(() => {
    getTopupPointCustomerApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      title: "Tên",
      render: (data) => {
        return (
          <div>
            <a>{data?.name_customer}</a>
            <a>{data?.phone_customer}</a>
          </div>
        );
      },
    },
    {
      title: "Số điểm",
      render: (data) => {
        return <a>{data?.value}</a>;
      },
      align: "center",
    },
    {
      title: "Loại điểm",
      render: (data) => {
        return (
          <a>
            {data?.type_point === "point" ? "Điểm thưởng" : "Điểm thứ hạng"}
          </a>
        );
      },
    },
    {
      title: "Ngày nạp",
      render: (data) => {
        return (
          <div>
            <a> {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}</a>
            <a> {moment(new Date(data?.date_create)).format("HH:mm")}</a>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      render: (data) => {
        return <div></div>;
      },
    },
  ];
  return (
    <div>
      <div></div>
      <div>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
};

export default TopupPoint;
