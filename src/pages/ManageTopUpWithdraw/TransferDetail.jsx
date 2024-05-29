import { Link, useParams } from "react-router-dom";
import {
  getActivityHistoryPunishTicketApi,
  getDetailPunishTicketApi,
} from "../../api/punish";
import { useEffect, useState } from "react";
import ActivityHistory from "../../components/activityHistory";
import { format } from "date-fns";
import { formatMoney } from "../../helper/formatMoney";
import CommonFilter from "../../components/commonFilter";
import { Button } from "antd";
import ModalCustom from "../../components/modalCustom";
import {
  cancelTransactionApi,
  getActivityHistoryTransactionApi,
  getDetailTransactionApi,
  verifyTransactionApi,
} from "../../api/transaction";

const TransferDetail = () => {
  const params = useParams();
  const id = params?.id;
  const [transactionDetail, setTransactionDetail] = useState();
  const [modalVerify, setModalVerify] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [data, setData] = useState([]);
  const [disableVerify, setDisableVerify] = useState(false);
  const [disableCancel, setDisableCancel] = useState(false);
  // ---------------------------- xử lý action ------------------------------------ //
  const getDetail = () => {
    getDetailTransactionApi(id)
      .then((transaction) => {
        const {
          id_admin_action,
          id_admin_verify,
          id_punish_ticket,
          id_collaborator,
          id_customer,
          date_create,
          status,
          id_order,
          type_transfer,
          payment_out,
          payment_in,
        } = transaction;
        let _create_by = "Hệ thống";
        if (id_admin_action) {
          _create_by = id_admin_action?.full_name + " (quản trị viên)";
        } else if (id_punish_ticket) {
        } else if (!id_punish_ticket && id_collaborator) {
          _create_by = +id_collaborator?.full_name + " (CTV)";
        } else if (!id_punish_ticket && id_customer) {
          _create_by = +id_customer?.full_name + " (KH)";
        }
        let _status = "Đang xử lý" + +"Đã thu hồi";
        switch (status) {
          case "pending":
            _status = <span className="text-status-pending">Đang xử lý</span>;
            break;
          case "transferred":
            _status = <span className="text-status-doing">Đã chuyển tiền</span>;
            break;
          case "done":
            _status = <span className="text-status-done">Hoàn thành</span>;
            break;
          case "cancel":
            _status = <span className="text-status-cancel">Đã Huỷ</span>;
            break;
          case "holding":
            _status = <span className="text-status-doing">Tạm giữ</span>;
            break;
          default:
            _status = <span className="text-status-pending">Đang xử lý</span>;
            break;
        }
        let _verify_by = "";
        if (status === "done" && id_admin_verify) {
          _verify_by = id_admin_verify?.full_name + " (quản trị viên)";
        } else if (status === "done" && !id_admin_verify) {
          _verify_by = "Hệ thống";
        }
        let _type_transfer = "Khác";
        switch (type_transfer) {
          case "top_up":
            _type_transfer = "Nạp";
            break;
          case "withdraw":
            _type_transfer = "Rút";
            break;
          case "reward":
            _type_transfer = "Thưởng";
            break;
          case "punish":
            _type_transfer = "Phạt";
            break;
          case "refurn_service":
            _type_transfer = "Hoàn tiền dịch vụ";
            break;
          case "pay_service":
            _type_transfer = "Mua dịch vụ";
            break;
          default:
            break;
        }
        let _payment_source = "Chuyển khoản";
        switch (payment_out) {
          case "bank":
            _payment_source = "Chuyển khoản";
            break;
          case "momo":
            _payment_source = "Ví MoMo";
            break;
          case "vnpay":
            _payment_source = "Ví VN Pay";
            break;
          case "viettel_money":
            _payment_source = "Ví Viettel Money";
            break;
          case "pay_point":
            _payment_source = "Pay Point";
            break;
          case "collaborator_wallet":
            _payment_source = "Ví CTV";
            break;
          case "work_wallet":
            _payment_source = "Ví công việc";
            break;
          case "other":
            _payment_source = "Chuyển khoản";
            break;
          default:
            break;
        }
        let _type_wallet = "Ví CTV";
        switch (payment_in) {
          case "bank":
            _type_wallet = "Chuyển khoản";
            break;
          case "momo":
            _type_wallet = "Ví MoMo";
            break;
          case "vnpay":
            _type_wallet = "Ví VN Pay";
            break;
          case "viettel_money":
            _type_wallet = "Ví Viettel Money";
            break;
          case "pay_point":
            _type_wallet = "Pay Point";
            break;
          case "collaborator_wallet":
            _type_wallet = "Ví CTV";
            break;
          case "work_wallet":
            _type_wallet = "Ví công việc";
            break;
          case "other":
            _type_wallet = "Chuyển khoản";
            break;
          default:
            break;
        }
        const item = {
          id_view: transaction?.id_view,
          date_create: format(new Date(date_create), "dd/MM/yyyy  HH:mm"),
          created_by: _create_by,
          verify_by: _verify_by,
          status: _status,
          user_apply: id_customer ? "Khách hàng" : "Cộng tác viên",
          id_view_user: id_customer
            ? id_customer?.id_view
            : id_collaborator?.id_view,
          id_customer: id_customer?._id,
          id_collaborator: id_collaborator?._id,
          full_name: id_customer?.full_name
            ? id_customer.full_name
            : id_collaborator?.full_name,
          phone: id_customer?.phone
            ? id_customer.phone
            : id_collaborator?.phone,
          money:
            transaction?.money > 0 ? formatMoney(transaction?.money) : "--",
          type_transfer: _type_transfer,
          type_wallet: _type_wallet,
          payment_source: _payment_source,
          id_punish_ticket: transaction?.id_punish_ticket,
          id_reward_ticket: transaction?.id_reward_ticket,
          id_order: id_order,
        };
        if (status === "cancel" || status === "done") {
          setDisableCancel(true);
          setDisableVerify(true);
        } else {
          setDisableCancel(false);
          setDisableVerify(false);
        }
        setTransactionDetail(item);
      })
      .catch((err) => {
        console.log("err detail transaction ", err);
      });
  };
  const getActivityHistory = () => {
    getActivityHistoryTransactionApi(id)
      .then((res) => {
        // console.log("resss ", res);
        setData(res?.data);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const handleCancel = () => {
    cancelTransactionApi(id)
      .then((res) => {
        console.log("resss ", res);
        setModalCancel(false);
        getDetail();
        getActivityHistory();
      })
      .catch((err) => {
        console.log("err ", err);
        setModalCancel(false);
      });
  };
  const handleVerify = () => {
    verifyTransactionApi(id)
      .then((res) => {
        console.log("resss ", res);
        setModalVerify(false);
        getDetail();
        getActivityHistory();
      })
      .catch((err) => {
        console.log("err ", err);
        setModalVerify(false);
      });
  };
  // ---------------------------- xử lý use effect ------------------------------------ //
  useEffect(() => {
    getDetail();
    getActivityHistory();
  }, []);
  const linkSubject = transactionDetail?.id_customer
    ? `/profile-customer/${transactionDetail?.id_customer?._id}`
    : `/details-collaborator/${transactionDetail?.id_collaborator?._id}`;
  const linkTransaction = `/transaction-detail/${transactionDetail?.id_transaction}`;
  const linkOrder = `/details-order/${transactionDetail?.id_group_order}`;
  const linkPunishTicket = `/details-punish-ticket/${transactionDetail?.id_punish_ticket?._id}`;
  const linkRewardTicket = `/details-reward-ticket/${transactionDetail?.id_reward_ticket?._id}`;
  // console.log("link subject ", transactionDetail);
  return (
    <div className="punish-detail_container">
      <h5>Chi tiết lệnh giao dịch</h5>
      <div className="punish-detail_content">
        <div className="info-detail">
          <div className="item-detail">
            <p>Mã giao dịch:</p>
            <p id="color-selected">{transactionDetail?.id_view}</p>
          </div>
          <div className="item-detail">
            <p>Thời gian tạo:</p>
            <p>{transactionDetail?.date_create}</p>
          </div>
          <div className="item-detail">
            <p>Tạo bởi:</p>
            <p>{transactionDetail?.created_by}</p>
          </div>
          <div className="item-detail">
            <p>Duyệt bởi:</p>

            <p>{transactionDetail?.verify_by}</p>
          </div>
          <div className="item-detail">
            <p>Trạng thái:</p>
            {transactionDetail?.status && (
              <div className="div-status-order">
                {transactionDetail?.status}
              </div>
            )}
          </div>
          <div className="item-detail">
            <p>Đối tượng:</p>
            <p>{transactionDetail?.user_apply}</p>
          </div>
          <Link to={linkSubject} target="_blank">
            <div className="item-detail">
              <p>Mã đối tượng:</p>
              <p id="color-selected">{transactionDetail?.id_view_user}</p>
            </div>
          </Link>

          <div className="item-detail">
            <p>Tên:</p>
            <p id="color-selected"> {transactionDetail?.full_name}</p>
          </div>
          <div className="item-detail">
            <p>SĐT:</p>
            <p>{transactionDetail?.phone}</p>
          </div>
          <div className="item-detail">
            <p>Loại giao dịch:</p>
            <p>{transactionDetail?.type_transfer}</p>
          </div>

          {transactionDetail?.id_punish_ticket && (
            <div className="item-detail">
              <p>Mã lệnh phạt:</p>

              <Link to={linkPunishTicket} target="_blank">
                <p id="color-selected">
                  {transactionDetail?.id_punish_ticket?.id_view}
                </p>
              </Link>
            </div>
          )}
          {transactionDetail?.id_punish_ticket && (
            <div className="item-detail">
              <p>Mã lệnh thưởng:</p>

              <Link to={linkRewardTicket} target="_blank">
                <p id="color-selected">
                  {transactionDetail?.id_reward_ticket?.id_view}
                </p>
              </Link>
            </div>
          )}

          {transactionDetail?.id_order && (
            <div className="item-detail">
              <p>Mã đơn hàng:</p>

              <Link to={linkOrder} target="_blank">
                <p id="color-selected">
                  {transactionDetail?.id_order?.id_group_order}
                </p>
              </Link>
            </div>
          )}
          <div className="item-detail">
            <p>Số tiền:</p>
            <p className="fw-500">{transactionDetail?.money}</p>
          </div>

          <div className="item-detail">
            <p>Ví:</p>
            <p>{transactionDetail?.type_wallet}</p>
          </div>

          <div className="item-detail">
            <p>Phương thức thanh toán:</p>
            <p>{transactionDetail?.payment_source}</p>
          </div>

          <div>
            <Button
              className="button-revoke"
              type="primary"
              // danger
              onClick={() => setModalVerify(true)}
              disabled={disableVerify}
            >
              Duyệt lệnh
            </Button>
            <Button
              // className="button-revoke"
              type="primary"
              danger
              onClick={() => setModalCancel(true)}
              disabled={disableCancel}
            >
              Huỷ lệnh
            </Button>
          </div>
        </div>
        <div className="activity-history">
          <ActivityHistory data={data} />
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalCancel}
          title={`Huỷ lệnh giao dịch`}
          handleOk={handleCancel}
          handleCancel={() => setModalCancel(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn huỷ lệnh giao dịch này? </p>
              <p>
                Mã giao dịch:{" "}
                <span className="fw-500">{transactionDetail?.id_view}</span>
              </p>
              <p>Tên: {transactionDetail?.full_name}</p>
              <p>SĐT: {transactionDetail?.phone}</p>
              {/* <i>
                Note: việc thu hồi sẽ huỷ các giao dịch phát sinh từ vé phạt và
                đưa các trạng thái của CTV về trước thời điểm thực thi vé phạt{" "}
              </i> */}
            </>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modalVerify}
          title={`Duyệt lệnh giao dịch`}
          handleOk={handleVerify}
          handleCancel={() => setModalVerify(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn duyệt lệnh giao dịch này? </p>
              <p>
                Mã giao dịch:{" "}
                <span className="fw-500">{transactionDetail?.id_view}</span>
              </p>
              <p>Tên: {transactionDetail?.full_name}</p>
              <p>SĐT: {transactionDetail?.phone}</p>
              {/* <i>
                Note: việc thu hồi sẽ huỷ các giao dịch phát sinh từ vé phạt và
                đưa các trạng thái của CTV về trước thời điểm thực thi vé phạt{" "}
              </i> */}
            </>
          }
        />
      </div>
    </div>
  );
};

export default TransferDetail;
