import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Table, Tooltip } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  cancelMoneyCustomerApi,
  deleteMoneyCustomerApi,
  searchTopupCustomerApi,
  verifyMoneyCustomerApi,
} from "../../../../../api/topup";
import AddTopupCustomer from "../../../../../components/addTopupCustomer/addTopupCustomer";
import EditPopup from "../../../../../components/editTopup/editTopup";
import ModalCustom from "../../../../../components/modalCustom";
import WithdrawCustomer from "../../../../../components/withdrawCustomer/withdrawCustomer";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getTopupCustomer } from "../../../../../redux/actions/topup";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import { getTopupKH, totalTopupKH } from "../../../../../redux/selectors/topup";
import "./TopupCustomerManage.scss";

const TopupCustomer = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [valueSearch, setValueSearch] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const listCustomer = useSelector(getTopupKH);
  const totalCustomer = useSelector(totalTopupKH);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const { width } = useWindowDimensions();
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const toggle = () => setModal(!modal);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const checkElement = useSelector(getElementState);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(
      getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 20 })
    );
  }, [dispatch]);

  const onDelete = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      deleteMoneyCustomerApi(id, { is_delete: true })
        .then((res) => {
          dispatch(
            getTopupCustomer.getTopupCustomerRequest({
              start: startPage,
              length: 20,
            })
          );
          setModal(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setModal(false);
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage]
  );

  const onConfirm = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      verifyMoneyCustomerApi(id)
        .then((res) => {
          dispatch(
            getTopupCustomer.getTopupCustomerRequest({
              start: startPage,
              length: 20,
            })
          );
          setModalConfirm(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage]
  );

  const onCancel = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      cancelMoneyCustomerApi(id)
        .then((res) => {
          dispatch(
            getTopupCustomer.getTopupCustomerRequest({
              start: startPage,
              length: 20,
            })
          );
          setModalCancel(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage]
  );

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      searchTopupCustomerApi(value, startPage, 20)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    [startPage]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = listCustomer.length < 20 ? 20 : listCustomer.length;
    const filterLength = dataFilter.length < 20 ? 20 : dataFilter.length;
    const start =
      dataFilter.length > 0
        ? page * filterLength - filterLength
        : page * dataLength - dataLength;

    setStartPage(start);

    dataFilter.length > 0
      ? searchTopupCustomerApi(valueSearch, 0, 10)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getTopupCustomer.getTopupCustomerRequest({
            start: start > 0 ? start : 0,
            length: 20,
          })
        );
  };

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("code", { lng: lang })}`}</a>
        );
      },
      render: (data) => (
        <Link to={`/profile-customer/${data?.id_customer?._id}`}>
          <a className="text-id-topup-customer">{data?.id_customer?.id_view}</a>
        </Link>
      ),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("customer", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <Link
            to={`/profile-customer/${data?.id_customer?._id}`}
            className="div-name-topup"
          >
            <a className="text-name">{data?.id_customer?.full_name}</a>
            <a className="text-phone">{data?.id_customer?.phone}</a>
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
        <a className="text-money-customer-topup">{formatMoney(data?.money)}</a>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("Nạp/rút", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <a className="text-description-topup">{data?.transfer_note}</a>
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
      render: (data) => (
        <div className="div-money-customer">
          <a className="text-money-customer-topup">
            {moment(new Date(data?.date_create)).format("DD/MM/yyy")}
          </a>
          <a className="text-money-customer-topup" v>
            {moment(new Date(data?.date_create)).format("HH:mm")}
          </a>
        </div>
      ),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("status", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <a className="text-pending-topup-customer">{`${i18n.t(
                "processing",
                { lng: lang }
              )}`}</a>
            ) : data?.status === "transfered" ? (
              <a className="text-transfered-topup-customer">{`${i18n.t(
                "money_transferred",
                { lng: lang }
              )}`}</a>
            ) : data?.status === "done" ? (
              <a className="text-done-topup-customer">{`${i18n.t("complete", {
                lng: lang,
              })}`}</a>
            ) : (
              <a className="text-cancel-topup-customer">{`${i18n.t("cancel", {
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
          <a className="title-column">{`${i18n.t("method", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <a className="text-money-customer-topup">
            {data?.method_transfer === "vnpay"
              ? "VNPay"
              : `${i18n.t("transfer", { lng: lang })}`}
          </a>
        );
      },
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <div>
            {checkElement?.includes("verify_transition_cash_book_customer") && (
              <Button
                className="btn-verify-topup-customer"
                onClick={toggleConfirm}
                disabled={data?.status === "pending" ? false : true}
              >
                {`${i18n.t("approvals", { lng: lang })}`}
              </Button>
            )}

            <div className="mt-1 ml-3">
              {data?.status === "pending" && (
                <a
                  className={
                    checkElement?.includes(
                      "cancel_transition_cash_book_customer"
                    )
                      ? "text-cancel-topup"
                      : "text-cancel-topup-hide"
                  }
                  onClick={toggleCancel}
                >
                  {`${i18n.t("cancel_modal", { lng: lang })}`}
                </a>
              )}

              {checkElement?.includes(
                "delete_transition_cash_book_customer"
              ) && (
                <Tooltip
                  placement="bottom"
                  title={`${i18n.t("delete_transaction", { lng: lang })}`}
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
    <React.Fragment>
      <div className="div-header-customer-topup mt-2">
        {checkElement?.includes("create_transition_cash_book_customer") && (
          <AddTopupCustomer />
        )}
        {checkElement?.includes("edit_transition_cash_book_customer") && (
          <WithdrawCustomer />
        )}
        <Input
          placeholder={`${i18n.t("search", { lng: lang })}`}
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
          columns={columns}
          dataSource={dataFilter.length > 0 ? dataFilter : listCustomer}
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
          // locale={{
          //   emptyText:
          //     listCustomer.length > 0 ? (
          //       <Empty />
          //     ) : (
          //       <Skeleton active={true} />
          //     ),
          // }}
          scroll={{ x: width < 900 ? 1400 : 0 }}
        />
      </div>
      <div className="div-pagination p-2">
        <a>
          {`${i18n.t("total", { lng: lang })}`}:{" "}
          {dataFilter.length > 0 ? totalFilter : totalCustomer}
        </a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={dataFilter.length > 0 ? totalFilter : totalCustomer}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalConfirm}
          title={`${i18n.t("approve_deposit_order", { lng: lang })}`}
          handleOk={() => onConfirm(itemEdit?._id)}
          handleCancel={toggleConfirm}
          textOk={`${i18n.t("approvals", { lng: lang })}`}
          body={
            <div className="body-modal">
              <a>
                {`${i18n.t("customer", { lng: lang })}`}:{" "}
                {itemEdit?.id_customer?.full_name}
              </a>
              <a>
                {`${i18n.t("phone", { lng: lang })}`}:{" "}
                {itemEdit?.id_customer?.phone}
              </a>
              <a>
                {`${i18n.t("money", { lng: lang })}`}:{" "}
                {formatMoney(itemEdit?.money)}
              </a>
              <a>
                {`${i18n.t("content", { lng: lang })}`}:{" "}
                {itemEdit?.transfer_note}
              </a>
            </div>
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
              <a>
                {`${i18n.t("want_cancel_transaction_customer", { lng: lang })}`}
              </a>
              <a className="text-name-modal">
                {itemEdit?.id_customer?.full_name}
              </a>
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
          textOk={`${i18n.t("yes", { lng: lang })}`}
          body={
            <>
              <a>
                {`${i18n.t("want_delete_transaction_customer", { lng: lang })}`}
              </a>
              <a className="text-name-modal">
                {itemEdit?.id_customer?.full_name}
              </a>
            </>
          }
        />
      </div>
      <div>
        <EditPopup item={itemEdit} state={modalEdit} setState={toggleEdit} />
      </div>
    </React.Fragment>
  );
};

export default TopupCustomer;
