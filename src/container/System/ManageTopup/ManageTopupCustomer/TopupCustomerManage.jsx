import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, Pagination, Skeleton, Table } from "antd";
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
} from "../../../../api/topup";
import AddTopupCustomer from "../../../../components/addTopupCustomer/addTopupCustomer";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import EditPopup from "../../../../components/editTopup/editTopup";
import { formatMoney } from "../../../../helper/formatMoney";
import { errorNotify } from "../../../../helper/toast";
import { loadingAction } from "../../../../redux/actions/loading";
import { getTopupCustomer } from "../../../../redux/actions/topup";
import { getUser } from "../../../../redux/selectors/auth";
import { getTopupKH, totalTopupKH } from "../../../../redux/selectors/topup";
import "./TopupCustomerManage.scss";

export default function TopupCustomerManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [valueSearch, setValueSearch] = useState();
  const [currentPage, setCurrentPage] = useState(1);
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(
      getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 20 })
    );
  }, [dispatch]);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteMoneyCustomerApi(id, { is_delete: true })
      .then((res) => {
        dispatch(
          getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 10 })
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
  }, []);

  const onConfirm = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    verifyMoneyCustomerApi(id, { is_verify_money: true })
      .then((res) => {
        dispatch(
          getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 10 })
        );
        setModalConfirm(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const onCancel = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    cancelMoneyCustomerApi(id)
      .then((res) => {
        dispatch(
          getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 10 })
        );
        setModalCancel(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      searchTopupCustomerApi(value, 0, 10)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * listCustomer.length - listCustomer.length;

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
            length: 10,
          })
        );
  };

  const columns = [
    {
      title: "Mã",
      render: (data) => (
        <a
          className="text-id"
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
      render: (data) => <a>{formatMoney(data?.money)}</a>,
    },
    {
      title: "Nạp/rút",
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
      title: "Nội dung",
      dataIndex: "transfer_note",
    },
    {
      title: "Ngày nạp",
      render: (data) => (
        <a>{moment(new Date(data?.date_created)).format("DD/MM/yyy HH:mm")}</a>
      ),
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
              <a className="text-done">Hoàn tất</a>
            ) : (
              <a className="text-cancel">Đã huỷ</a>
            )}
          </div>
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
              onClick={toggleConfirm}
              disabled={data?.status === "pending" ? false : true}
            >
              Duyệt lệnh
            </button>

            <div className="mt-1 ml-3">
              {data?.status === "pending" && (
                <a className="text-cancel-topup" onClick={toggleCancel}>
                  Huỷ
                </a>
              )}

              {user?.role === "admin" && (
                <button className="btn-delete" onClick={toggle}>
                  <i className="uil uil-trash"></i>
                </button>
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
        <AddTopupCustomer />

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
