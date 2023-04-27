import { useEffect, useState } from "react";
import { formatMoney } from "../../../../helper/formatMoney";
import "./index.scss";
import {
  getBalanceCollaborator,
  getReportTransitionCollaborator,
} from "../../../../api/finance";
import { Pagination, Table } from "antd";
import topup from "../../../../assets/images/topup.svg";
import withdraw from "../../../../assets/images/withdraw.svg";
import moment from "moment";
import CustomDatePicker from "../../../../components/customDatePicker";

const FinanceCollaborator = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalRemainder, setTotalRemainder] = useState(0);
  const [totalGiftRemainder, setTotalGiftRemainder] = useState(0);
  const [totalTopup, setTotalTopup] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    getBalanceCollaborator()
      .then((res) => {
        setTotalRemainder(res?.total_remainder);
        setTotalGiftRemainder(res?.total_gift_remainder);
        setTotalTopup(res?.total_top_up);
        setTotalWithdraw(res?.total_withdraw);
      })
      .catch((err) => {});

    getReportTransitionCollaborator(
      0,
      10,
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment().endOf("date").toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});

    setStartDate(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString()
    );

    setEndDate(
      moment(moment().endOf("date").toISOString()).add(7, "hours").toISOString()
    );
  }, []);

  const columns = [
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-date-finance-collaborator">
            <a className="text-date-finance">
              {moment(new Date(data?.date_created)).format("DD/MM/YYYY")}
            </a>
            <a className="text-date-finance">
              {moment(new Date(data?.date_created)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Ngày duyệt",
      render: (data) => {
        return (
          <>
            {data?.date_verify_created && (
              <div className="div-date-finance-collaborator">
                <a className="text-date-finance">
                  {moment(new Date(data?.date_verify_created)).format(
                    "DD/MM/YYYY"
                  )}
                </a>
                <a className="text-date-finance">
                  {moment(new Date(data?.date_verify_created)).format("HH:mm")}
                </a>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Tên CTV",
      render: (data) => {
        return (
          <div className="div-date-finance-collaborator">
            <a className="text-date-finance">
              {data?.id_collaborator?.full_name}
            </a>
            <a className="text-date-finance">
              {data?.id_collaborator?.id_view}
            </a>
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      render: (data) => (
        <a className="text-money-finance">{formatMoney(data?.money)}</a>
      ),
      align: "center",
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: "Nội dung",
      render: (data) => (
        <a className="text-money-finance">{data?.transfer_note}</a>
      ),
    },
    {
      title: "Loại ví",
      render: (data) => (
        <a className="text-wallet-finance">
          {data?.type_wallet === "wallet" ? "Ví CTV" : "Ví thưởng"}
        </a>
      ),
      align: "center",
    },
    {
      title: "Người duyệt",
      render: (data) => (
        <a className="text-wallet-finance">
          {data?.id_admin_verify ? data?.id_admin_verify?.full_name : ""}
        </a>
      ),
      align: "center",
    },
    {
      title: "Nạp/Rút",
      render: (data) => {
        return (
          <div>
            {data?.type_transfer === "top_up" ? (
              <a className="text-topup-finance">Nạp</a>
            ) : (
              <a className="text-withdraw-finance">Rút</a>
            )}
          </div>
        );
      },
      align: "center",
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);

    const start = page * data?.length - data?.length;

    getReportTransitionCollaborator(start, 10, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeDay = () => {
    getReportTransitionCollaborator(0, 10, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className="div-head-finance">
        <div className="div-total-money">
          <a className="title-total">Tổng ví CTV</a>
          <a className="text-money">{formatMoney(totalRemainder)}</a>
        </div>
        <div className="div-total-money">
          <a className="title-total">Tổng ví thưởng</a>
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
        <div className="div-date">
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
          />
          {startDate && (
            <a className="text-date">
              {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
              {moment(new Date(endDate)).format("DD/MM/YYYY")}
            </a>
          )}
        </div>
        <div className="mt-3">
          <Table columns={columns} pagination={false} dataSource={data} />
        </div>
        <div className="mt-2 div-pagination p-2">
          <a>Tổng: {total}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={total}
              showSizeChanger={false}
              pageSize={10}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceCollaborator;
