import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Table, Tooltip } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  cancelMoneyCollaboratorApi,
  deleteMoneyCollaboratorApi,
  getTopupCollaboratorApi,
  searchTopupCollaboratorApi,
  verifyMoneyCollaboratorApi,
} from "../../../../../api/topup";
import AddTopup from "../../../../../components/addTopup/addTopup";
import EditTopup from "../../../../../components/editTopup/editTopup";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import Withdraw from "../../../../../components/withdraw/withdraw";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify, successNotify } from "../../../../../helper/toast";
import { useCookies } from "../../../../../helper/useCookies";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { loadingAction } from "../../../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import "./index.scss";

const TopupCollaborator = ({ type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const [modalCancel, setModalCancel] = useState(false);
  const toggle = () => setModal(!modal);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [saveToCookie, readCookie] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPageCookie = readCookie("current_page_topup_ctv");
  const startPageCookie = "start_page_topup_ctv";

  useEffect(() => {
    getTopupCollaboratorApi(0, 20, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
    setCurrentPage(currentPageCookie === "" ? 1 : Number(currentPageCookie));
    setStartPage(startPageCookie === "" ? 0 : Number(startPageCookie));
  }, [type, startPageCookie, currentPageCookie]);

  const onDelete = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      deleteMoneyCollaboratorApi(id, { is_delete: true })
        .then((res) => {
          getTopupCollaboratorApi(startPage, 20, type)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          setModal(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setModalConfirm(false);
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage, type, dispatch]
  );

  const onConfirm = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      verifyMoneyCollaboratorApi(id, { is_verify_money: true })
        .then((res) => {
          getTopupCollaboratorApi(startPage, 20, type)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          setModalConfirm(false);
          successNotify({
            message: "Duyệt lệnh cho cộng tác viên thành công",
          });
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setModalConfirm(false);
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage, type, dispatch]
  );

  const onCancel = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      cancelMoneyCollaboratorApi(id)
        .then((res) => {
          getTopupCollaboratorApi(startPage, 20, type)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          setModalCancel(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage, type, dispatch]
  );

  const handleSearch = _debounce((value) => {
    setIsLoading(true);
    setValueSearch(value);
    searchTopupCollaboratorApi(value, startPage, 20, type)
      .then((res) => {
        setDataSearch(res.data);
        setTotalSearch(res.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, 1000);

  const onChange = (page) => {
    setCurrentPage(page);
    // saveToCookie("current_page_topup_ctv", page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const searchLength = dataSearch.length < 20 ? 20 : dataSearch.length;
    const start =
      dataSearch.length > 0
        ? page * searchLength - searchLength
        : page * dataLength - dataLength;
    setStartPage(start);
    // saveToCookie("start_page_topup_ctv", start);
    dataSearch.length > 0
      ? searchTopupCollaboratorApi(valueSearch, start, 20, type)
          .then((res) => {
            setDataSearch(res.data);
            setTotalSearch(res.totalItem);
          })
          .catch((err) => console.log(err))
      : getTopupCollaboratorApi(start, 20, type)
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
          <p className="title-column">{`${i18n.t("code", { lng: lang })}`}</p>
        );
      },
      render: (data) => (
        <p
          className="text-id"
          onClick={() =>
            navigate("/details-collaborator", {
              state: { id: data?.id_collaborator?._id },
            })
          }
        >
          {data?.id_collaborator?.id_view}
        </p>
      ),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("collaborator", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-name-topup"
          >
            <p className="text-name-topup">
              {data?.id_collaborator?.full_name}
            </p>
            <p className="text-phone-topup">{data?.id_collaborator?.phone}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("money", { lng: lang })}`}</p>
        );
      },
      render: (data) => (
        <p className="text-money-topup">{formatMoney(data?.money)}</p>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("withdraw_topup", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <>
            {data?.type_transfer === "top_up" ? (
              <div className="div-money-withdraw-topup">
                <i class="uil uil-money-insert icon-topup"></i>
                <p className="text-topup">{`${i18n.t("topup", {
                  lng: lang,
                })}`}</p>
              </div>
            ) : (
              <div className="div-money-withdraw-topup">
                <i class="uil uil-money-withdraw icon-withdraw"></i>
                <p className="text-withdraw">
                  {`${i18n.t("withdraw", { lng: lang })}`}
                </p>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => (
        <p className="text-description-topup">{data?.transfer_note}</p>
      ),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="div-time-topup">
            <p className="text-time">
              {moment(new Date(data?.date_create)).format("DD/MM/yyy")}
            </p>
            <p className="text-time">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("wallet", { lng: lang })}`}</p>
        );
      },
      render: (data) => (
        <p className="text-name-verify">
          {data?.type_wallet === "wallet"
            ? `${i18n.t("main_wallet", { lng: lang })}`
            : data?.type_wallet === "work_wallet"
            ? `${i18n.t("work_wallet", { lng: lang })}`
            : data?.type_wallet === "collaborator_wallet"
            ? `${i18n.t("collaborator_wallet", { lng: lang })}`
            : `${i18n.t("gift_wallet", { lng: lang })}`}
        </p>
      ),
      align: "center",
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("status", { lng: lang })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <p className="text-pending-topup">{`${i18n.t("processing", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "transfered" ? (
              <p className="text-transfered">{`${i18n.t("money_transferred", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "done" ? (
              <p className="text-done-topup">{`${i18n.t("complete", {
                lng: lang,
              })}`}</p>
            ) : (
              <p className="text-cancel-topup-ctv">{`${i18n.t("cancel", {
                lng: lang,
              })}`}</p>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("approved_by", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <p className="text-name-verify">{data?.id_admin_verify?.full_name}</p>
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
            <Button
              className={
                checkElement?.includes(
                  "verify_transition_cash_book_collaborator"
                )
                  ? "btn-confirm-topup-collaborator"
                  : "btn-confirm-topup-collaborator-hide"
              }
              onClick={toggleConfirm}
              disabled={
                (!data?.is_verify_money && data?.status === "cancel") ||
                data?.is_verify_money
                  ? true
                  : false
              }
            >
              {`${i18n.t("approvals", { lng: lang })}`}
            </Button>
            <div className="mt-1 ml-3">
              {(data?.status === "pending" ||
                data?.status === "transfered") && (
                <Tooltip
                  placement="bottom"
                  title={`${i18n.t("cancel_collaborator_transaction", {
                    lng: lang,
                  })}`}
                >
                  <p className="text-cancel-topup" onClick={toggleCancel}>
                    {`${i18n.t("cancel_modal", { lng: lang })}`}
                  </p>
                </Tooltip>
              )}
            </div>
            <div className="mt-1 div-delete-edit">
              <div>
                {!data?.is_verify_money && data?.status === "cancel" ? (
                  <></>
                ) : data?.is_verify_money ? (
                  <></>
                ) : (
                  <>
                    {checkElement?.includes("edit_cash_book_collaborator") && (
                      <Tooltip
                        placement="bottom"
                        title={`${i18n.t("edit_collaborator_transaction", {
                          lng: lang,
                        })}`}
                      >
                        <EditTopup
                          item={itemEdit}
                          iconEdit={
                            <i
                              className={
                                (!data?.is_verify_money &&
                                  data?.status === "cancel") ||
                                data?.is_verify_money
                                  ? "uil uil-edit-alt icon-edit"
                                  : "uil uil-edit-alt"
                              }
                            ></i>
                          }
                          type={type}
                          setDataT={setData}
                          setTotal={setTotal}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
              </div>

              {checkElement?.includes(
                "delete_transition_cash_book_collaborator"
              ) && (
                <Tooltip
                  placement="bottom"
                  title={`${i18n.t("delete_collaborator_transaction", {
                    lng: lang,
                  })}`}
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
    <div>
      <div className="div-header-topup">
        {type === "all" ? (
          <div className="div-topwith">
            <AddTopup type={type} setDataT={setData} setTotal={setTotal} />
            <Withdraw type={type} setDataT={setData} setTotal={setTotal} />
          </div>
        ) : type === "top_up" ? (
          <AddTopup type={type} setDataT={setData} setTotal={setTotal} />
        ) : (
          <Withdraw type={type} setDataT={setData} setTotal={setTotal} />
        )}

        <Input
          placeholder={`${i18n.t("search", {
            lng: lang,
          })}`}
          type="text"
          className="input-search-topup"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>

      <div className="mt-3">
        <Table
          dataSource={dataSearch?.length > 0 ? dataSearch : data}
          columns={columns}
          pagination={false}
          rowKey={(record) => record._id}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
          scroll={{
            x: width <= 900 ? 1200 : 0,
          }}
          expandable={
            width <= 900
              ? {
                  expandedRowRender: (record) => {
                    return (
                      <div className="div-detail-topup">
                        <div className="div-text-detail">
                          <p className="title-detail">Số tiền :</p>
                          <p className="text-detail">
                            {formatMoney(record?.money)}
                          </p>
                        </div>
                        <div className="div-text-detail">
                          <p className="title-detail">Nạp/rút :</p>
                          <>
                            {record?.type_transfer === "top_up" ? (
                              <div className="div-money-withdraw-topup">
                                <i class="uil uil-money-insert icon-topup"></i>
                                <p className="text-topup">{`${i18n.t("topup", {
                                  lng: lang,
                                })}`}</p>
                              </div>
                            ) : (
                              <div className="div-money-withdraw-topup">
                                <i class="uil uil-money-withdraw icon-withdraw"></i>
                                <p className="text-withdraw">
                                  {`${i18n.t("withdraw", { lng: lang })}`}
                                </p>
                              </div>
                            )}
                          </>
                        </div>
                        <div className="div-text-detail">
                          <p className="title-detail">Nội dung :</p>
                          <p className="text-detail">{record?.transfer_note}</p>
                        </div>
                        <div className="div-text-detail">
                          <p className="title-detail">Ví :</p>
                          <p className="text-detail">
                            {record?.type_wallet === "wallet"
                              ? `${i18n.t("main_wallet", { lng: lang })}`
                              : record?.type_wallet === "work_wallet"
                              ? `${i18n.t("work_wallet", { lng: lang })}`
                              : record?.type_wallet === "collaborator_wallet"
                              ? `${i18n.t("collaborator_wallet", {
                                  lng: lang,
                                })}`
                              : `${i18n.t("gift_wallet", { lng: lang })}`}
                          </p>
                        </div>
                        <div className="div-text-detail">
                          <p className="title-detail">Trạng thái :</p>
                          {record?.status === "pending" ? (
                            <p className="text-pending-topup">{`${i18n.t(
                              "processing",
                              {
                                lng: lang,
                              }
                            )}`}</p>
                          ) : record?.status === "transfered" ? (
                            <p className="text-transfered">{`${i18n.t(
                              "money_transferred",
                              {
                                lng: lang,
                              }
                            )}`}</p>
                          ) : record?.status === "done" ? (
                            <p className="text-done-topup">{`${i18n.t(
                              "complete",
                              {
                                lng: lang,
                              }
                            )}`}</p>
                          ) : (
                            <p className="text-cancel-topup-ctv">{`${i18n.t(
                              "cancel",
                              {
                                lng: lang,
                              }
                            )}`}</p>
                          )}
                        </div>
                        <div className="div-text-detail">
                          <p className="title-detail">Ngày tạo :</p>
                          <div className="div-time-topup">
                            <p className="text-time">
                              {moment(new Date(record?.date_create)).format(
                                "DD/MM/yyy"
                              )}
                            </p>
                            <p className="text-time">
                              {moment(new Date(record?.date_create)).format(
                                "HH:mm"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                }
              : null
          }
        />
      </div>
      <div className="div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}:{" "}
          {totalSearch > 0 ? totalSearch : total}
        </p>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            showSizeChanger={false}
            total={totalSearch > 0 ? totalSearch : total}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalConfirm}
          title={
            itemEdit?.type_transfer === "top_up"
              ? `${i18n.t("approve_deposit_order", { lng: lang })}`
              : `${i18n.t("approve_withdrawal_order", { lng: lang })}`
          }
          handleOk={() => onConfirm(itemEdit?._id)}
          handleCancel={toggleConfirm}
          textOk={`${i18n.t("approvals", { lng: lang })}`}
          body={
            <>
              <div className="body-modal">
                <p className="text-content">
                  {`${i18n.t("collaborator", { lng: lang })}`}:{" "}
                  {itemEdit?.id_collaborator?.full_name}
                </p>
                <p className="text-content">
                  {`${i18n.t("phone", { lng: lang })}`}:{" "}
                  {itemEdit?.id_collaborator?.phone}
                </p>
                <p className="text-content">
                  {`${i18n.t("money", { lng: lang })}`}:{" "}
                  {formatMoney(itemEdit?.money)}
                </p>
                <p className="text-content">
                  {`${i18n.t("content", { lng: lang })}`}:{" "}
                  {itemEdit?.transfer_note}
                </p>
                <p className="text-content">
                  {`${i18n.t("wallet", { lng: lang })}`}:{" "}
                  {itemEdit?.type_wallet === "wallet"
                    ? `${i18n.t("main_wallet", { lng: lang })}`
                    : itemEdit?.type_wallet === "work_wallet"
                    ? `${i18n.t("work_wallet", { lng: lang })}`
                    : itemEdit?.type_wallet === "collaborator_wallet"
                    ? `${i18n.t("collaborator_wallet", { lng: lang })}`
                    : `${i18n.t("gift_wallet", { lng: lang })}`}
                </p>
              </div>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("delete_transaction", { lng: lang })}`}
          handleOk={() => onDelete(itemEdit?._id)}
          handleCancel={toggle}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          body={
            <>
              <p>{`${i18n.t("want_delete_transaction", { lng: lang })}`}</p>
              <p className="text-name-modal">
                {itemEdit?.id_collaborator?.full_name}
              </p>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={modalCancel}
          title={`${i18n.t("cancel_transaction", { lng: lang })}`}
          handleOk={() => onCancel(itemEdit?._id)}
          handleCancel={toggleCancel}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          body={
            <>
              <p>{`${i18n.t("want_cancel_transaction", { lng: lang })}`}</p>
              <p className="text-name-modal">
                {itemEdit?.id_collaborator?.full_name}
              </p>
            </>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default TopupCollaborator;
