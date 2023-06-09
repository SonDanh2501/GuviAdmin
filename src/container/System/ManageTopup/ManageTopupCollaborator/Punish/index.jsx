import { useCallback, useEffect, useState } from "react";
import PunishMoneyCollaborator from "../../../../../components/punishMoneyCollaborator/punishMoneyCollaborator";
import "./index.scss";
import { Button, Pagination, Table, Tooltip } from "antd";
import moment from "moment";
import { formatMoney } from "../../../../../helper/formatMoney";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getElementState, getUser } from "../../../../../redux/selectors/auth";
import {
  cancelMoneyPunishApi,
  confirmMoneyPunishApi,
  deleteMoneyPunishApi,
  getListPunishApi,
} from "../../../../../api/topup";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import EditPunish from "../../../../../components/editPunishMoney/editPunish";

const Punish = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const toggle = () => setModal(!modal);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const checkElement = useSelector(getElementState);

  useEffect(() => {
    getListPunishApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onConfirm = useCallback(
    (id) => {
      setIsLoading(true);
      confirmMoneyPunishApi(id).then((res) => {
        getListPunishApi(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
            setIsLoading(false);
            setModalConfirm(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      });
    },
    [startPage]
  );

  const onCancel = useCallback(
    (id) => {
      setIsLoading(true);
      cancelMoneyPunishApi(id)
        .then((res) => {
          setModalCancel(false);
          getListPunishApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setIsLoading(false);
              setModalCancel(false);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [startPage]
  );

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    deleteMoneyPunishApi(id)
      .then((res) => {
        setModalCancel(false);
        getListPunishApi(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
            setIsLoading(false);
            setModal(false);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    setStartPage(start);
    getListPunishApi(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

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
        <a className="text-description-topup">{data?.note_admin}</a>
      ),
    },
    {
      title: "Ngày phạt",
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
            {checkElement?.includes("verify_punish_cash_book_collaborator") && (
              <button
                className="btn-confirm"
                onClick={toggleConfirm}
                disabled={
                  data?.status === "cancel" || data?.status === "done"
                    ? true
                    : false
                }
              >
                Duyệt lệnh
              </button>
            )}

            {checkElement?.includes("cancel_punish_cash_book_collaborator") && (
              <div className="mt-1 ml-3">
                {(data?.status === "pending" ||
                  data?.status === "transfered") && (
                  <Tooltip placement="bottom" title={"Huỷ lệnh phạt CTV"}>
                    <a className="text-cancel-topup" onClick={toggleCancel}>
                      Huỷ
                    </a>
                  </Tooltip>
                )}
              </div>
            )}
            <div className="mt-1">
              {checkElement?.includes("edit_punish_cash_book_collaborator") && (
                <>
                  {data?.status === "cancel" || data?.status === "done" ? (
                    <></>
                  ) : (
                    <Tooltip
                      placement="bottom"
                      title={"Chỉnh sửa lệnh phạt CTV"}
                    >
                      <EditPunish
                        iconEdit={
                          <i
                            className={
                              (!data?.is_verify_punish &&
                                data?.status === "cancel") ||
                              data?.is_verify_punish
                                ? "uil uil-edit-alt icon-edit"
                                : "uil uil-edit-alt"
                            }
                          ></i>
                        }
                        item={itemEdit}
                        setDataT={setData}
                        setTotal={setTotal}
                        setIsLoading={setIsLoading}
                      />
                    </Tooltip>
                  )}
                </>
              )}

              {checkElement?.includes(
                "delete_punish_cash_book_collaborator"
              ) && (
                <Tooltip placement="bottom" title={"Xoá lệnh phạt CTV"}>
                  <button className="btn-delete" onClick={toggle}>
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
        {checkElement?.includes("create_punish_cash_book_collaborator") && (
          <PunishMoneyCollaborator setDataT={setData} setTotal={setTotal} />
        )}
      </div>
      <div className="mt-3">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
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

        <div>
          <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
            <ModalHeader toggle={toggleConfirm}>
              Duyệt lệnh phạt tiền
            </ModalHeader>
            <ModalBody>
              <>
                <h4>Duyệt lệnh phạt tiền cho :</h4>
                <div className="body-modal">
                  <a className="text-content">
                    CTV: {itemEdit?.id_collaborator?.full_name}
                  </a>
                  <a className="text-content">
                    SĐT: {itemEdit?.id_collaborator?.phone}
                  </a>
                  <a className="text-content">
                    Số tiền: {formatMoney(itemEdit?.money)}
                  </a>
                  <a className="text-content">
                    Nội dung: {itemEdit?.note_admin}
                  </a>
                </div>
              </>
            </ModalBody>
            <ModalFooter>
              <Button type="primary" onClick={() => onConfirm(itemEdit?._id)}>
                Có
              </Button>
              <Button color="#ddd" onClick={toggleConfirm}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <div>
          <Modal isOpen={modalCancel} toggle={toggleCancel}>
            <ModalHeader toggle={toggleCancel}>Huỷ lệnh phạt</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn huỷ lệnh phạt của cộng tác viên
                <a className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </a>
                này không?
              </a>
            </ModalBody>
            <ModalFooter>
              <Button type="primary" onClick={() => onCancel(itemEdit?._id)}>
                Có
              </Button>
              <Button color="#ddd" onClick={toggleCancel}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa lệnh phạt</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa lệnh phạt của cộng tác viên
                <a className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </a>
                này không?
              </a>
            </ModalBody>
            <ModalFooter>
              <Button type="primary" onClick={() => onDelete(itemEdit?._id)}>
                Có
              </Button>
              <Button color="#ddd" onClick={toggle}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        {isLoading && <LoadingPagination />}
      </div>
    </>
  );
};

export default Punish;
