import { useEffect, useState } from "react";
import "./styles.scss";
import {
  cancelRewardApi,
  deleteRewardApi,
  getListInfoRewardApi,
  noteRewardApi,
  verifyRewardApi,
} from "../../../../../api/topup";
import { Button, Dropdown, Pagination, Space, Table } from "antd";
import moment from "moment";
import { formatMoney } from "../../../../../helper/formatMoney";
import ModalCustom from "../../../../../components/modalCustom";
import InputCustom from "../../../../../components/textInputCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import { getElementState } from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
const RewardCollaborator = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);

  useEffect(() => {
    getListInfoRewardApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onVerifyReward = (id) => {
    setIsLoading(true);
    verifyRewardApi(id)
      .then((res) => {
        if (note !== "") {
          setIsLoading(false);
          setModalVerify(false);
          noteRewardApi(id, { note_admin: note })
            .then((res) => {
              getListInfoRewardApi(startPage, 20)
                .then((res) => {
                  setNote("");
                  setData(res?.data);
                  setTotal(res?.totalItem);
                })
                .catch((err) => {});
            })
            .catch((err) => {});
        } else {
          setIsLoading(false);
          setModalVerify(false);
          getListInfoRewardApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };

  const onCancelReward = (id) => {
    setIsLoading(true);
    cancelRewardApi(id, { note_admin: note })
      .then((res) => {
        setIsLoading(false);
        setModalCancel(false);
        getListInfoRewardApi(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };

  const onDeleteReward = (id) => {
    setIsLoading(true);
    deleteRewardApi(id)
      .then((res) => {
        setIsLoading(false);
        setModal(false);
        getListInfoRewardApi(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getListInfoRewardApi(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };
  const columns = [
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-create-info-reward">
            <a className="text-date">
              {moment(data?.date_create).format("DD-MM-YYYY")}
            </a>
            <a className="text-date">
              {moment(data?.date_create).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Cộng tác viên",
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-name-ctv-reward"
          >
            <a className="text-name">{data?.id_collaborator?.full_name}</a>
            <a className="text-name">{data?.id_collaborator?.phone}</a>
          </Link>
        );
      },
    },
    {
      title: "Tổng đơn",
      render: (data) => <a className="text-total">{data?.total_order}</a>,
      align: "center",
    },
    {
      title: "Tổng giờ làm",
      render: (data) => <a className="text-total">{data?.total_job_hour}</a>,
      align: "center",
    },
    {
      title: "Số tiền",
      render: (data) => (
        <a className="text-total">{formatMoney(data?.money)}</a>
      ),
      align: "right",
    },
    {
      title: "Trạng thái",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending-reward-info"
              : data?.status === "done"
              ? "text-done-reward-info"
              : "text-cancel-reward-info"
          }
        >
          {data?.status === "pending"
            ? "Đang chờ"
            : data?.status === "done"
            ? "Hoàn tất"
            : "Đã huỷ"}
        </a>
      ),
      align: "center",
    },
    {
      title: "Người duyệt",
      render: (date) => <a>{data?.id_admin_verify?.full_name}</a>,
    },
    {
      title: "Ghi chú",
      render: (data) => <a className="text-note">{data?.note_admin}</a>,
    },
    {
      key: "action",
      render: (data) => {
        return (
          <div className="div-action">
            {checkElement?.includes("verify_reward_cash_book_collaborator") && (
              <div
                onClick={() => setModalVerify(true)}
                className={
                  data?.is_verify || data?.status === "cancel"
                    ? "btn-verify-reward-hide"
                    : "btn-verify-reward"
                }
              >
                <a className="text-btn">Duyệt lệnh</a>
              </div>
            )}

            <div className="div-cancel-delete">
              {checkElement?.includes(
                "cancel_reward_cash_book_collaborator"
              ) && (
                <>
                  {data?.status === "pending" && (
                    <a
                      onClick={() => setModalCancel(true)}
                      className="text-cancel-reward"
                    >
                      Huỷ
                    </a>
                  )}
                </>
              )}

              {checkElement?.includes(
                "delete_reward_cash_book_collaborator"
              ) && (
                <div onClick={() => setModal(true)}>
                  <i class="uil uil-trash-alt"></i>
                </div>
              )}
            </div>
          </div>
        );
      },
      align: "right",
    },
    {
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            trigger={["click"]}
          >
            <a>
              <MoreOutlined className="icon-more" />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <Link
          to={`/topup/manage-topup/details-reward-collaborator/${itemEdit?._id}`}
        >
          <a>Xem chi tiết</a>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <a></a>
      <div>
        <Table
          dataSource={data}
          pagination={false}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
        />

        <div className="div-pagination p-2">
          <a>Tổng: {total}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              showSizeChanger={false}
              total={total}
              pageSize={20}
            />
          </div>
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalVerify}
          title="Duyệt lệnh thưởng tiền cho Cộng tác viên"
          handleOk={() => onVerifyReward(itemEdit?._id)}
          handleCancel={() => setModalVerify(false)}
          textOk="Duyệt"
          body={
            <div>
              <a>
                Bạn có muốn duyệt lệnh thưởng tiền cho CTV{" "}
                {itemEdit?.id_collaborator?.full_name}
              </a>
              <InputCustom
                title="Ghi chú lệnh duyệt"
                placeholder="Nhập nội dung ghi chu cho lệnh này"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          }
        />
        <ModalCustom
          isOpen={modalCancel}
          title="Huỷ lệnh thưởng tiền cho Cộng tác viên"
          handleOk={() => onCancelReward(itemEdit?._id)}
          handleCancel={() => setModalCancel(false)}
          textOk="Có"
          body={
            <div>
              <a>
                Bạn có muốn huỷ lệnh thưởng tiền cho CTV{" "}
                {itemEdit?.id_collaborator?.full_name}
              </a>
              <InputCustom
                title="Ghi chú lệnh huỷ"
                placeholder="Nhập nội dung ghi chú cho lệnh này"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          }
        />

        <ModalCustom
          isOpen={modal}
          title="Xoá lệnh thưởng tiền cho Cộng tác viên"
          handleOk={() => onDeleteReward(itemEdit?._id)}
          handleCancel={() => setModal(false)}
          textOk="Xoá"
          body={
            <div>
              <a>
                Bạn có muốn xoá lệnh thưởng tiền cho CTV{" "}
                {itemEdit?.id_collaborator?.full_name}
              </a>
            </div>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default RewardCollaborator;
