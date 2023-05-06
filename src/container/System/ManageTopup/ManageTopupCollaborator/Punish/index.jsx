import { useState } from "react";
import PunishMoneyCollaborator from "../../../../../components/punishMoneyCollaborator/punishMoneyCollaborator";
import "./index.scss";
import { Table, Tooltip } from "antd";
import moment from "moment";
import { formatMoney } from "../../../../../helper/formatMoney";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../../../../redux/selectors/auth";

const Punish = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Mã",
      render: (data) => (
        <a
          className="text-id"
          onClick={() =>
            navigate("/details-collaborator", {
              state: { id: data?.id_collaborator?._id },
            })
          }
        >
          {data?.id_collaborator?.id_view}
        </a>
      ),
    },
    {
      title: "Tên cộng tác viên",
      render: (data) => {
        return (
          <div
            className="div-name-topup"
            onClick={() =>
              navigate("/details-collaborator", {
                state: { id: data?.id_collaborator?._id },
              })
            }
          >
            <a className="text-name-topup">
              {data?.id_collaborator?.full_name}
            </a>
            <a className="text-phone-topup">{data?.id_collaborator?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      render: (data) => (
        <a className="text-money-topup">{formatMoney(data?.money)}</a>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: "Nội dung",
      render: (data) => (
        <a className="text-description-topup">{data?.transfer_note}</a>
      ),
    },
    {
      title: "Ngày nạp",
      render: (data) => {
        return (
          <div className="div-time-topup">
            <a className="text-time">
              {moment(new Date(data?.date_create)).format("DD/MM/yyy")}
            </a>
            <a className="text-time">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
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
              <a className="text-done-topup">Hoàn tất</a>
            ) : (
              <a className="text-cancel-topup-ctv">Đã huỷ</a>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Người duyệt",
      render: (data) => {
        return (
          <a className="text-name-verify">{data?.id_admin_verify?.full_name}</a>
        );
      },
      align: "center",
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <div>
            <button
              className="btn-confirm"
              //   onClick={toggleConfirm}
              disabled={
                (!data?.is_verify_money && data?.status === "cancel") ||
                data?.is_verify_money
                  ? true
                  : false
              }
            >
              Duyệt lệnh
            </button>
            <div className="mt-1 ml-3">
              {(data?.status === "pending" ||
                data?.status === "transfered") && (
                <Tooltip placement="bottom" title={"Huỷ giao dịch CTV"}>
                  <a
                    className="text-cancel-topup"
                    //    onClick={toggleCancel}
                  >
                    Huỷ
                  </a>
                </Tooltip>
              )}
            </div>
            <div className="mt-1">
              {!data?.is_verify_money && data?.status === "cancel" ? (
                <></>
              ) : data?.is_verify_money ? (
                <></>
              ) : (
                <Tooltip placement="bottom" title={"Chỉnh sửa giao dịch CTV"}>
                  <button
                    className="btn-edit-topup"
                    // onClick={() => {
                    //   toggleEdit();
                    //   setItemEdit(data);
                    // }}
                  >
                    <i
                      className={
                        (!data?.is_verify_money && data?.status === "cancel") ||
                        data?.is_verify_money
                          ? "uil uil-edit-alt icon-edit"
                          : "uil uil-edit-alt"
                      }
                    ></i>
                  </button>
                </Tooltip>
              )}

              {user?.role === "admin" && (
                <Tooltip placement="bottom" title={"Xoá giao dịch CTV"}>
                  <button className="btn-delete">
                    <i className="uil uil-trash"></i>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div>
        <PunishMoneyCollaborator />
      </div>
      <div className="mt-3">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          //   rowKey={(record) => record._id}
          //   rowSelection={{
          //     selectedRowKeys,
          //     onChange: (selectedRowKeys, selectedRows) => {
          //       setSelectedRowKeys(selectedRowKeys);
          //     },
          //   }}
          //   onRow={(record, rowIndex) => {
          //     return {
          //       onClick: (event) => {
          //         setItemEdit(record);
          //       },
          //     };
          //   }}
        />
      </div>
    </>
  );
};

export default Punish;
