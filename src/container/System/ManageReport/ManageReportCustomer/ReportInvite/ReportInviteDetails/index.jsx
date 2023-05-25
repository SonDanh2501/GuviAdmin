import { Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getReportDetailsCustomerInvite } from "../../../../../../api/report";
import "./index.scss";

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
    const start = page * data.length - data.length;
    getReportDetailsCustomerInvite(id, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
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
