import { useEffect, useState } from "react";
import { formatMoney } from "../../../../helper/formatMoney";
import "./index.scss";
import { getBalanceCollaborator } from "../../../../api/finance";
import { Pagination, Table } from "antd";

const FinanceCustomer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {}, []);

  const columns = [
    {
      title: "Thời gian",
    },
    {
      title: "Tên khách hàng",
    },
    {
      title: "Ví G-pay",
    },
    {
      title: "Điểm thưởng",
    },
    {
      title: "Nạp/Rút",
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);

    const start = page * data?.length - data?.length;
  };

  return (
    <>
      <div className="div-head-finance-customer">
        <div className="div-total-money">
          <a className="title-total">Ví G-pay</a>
          <a className="text-money"></a>
        </div>
        <div className="div-total-money">
          <a className="title-total">Điểm thưởng</a>
          <a className="text-money"></a>
        </div>
        <div className="div-total-money">
          <a className="title-total">Tổng nạp</a>
          <a className="text-money">
            <i class="uil uil-money-insert icon-plus"></i>
          </a>
        </div>
      </div>

      <div className="div-body-finance-customer">
        <a className="title-table">Bảng chi tiết lịch sử giao dịch</a>
        <div className="mt-3">
          <Table columns={columns} pagination={false} dataSource={data} />
        </div>
        <div className="mt-2 div-pagination p-2">
          <a>Tổng: {total}</a>
          <div>
            <Pagination
              current={currentPage}
              // onChange={onChange}
              total={total}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceCustomer;
