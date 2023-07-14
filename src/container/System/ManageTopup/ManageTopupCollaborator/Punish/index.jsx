import { Button, Pagination, Table, Tooltip } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  cancelMoneyPunishApi,
  confirmMoneyPunishApi,
  deleteMoneyPunishApi,
  getListPunishApi,
  refundMoneyPunishApi,
} from "../../../../../api/topup";
import EditPunish from "../../../../../components/editPunishMoney/editPunish";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import PunishMoneyCollaborator from "../../../../../components/punishMoneyCollaborator/punishMoneyCollaborator";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../../../redux/selectors/auth";
import "./index.scss";
import i18n from "../../../../../i18n";

const Punish = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const toggle = () => setModal(!modal);
  const toggleRefund = () => setModalRefund(!modalRefund);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

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

  const onRefund = (id) => {
    setIsLoading(true);
    refundMoneyPunishApi(id)
      .then((res) => {
        setModalRefund(false);
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
  };

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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("code_collaborator", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <a
          className="text-id-ctv"
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("collaborator", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-name-topup"
          >
            <a className="text-name-topup">
              {data?.id_collaborator?.full_name}
            </a>
            <a className="text-phone-topup">{data?.id_collaborator?.phone}</a>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("money", { lng: lang })}`}</a>
        );
      },
      render: (data) => (
        <a className="text-money-topup">{formatMoney(data?.money)}</a>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <a className="text-description-topup">{data?.note_admin}</a>
      ),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("status", { lng: lang })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <a className="text-pending-topup">{`${i18n.t("processing", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "transfered" ? (
              <a className="text-transfered">{`${i18n.t("money_transferred", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "done" ? (
              <a className="text-done-topup">{`${i18n.t("complete", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "done" ? (
              <a className="text-cancel-topup-ctv">{`${i18n.t("cancel", {
                lng: lang,
              })}`}</a>
            ) : (
              <a className="text-refund-topup">{`${i18n.t("refund", {
                lng: lang,
              })}`}</a>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("approved_by", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <a className="text-name-verify">
            {data?.is_punish_system && data?.id_admin_refund
              ? data?.id_admin_refund?.full_name
              : data?.is_punish_system
              ? `${i18n.t("system", { lng: lang })}`
              : data?.id_admin_verify?.full_name}
          </a>
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
              <Button
                className="btn-confirm"
                onClick={toggleConfirm}
                disabled={
                  data?.status === "cancel" ||
                  data?.status === "done" ||
                  data?.status === "refund"
                    ? true
                    : false
                }
              >
                {`${i18n.t("approved_by", { lng: lang })}`}
              </Button>
            )}

            <div className="refunds-cancel">
              {data?.status === "done" && (
                <div onClick={toggleRefund}>
                  <a className="text-refunds">{`${i18n.t("refund", {
                    lng: lang,
                  })}`}</a>
                </div>
              )}
              {checkElement?.includes(
                "cancel_punish_cash_book_collaborator"
              ) && (
                <div className="mt-1 ml-3">
                  {(data?.status === "pending" ||
                    data?.status === "transfered") && (
                    <Tooltip
                      placement="bottom"
                      title={`${i18n.t("canceling_collaborator_fine", {
                        lng: lang,
                      })}`}
                    >
                      <a className="text-cancel-topup" onClick={toggleCancel}>
                        {`${i18n.t("cancel_modal", { lng: lang })}`}
                      </a>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            <div>
              {checkElement?.includes("edit_punish_cash_book_collaborator") && (
                <>
                  {data?.status === "cancel" ||
                  data?.status === "done" ||
                  data?.status === "refund" ? (
                    <></>
                  ) : (
                    <Tooltip
                      placement="bottom"
                      title={`${i18n.t("edit_collaborator_fine", {
                        lng: lang,
                      })}`}
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
                <Tooltip
                  placement="bottom"
                  title={`${i18n.t("remove_collaborator_fine", { lng: lang })}`}
                >
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
          <a>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </a>
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
          <ModalCustom
            isOpen={modalConfirm}
            title={`${i18n.t("approval_of_fines", { lng: lang })}`}
            handleOk={() => onConfirm(itemEdit?._id)}
            handleCancel={toggleConfirm}
            textOk={`${i18n.t("approvals", { lng: lang })}`}
            body={
              <>
                <div className="body-modal">
                  <a className="text-content">
                    {`${i18n.t("collaborator", { lng: lang })}`}:{" "}
                    {itemEdit?.id_collaborator?.full_name}
                  </a>
                  <a className="text-content">
                    {`${i18n.t("phone", { lng: lang })}`}:{" "}
                    {itemEdit?.id_collaborator?.phone}
                  </a>
                  <a className="text-content">
                    {`${i18n.t("money", { lng: lang })}`}:{" "}
                    {formatMoney(itemEdit?.money)}
                  </a>
                  <a className="text-content">
                    {`${i18n.t("content", { lng: lang })}`}:{" "}
                    {itemEdit?.note_admin}
                  </a>
                </div>
              </>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalCancel}
            title={`${i18n.t("cancellation_of_fines", { lng: lang })}`}
            handleOk={() => onCancel(itemEdit?._id)}
            handleCancel={toggleCancel}
            textOk={`${i18n.t("yes", { lng: lang })}`}
            body={
              <>
                <a>
                  {`${i18n.t("want_cancellation_of_fines", { lng: lang })}`}
                </a>
                <a className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </a>
              </>
            }
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("remove_the_fine", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <a>{`${i18n.t("want_remove_the_fine", { lng: lang })}`}</a>
                <a className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </a>
              </>
            }
          />

          <ModalCustom
            isOpen={modalRefund}
            title={`${i18n.t("refund_fines", { lng: lang })}`}
            handleOk={() => onRefund(itemEdit?._id)}
            handleCancel={toggleRefund}
            textOk={`${i18n.t("refund", { lng: lang })}`}
            body={
              <>
                <a>{`${i18n.t("want_refund_fines", { lng: lang })}`}</a>
                <a className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </a>
              </>
            }
          />
        </div>

        {isLoading && <LoadingPagination />}
      </div>
    </>
  );
};

export default Punish;
