import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Table, Tooltip } from "antd";
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
import { loadingAction } from "../../../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../../../redux/selectors/auth";
import "./index.scss";
import i18n from "../../../../../i18n";
const width = window.innerWidth;

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
  const [modalEdit, setModalEdit] = useState(false);
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const [modalCancel, setModalCancel] = useState(false);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const toggle = () => setModal(!modal);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const user = useSelector(getUser);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getTopupCollaboratorApi(0, 20, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [type]);

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
    [startPage, type]
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
    [startPage, type]
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
    [startPage, type]
  );

  const handleSearch = useCallback(
    _debounce((value) => {
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
    }, 1000),
    [startPage, type]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const searchLength = dataSearch.length < 20 ? 20 : dataSearch.length;
    const start =
      dataSearch.length > 0
        ? page * searchLength - searchLength
        : page * dataLength - dataLength;
    setStartPage(start);
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
      title: `${i18n.t("code", { lng: lang })}`,
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
      title: `${i18n.t("collaborator", { lng: lang })}`,
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
      title: `${i18n.t("money", { lng: lang })}`,
      render: (data) => (
        <a className="text-money-topup">{formatMoney(data?.money)}</a>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: `${i18n.t("topup_withdraw", { lng: lang })}`,
      render: (data) => {
        return (
          <>
            {data?.type_transfer === "top_up" ? (
              <div>
                <i class="uil uil-money-insert icon-topup"></i>
                <a className="text-topup">{`${i18n.t("topup", {
                  lng: lang,
                })}`}</a>
              </div>
            ) : (
              <div>
                <i class="uil uil-money-withdraw icon-withdraw"></i>
                <a className="text-withdraw">
                  {`${i18n.t("withdraw", { lng: lang })}`}
                </a>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: `${i18n.t("content", { lng: lang })}`,
      render: (data) => (
        <a className="text-description-topup">{data?.transfer_note}</a>
      ),
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
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
      title: `${i18n.t("wallet", { lng: lang })}`,
      render: (data) => (
        <a className="text-name-verify">
          {data?.type_wallet === "wallet"
            ? `${i18n.t("main_wallet", { lng: lang })}`
            : `${i18n.t("gift_wallet", { lng: lang })}`}
        </a>
      ),
      align: "center",
    },
    {
      title: `${i18n.t("status", { lng: lang })}`,
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
            ) : (
              <a className="text-cancel-topup-ctv">{`${i18n.t("cancel", {
                lng: lang,
              })}`}</a>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: `${i18n.t("approved_by", { lng: lang })}`,
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
            </button>
            <div className="mt-1 ml-3">
              {(data?.status === "pending" ||
                data?.status === "transfered") && (
                <Tooltip
                  placement="bottom"
                  title={`${i18n.t("cancel_collaborator_transaction", {
                    lng: lang,
                  })}`}
                >
                  <a className="text-cancel-topup" onClick={toggleCancel}>
                    {`${i18n.t("cancel_modal", { lng: lang })}`}
                  </a>
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
          scroll={
            width <= 490
              ? {
                  x: 1600,
                }
              : null
          }
        />
      </div>
      <div className="div-pagination p-2">
        <a>
          {`${i18n.t("total", { lng: lang })}`}:{" "}
          {totalSearch > 0 ? totalSearch : total}
        </a>
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
              ? "Duyệt lệnh nạp tiền"
              : " Duyệt lệnh rút tiền"
          }
          handleOk={() => onConfirm(itemEdit?._id)}
          handleCancel={toggleConfirm}
          textOk="Duyệt"
          body={
            <>
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
                  Nội dung: {itemEdit?.transfer_note}
                </a>
                <a className="text-content">
                  Loại ví:{" "}
                  {itemEdit?.type_wallet === "wallet"
                    ? "Ví chính"
                    : "Ví thưởng"}
                </a>
              </div>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={modal}
          title="Xóa giao dịch"
          handleOk={() => onDelete(itemEdit?._id)}
          handleCancel={toggle}
          textOk="Xoá"
          body={
            <a>
              Bạn có chắc muốn xóa giao dịch của cộng tác viên
              <a className="text-name-modal">
                {itemEdit?.id_collaborator?.full_name}
              </a>
              này không?
            </a>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={modalCancel}
          title="Huỷ giao dịch"
          handleOk={() => onCancel(itemEdit?._id)}
          handleCancel={toggleCancel}
          textOk="Có"
          body={
            <a>
              Bạn có chắc muốn huỷ giao dịch của cộng tác viên
              <a className="text-name-modal">
                {itemEdit?.id_collaborator?.full_name}
              </a>
              này không?
            </a>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default TopupCollaborator;
