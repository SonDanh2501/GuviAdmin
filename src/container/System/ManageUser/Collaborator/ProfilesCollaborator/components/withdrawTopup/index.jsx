import { List, Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCollaboratorRemainder,
  getHistoryActivityCollaborator,
  getListTransitionByCollaborator,
  getTopupWithdrawCollaborator,
  getTransitionDetailsCollaborator,
} from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const WithdrawTopup = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainder, setRemainder] = useState(0);
  const [giftRemainder, setGiftRemainder] = useState(0);
  const [topup, setTopup] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getCollaboratorRemainder(id)
      .then((res) => {
        setRemainder(res?.remainder);
        setGiftRemainder(res?.gift_remainder);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(loadingAction.loadingRequest(false));
      });
    getListTransitionByCollaborator(id, 0, 10)
      .then((res) => {
        setData(res?.data);
        setTotalData(res?.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });

    getTransitionDetailsCollaborator(id)
      .then((res) => {
        setTopup(res?.totalTopUp);
        setWithdraw(res?.totalWithdraw);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getListTransitionByCollaborator(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "Giờ",
      render: (data) => (
        <div className="div-time">
          <a>{moment(new Date(data?.date_created)).format("DD/MM/YYYY")}</a>
          <a>{moment(new Date(data?.date_created)).format("HH:mm")}</a>
        </div>
      ),
    },
    {
      title: "Số tiền",
      render: (data) => <a>{formatMoney(data?.money)}</a>,
    },
    {
      title: "Nạp/rút",
      render: (data) => {
        return (
          <>
            {data?.type_transfer === "top_up" ? (
              <div>
                <i class="uil uil-money-insert icon-topup"></i>
                <a className="text-topup">Nạp</a>
              </div>
            ) : (
              <div>
                <i class="uil uil-money-withdraw icon-withdraw"></i>
                <a className="text-withdraw">Rút</a>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Nội dung",
      dataIndex: "transfer_note",
    },
    {
      title: "Ngày nạp",
      render: (data) => (
        <a>{moment(new Date(data?.date_created)).format("DD/MM/yyy HH:mm")}</a>
      ),
    },
    {
      title: "Trạng thái",
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <a className="text-pending-topup">Đang xử lý</a>
            ) : data?.status === "transfered" ? (
              <a className="text-transfered">Đã chuyển tiền</a>
            ) : data?.status === "done" ? (
              <a className="text-done">Hoàn tất</a>
            ) : (
              <a className="text-cancel">Đã huỷ</a>
            )}
          </div>
        );
      },
      width: "10%",
      align: "center",
    },
  ];

  return (
    <>
      <div className="div-head">
        <div className="div-monney">
          <div>
            <a className="text-title-monney">Ví CTV:</a>
            <a className="text-monney"> {formatMoney(remainder)}</a>
          </div>
          <div>
            <a className="text-title-monney">Ví thưởng: </a>
            <a className="text-monney">{formatMoney(giftRemainder)}</a>
          </div>
        </div>
        <div className="div-monney">
          <a className="total-revenue">
            Tổng nạp:
            <a className="text-money-revenue">
              <i class="uil uil-arrow-up icon-up"></i>
              {formatMoney(topup)}
            </a>
          </a>
          <a className="total-expenditure">
            Tổng rút:
            <a className="text-money-expenditure">
              <i class="uil uil-arrow-down icon-down"></i>
              {formatMoney(withdraw)}
            </a>
          </a>
        </div>
      </div>
      <div className="mt-5">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {totalData}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalData}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default memo(WithdrawTopup);
