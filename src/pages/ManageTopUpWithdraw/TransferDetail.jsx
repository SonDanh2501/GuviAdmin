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
  getActivityHistoryTransactionApi,
  getDetailTransactionApi,
} from "../../api/transaction";

const TransferDetail = () => {
  const params = useParams();
  const id = params?.id;
  const [infoTicket, setInfoTicket] = useState();
  const [returnFilter, setReturnFilter] = useState();
  const [modalRevoke, setModalRevoke] = useState(false);
  const [data, setData] = useState([]);
  // ---------------------------- xử lý action ------------------------------------ //
  const getDetail = () => {
    getDetailTransactionApi(id)
      .then((transaction) => {
        console.log("transaction", transaction);
        const _created_by = transaction?.id_admin_action?.full_name
          ? transaction?.id_admin_action?.full_name
          : "Hệ thống";
        let _status = "Đang xử lý";
        if (transaction?.status === "doing") {
          _status = "Đang thực thi";
        } else if (transaction?.status === "done") {
          _status = "Hoàn thành";
        } else if (transaction?.status === "revoke") {
          _status = "Đã thu hồi";
        } else if (transaction?.status === "cancel") {
          _status = "Đã huỷ";
        }
        let _type_action_punish = "Phạt tiền";
        if (transaction?.action_lock === "lock_create_order") {
          _type_action_punish = "Khoá tạo đơn";
        } else if (transaction?.action_lock === "lock_pending_to_confirm") {
          _type_action_punish = "Khoá xác nhận đơn";
        } else if (transaction?.action_lock === "lock_login") {
          _type_action_punish = "Khoá đăng nhập";
        }
        let _punish_source = "";
        if (transaction?.type_wallet === "work_wallet") {
          _punish_source = "Ví công việc";
        } else if (transaction?.type_wallet === "collaborator_wallet") {
          _punish_source = "Ví cộng tác viên";
        } else if (transaction?.type_wallet === "pay_point") {
          _punish_source = "Ví Pay-Point";
        }
        let _user_apply = "Cộng tác viên";
        if (transaction?.user_apply === "customer") {
          _user_apply = "Khách hàng";
        }
        let _full_name = "unknown";
        let _phone = "***********";
        let _id_view_user = "###########";
        if (transaction?.user_apply === "customer") {
          _full_name = transaction?.id_customer?.full_name;
          _phone = transaction?.id_customer?.phone;
          _id_view_user = transaction?.id_customer?.id_view;
        } else if (transaction?.user_apply === "collaborator") {
          _full_name = transaction?.id_collaborator?.full_name;
          _phone = transaction?.id_collaborator?.phone;
          _id_view_user = transaction?.id_collaborator?.id_view;
        }
        const item = {
          id_view: transaction?.id_view,
          date_create: format(
            new Date(transaction?.date_create),
            "dd/MM/yyyy  HH:mm"
          ),
          created_by: _created_by,
          status: _status,
          id_view_policy: transaction?.id_policy?.id_view,
          id_view_order: transaction?.id_order?.id_view,
          id_view_transaction: transaction?.id_transaction?.id_view,
          type_action_punish: _type_action_punish,
          punish_source: _punish_source,
          time_start: format(
            new Date(transaction?.time_start),
            "dd/MM/yyyy  HH:mm"
          ),
          time_end: format(
            new Date(transaction?.time_end),
            "dd/MM/yyyy  HH:mm"
          ),
          money: transaction?.punish_money,
          user_apply: _user_apply,
          full_name: _full_name,
          phone: _phone,
          id_view_user: _id_view_user,
          punish_money:
            transaction?.punish_money > 0
              ? formatMoney(transaction?.punish_money)
              : "--",
          id_transaction: transaction?.id_transaction?._id,
          id_collaborator: transaction?.id_collaborator?._id,
          id_group_order: transaction?.id_order?.id_group_order,
        };
        // setInfoTicket(item);
      })
      .catch((err) => {
        console.log("err detail punish ticket ", err);
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
  const handleRevoke = () => {};
  // ---------------------------- xử lý use effect ------------------------------------ //
  useEffect(() => {
    getDetail();
    getActivityHistory();
  }, []);
  const linkSubject = `/details-collaborator/${infoTicket?.id_collaborator}`;
  const linkTransaction = `/transaction-detail/${infoTicket?.id_transaction}`;
  const linkOrder = `/details-order/${infoTicket?.id_group_order}`;
  return (
    <div className="punish-detail_container">
      <h5>Chi tiết lệnh giao dịch</h5>
      <div className="punish-detail_content">
        <div className="info-detail">
          <div className="item-detail">
            <p>Mã giao dịch:</p>
            <p id="color-selected">{infoTicket?.id_view}</p>
          </div>
          <div className="item-detail">
            <p>Thời gian tạo:</p>
            <p>{infoTicket?.date_create}</p>
          </div>
          <div className="item-detail">
            <p>Tạo bởi:</p>
            <p>{infoTicket?.created_by}</p>
          </div>
          <div className="item-detail">
            <p>Trạng thái:</p>
            <p>{infoTicket?.status}</p>
          </div>
          <div className="item-detail">
            <p>Đối tượng:</p>
            <p>{infoTicket?.user_apply}</p>
          </div>
          <Link to={linkSubject} target="_blank">
            <div className="item-detail">
              <p>Mã đối tượng:</p>
              <p id="color-selected">{infoTicket?.id_view_user}</p>
            </div>
          </Link>

          <div className="item-detail">
            <p>Tên:</p>
            <p id="color-selected"> {infoTicket?.full_name}</p>
          </div>
          <div className="item-detail">
            <p>SĐT:</p>
            <p>{infoTicket?.phone}</p>
          </div>
          <div className="item-detail">
            <p>Hình thức phạt:</p>
            <p>{infoTicket?.type_action_punish}</p>
          </div>
          <div className="item-detail">
            <p>Số tiền:</p>
            <p className="fw-500">{infoTicket?.punish_money}</p>
          </div>
          {infoTicket?.id_transaction ? (
            <Link to={linkTransaction} target="_blank">
              <div className="item-detail">
                <p>Mã giao dịch:</p>
                <p id="color-selected">{infoTicket?.id_view_transaction}</p>
              </div>
            </Link>
          ) : (
            <div className="item-detail">
              <p>Mã giao dịch:</p>
              <p id="color-selected">{infoTicket?.id_view_transaction}</p>
            </div>
          )}
          {infoTicket?.id_view_order ? (
            <Link to={linkOrder} target="_blank">
              <div className="item-detail">
                <p>Mã ca làm:</p>
                <p id="color-selected">{infoTicket?.id_view_order}</p>
              </div>
            </Link>
          ) : (
            <div className="item-detail">
              <p>Mã ca làm:</p>
              <p id="color-selected">{infoTicket?.id_view_order}</p>
            </div>
          )}
          <div>
            <Button
              className="button-revoke"
              type="primary"
              danger
              onClick={() => setModalRevoke(true)}
            >
              Thu hồi vé phạt
            </Button>
          </div>
        </div>
        <div className="activity-history">
          <ActivityHistory data={data} />
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalRevoke}
          title={`Thu hồi vé phạt`}
          handleOk={handleRevoke}
          handleCancel={() => setModalRevoke(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn duyệt vé phạt này? </p>
              <p>
                Mã vé phạt:{" "}
                <span className="fw-500">{infoTicket?.id_view}</span>
              </p>
              <p>Tên: {infoTicket?.full_name}</p>
              <p>SĐT: {infoTicket?.phone}</p>
              <i>
                Note: việc thu hồi sẽ huỷ các giao dịch phát sinh từ vé phạt và
                đưa các trạng thái của CTV về trước thời điểm thực thi vé phạt{" "}
              </i>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TransferDetail;

const dataFilter = [
  {
    key: "status",
    label: "Trạng thái",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "pending", label: "Đang xử lý" },
      { key: "2", value: "doing", label: "Đang thực thi" },
      { key: "3", value: "cancel", label: "Huỷ" },
      { key: "4", value: "done", label: "Hoàn thành" },
    ],
  },
  {
    key: "payment",
    label: "Phương thức thanh khoản",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "bank", label: "Ngân hàng" },
      { key: "2", value: "momo", label: "MoMo" },
      { key: "3", value: "vnpay", label: "VNPay" },
      { key: "4", value: "pay_point", label: "Pay Point" },
    ],
  },
];
