import { Link, useParams } from "react-router-dom";
import { getDetailPunishTicketApi } from "../../api/punish";
import { useEffect, useState } from "react";
import ActivityHistory from "../../components/activityHistory";
import { format } from "date-fns";
import { formatMoney } from "../../helper/formatMoney";
import CommonFilter from "../../components/commonFilter";
import { Button } from "antd";
import ModalCustom from "../../components/modalCustom";

const PunishDetail = () => {
  const params = useParams();
  const id = params?.id;
  const [infoTicket, setInfoTicket] = useState();
  const [returnFilter, setReturnFilter] = useState();
  const [modalRevoke, setModalRevoke] = useState(false);

  // ---------------------------- xử lý action ------------------------------------ //
  const getDetail = (idPunishTicket) => {
    getDetailPunishTicketApi(idPunishTicket)
      .then((ticket) => {
        const _created_by = ticket?.id_admin_action?.full_name
          ? ticket?.id_admin_action?.full_name
          : "Hệ thống";
        let _status = "Đang xử lý";
        if (ticket?.status === "doing") {
          _status = "Đang thực thi";
        } else if (ticket?.status === "done") {
          _status = "Hoàn thành";
        } else if (ticket?.status === "revoke") {
          _status = "Đã thu hồi";
        } else if (ticket?.status === "cancel") {
          _status = "Đã huỷ";
        }
        let _type_action_punish = "Phạt tiền";
        if (ticket?.action_lock === "lock_create_order") {
          _type_action_punish = "Khoá tạo đơn";
        } else if (ticket?.action_lock === "lock_pending_to_confirm") {
          _type_action_punish = "Khoá xác nhận đơn";
        } else if (ticket?.action_lock === "lock_login") {
          _type_action_punish = "Khoá đăng nhập";
        }
        let _punish_source = "";
        if (ticket?.type_wallet === "work_wallet") {
          _punish_source = "Ví công việc";
        } else if (ticket?.type_wallet === "collaborator_wallet") {
          _punish_source = "Ví cộng tác viên";
        } else if (ticket?.type_wallet === "pay_point") {
          _punish_source = "Ví Pay-Point";
        }
        let _user_apply = "Cộng tác viên";
        if (ticket?.user_apply === "customer") {
          _user_apply = "Khách hàng";
        }
        let _full_name = "unknown";
        let _phone = "***********";
        let _id_view_user = "###########";
        if (ticket?.user_apply === "customer") {
          _full_name = ticket?.id_customer?.full_name;
          _phone = ticket?.id_customer?.phone;
          _id_view_user = ticket?.id_customer?.id_view;
        } else if (ticket?.user_apply === "collaborator") {
          _full_name = ticket?.id_collaborator?.full_name;
          _phone = ticket?.id_collaborator?.phone;
          _id_view_user = ticket?.id_collaborator?.id_view;
        }
        const item = {
          id_view: ticket?.id_view,
          date_create: format(
            new Date(ticket?.date_create),
            "dd/MM/yyyy  HH:mm"
          ),
          created_by: _created_by,
          status: _status,
          id_view_policy: ticket?.id_policy?.id_view,
          id_view_order: ticket?.id_order?.id_view,
          id_view_transaction: ticket?.id_transaction?.id_view,
          type_action_punish: _type_action_punish,
          punish_source: _punish_source,
          time_start: format(new Date(ticket?.time_start), "dd/MM/yyyy  HH:mm"),
          time_end: format(new Date(ticket?.time_end), "dd/MM/yyyy  HH:mm"),
          money: ticket?.punish_money,
          user_apply: _user_apply,
          full_name: _full_name,
          phone: _phone,
          id_view_user: _id_view_user,
          punish_money:
            ticket?.punish_money > 0 ? formatMoney(ticket?.punish_money) : "--",
          id_transaction: ticket?.id_transaction?._id,
          id_collaborator: ticket?.id_collaborator?._id,
          id_group_order: ticket?.id_order?.id_group_order,
        };
        setInfoTicket(item);
      })
      .catch((err) => {
        console.log("err detail punish ticket ", err);
      });
  };
  const getActivityHistory = () => {};
  const handleRevoke = () => {};
  // ---------------------------- xử lý use effect ------------------------------------ //
  useEffect(() => {
    getDetail(id);
  }, []);
  const linkSubject = `/details-collaborator/${infoTicket?.id_collaborator}`;
  const linkTransaction = `/transaction-detail/${infoTicket?.id_transaction}`;
  const linkOrder = `/details-order/${infoTicket?.id_group_order}`;
  return (
    <div className="punish-detail_container">
      <h5>Chi tiết lệnh phạt</h5>
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
            <p>Đối tượng phạt:</p>
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
        </div>
        <div className="activity-history">
          <ActivityHistory data={[]} />
        </div>
      </div>
      <Button
        className="button-revoke"
        type="primary"
        danger
        onClick={() => setModalRevoke(true)}
      >
        Thu hồi vé phạt
      </Button>
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

export default PunishDetail;

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
