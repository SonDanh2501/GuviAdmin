import { useEffect, useState } from "react";
import { formatMoney } from "../../../../helper/formatMoney";
import "./index.scss";
import { getBalanceCollaborator } from "../../../../api/finance";
import { Pagination, Table } from "antd";
import topup from "../../../../assets/images/topup.svg";
import withdraw from "../../../../assets/images/withdraw.svg";

const FinanceCollaborator = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalRemainder, setTotalRemainder] = useState(0);
  const [totalGiftRemainder, setTotalGiftRemainder] = useState(0);
  const [totalTopup, setTotalTopup] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);

  useEffect(() => {
    getBalanceCollaborator()
      .then((res) => {
        setTotalRemainder(res?.total_remainder);
        setTotalGiftRemainder(res?.total_gift_remainder);
        setTotalTopup(res?.total_top_up);
        setTotalWithdraw(res?.total_withdraw);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: "Thời gian",
    },
    {
      title: "Tên CTV",
    },
    {
      title: "Ví CTV",
    },
    {
      title: "Ví thưởng",
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
      <div className="div-head-finance">
        <div className="div-total-money">
          <a className="title-total">Ví CTV</a>
          <a className="text-money">{formatMoney(totalRemainder)}</a>
        </div>
        <div className="div-total-money">
          <a className="title-total">Ví thưởng</a>
          <a className="text-money">{formatMoney(totalGiftRemainder)}</a>
        </div>
        <div className="div-total-money">
          <a className="title-total">Tổng nạp</a>
          <a className="text-money">
            {formatMoney(totalTopup)} <img src={topup} className="img-icon" />
          </a>
        </div>
        <div className="div-total-money">
          <a className="title-total">Tổng rút</a>
          <a className="text-money">
            {formatMoney(totalWithdraw)}{" "}
            <img src={withdraw} className="img-icon" />
          </a>
        </div>
      </div>

      <div className="div-body-finance">
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

export default FinanceCollaborator;
