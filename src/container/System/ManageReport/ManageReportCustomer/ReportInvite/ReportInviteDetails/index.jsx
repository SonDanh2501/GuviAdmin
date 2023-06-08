import { Pagination, Progress, Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getReportDetailsCustomerInvite } from "../../../../../../api/report";
import "./index.scss";
import moment from "moment";

const ReportInviteDetails = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getReportDetailsCustomerInvite(id, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getReportDetailsCustomerInvite(id, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-create-invite-detail">
            <a className="text-invite">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-invite">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Mã",
      render: (data) => <a>{data?.id_view}</a>,
    },
    {
      title: "Tên khách hàng",
      render: (data) => <a>{data?.full_name}</a>,
    },
    {
      title: "Số điện thoại ",
      render: (data) => <a>{data?.phone}</a>,
    },
    {
      title: "Tổng đơn",
      render: (data) => <a>{data?.total_done_order}</a>,
      align: "center",
    },
    {
      title: "Giai đoạn",
      render: (data) => (
        <Progress
          percent={
            data?.total_order === 0
              ? 33
              : data?.total_order !== 0 && data?.total_done_order === 0
              ? 66
              : 100
          }
          strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
        />
      ),
    },
  ];
  return (
    <div>
      <a className="title">Chi tiết</a>
      <div className="mt-5">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportInviteDetails;
