import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, Pagination, Skeleton, Table, Tooltip } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  cancelMoneyCustomerApi,
  deleteMoneyCustomerApi,
  searchTopupCustomerApi,
  verifyMoneyCustomerApi,
} from "../../../../../api/topup";
import AddTopupCustomer from "../../../../../components/addTopupCustomer/addTopupCustomer";
import EditPopup from "../../../../../components/editTopup/editTopup";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getTopupCustomer } from "../../../../../redux/actions/topup";
import { getElementState, getUser } from "../../../../../redux/selectors/auth";
import { getTopupKH, totalTopupKH } from "../../../../../redux/selectors/topup";
import "./TopupCustomerManage.scss";
import WithdrawCustomer from "../../../../../components/withdrawCustomer/withdrawCustomer";

export default function TopupCustomer() {
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
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const toggle = () => setModal(!modal);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const user = useSelector(getUser);
  const checkElement = useSelector(getElementState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      title: "Mã",
      render: (data) => (
        <a
          className="text-id-topup-customer"
          onClick={() =>
            navigate("/profile-customer", {
              state: { id: data?.id_customer?._id },
            })
          }
        >
          {data?.id_customer?.id_view}
        </a>
      ),
    },
    {
      title: "Tên khách hàng",
      render: (data) => {
        return (
          <div
            className="div-name-topup"
            onClick={() =>
              navigate("/profile-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
          >
            <a className="text-name">{data?.id_customer?.full_name}</a>
            <a className="text-phone">{data?.id_customer?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      render: (data) => (
        <a className="text-money-customer-topup">{formatMoney(data?.money)}</a>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    // {
    //   title: "Nạp/rút",
    //   render: (data) => {
    //     return (
    //       <>
    //         {data?.type_transfer === "top_up" ? (
    //           <div>
    //             <i class="uil uil-money-insert icon-topup"></i>
    //             <a className="text-topup">Nạp</a>
    //           </div>
    //         ) : (
    //           <div>
    //             <i class="uil uil-money-withdraw icon-withdraw"></i>
    //             <a className="text-withdraw">Rút</a>
    //           </div>
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      title: "Nội dung",
      render: (data) => (
        <a className="text-description-topup">{data?.transfer_note}</a>
      ),
    },
    {
      title: "Ngày nạp",
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
      title: "Trạng thái",
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <a className="text-pending-topup-customer">Đang xử lý</a>
            ) : data?.status === "transfered" ? (
              <a className="text-transfered-topup-customer">Đã chuyển tiền</a>
            ) : data?.status === "done" ? (
              <a className="text-done-topup-customer">Hoàn tất</a>
            ) : (
              <a className="text-cancel-topup-customer">Đã huỷ</a>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Phương thức",
      render: (data) => {
        return (
          <a className="text-money-customer-topup">
            {data?.method_transfer === "vnpay" ? "VNPay" : "Chuyển khoản"}
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
              <button
                className="btn-verify-topup-customer"
                onClick={toggleConfirm}
                disabled={data?.status === "pending" ? false : true}
              >
                Duyệt lệnh
              </button>
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
                  Huỷ
                </a>
              )}

              {checkElement?.includes(
                "delete_transition_cash_book_customer"
              ) && (
                <Tooltip placement="bottom" title={"Xoá giao dịch KH"}>
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
          placeholder="Tìm kiếm"
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
        />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {dataFilter.length > 0 ? totalFilter : totalCustomer}</a>
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
        <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
          <ModalHeader toggle={toggleConfirm}>Duyệt lệnh nạp tiền</ModalHeader>
          <ModalBody>
            <>
              <h4>Bạn có muốn duyệt lệnh nạp tiền cho :</h4>
              <div className="body-modal">
                <a>Khách hàng: {itemEdit?.id_customer?.name}</a>
                <a>SĐT: {itemEdit?.id_customer?.phone}</a>
                <a>Số tiền: {formatMoney(itemEdit?.money)}</a>
                <a>Nội dung: {itemEdit?.transfer_note}</a>
              </div>
            </>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => onConfirm(itemEdit?._id)}>
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
          <ModalHeader toggle={toggleCancel}>Huỷ giao dịch</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn huỷ giao dịch của khách hàng
              <a className="text-name-modal">
                {itemEdit?.id_customer?.full_name}
              </a>
              này không?
            </a>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => onCancel(itemEdit?._id)}>
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
          <ModalHeader toggle={toggle}>Xóa giao dịch</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn xóa giao dịch của khách hàng
              <a className="text-name-modal">
                {itemEdit?.id_customer?.full_name}
              </a>
              này không?
            </a>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => onDelete(itemEdit?._id)}>
              Có
            </Button>
            <Button color="#ddd" onClick={toggle}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <EditPopup item={itemEdit} state={modalEdit} setState={toggleEdit} />
      </div>
    </React.Fragment>
  );
}
