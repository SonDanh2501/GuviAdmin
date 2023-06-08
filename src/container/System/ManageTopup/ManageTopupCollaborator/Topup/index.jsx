import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import _debounce from "lodash/debounce";
import "./index.scss";
import {
  cancelMoneyCollaboratorApi,
  deleteMoneyCollaboratorApi,
  getTopupCollaboratorApi,
  searchTopupCollaboratorApi,
  verifyMoneyCollaboratorApi,
} from "../../../../../api/topup";
import { errorNotify, successNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import { DatePicker, Input, Pagination, Select, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getElementState, getUser } from "../../../../../redux/selectors/auth";
import moment from "moment";
import { formatMoney } from "../../../../../helper/formatMoney";
import EditTopup from "../../../../../components/editTopup/editTopup";
import AddTopup from "../../../../../components/addTopup/addTopup";
import Withdraw from "../../../../../components/withdraw/withdraw";
import { getRevenueCollaborator } from "../../../../../redux/actions/topup";
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
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;
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
      title: "Ví",
      render: (data) => (
        <a className="text-name-verify">
          {data?.type_wallet === "wallet" ? "Ví chính" : "Ví thưởng"}
        </a>
      ),
      align: "center",
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
              Duyệt lệnh
            </button>
            <div className="mt-1 ml-3">
              {(data?.status === "pending" ||
                data?.status === "transfered") && (
                <Tooltip placement="bottom" title={"Huỷ giao dịch CTV"}>
                  <a className="text-cancel-topup" onClick={toggleCancel}>
                    Huỷ
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
                        title={"Chỉnh sửa giao dịch CTV"}
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
                <Tooltip placement="bottom" title={"Xoá giao dịch CTV"}>
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
        <a>Tổng: {totalSearch > 0 ? totalSearch : total}</a>
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
        <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
          <ModalHeader toggle={toggleConfirm}>
            {itemEdit?.type_transfer === "top_up"
              ? "Duyệt lệnh nạp tiền"
              : " Duyệt lệnh rút tiền"}
          </ModalHeader>
          <ModalBody>
            <>
              <h4>
                {itemEdit?.type_transfer === "top_up"
                  ? "Bạn có muốn duyệt lệnh nạp tiền cho :"
                  : " Bạn có muốn duyệt lệnh rút tiền cho :"}
              </h4>
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
                  Loại ví:
                  {itemEdit?.type_wallet === "wallet"
                    ? "Ví chính"
                    : "Ví thưởng"}
                </a>
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
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Xóa giao dịch</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn xóa giao dịch của cộng tác viên
              <a className="text-name-modal">
                {itemEdit?.id_collaborator?.full_name}
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
        <Modal isOpen={modalCancel} toggle={toggleCancel}>
          <ModalHeader toggle={toggleCancel}>Huỷ giao dịch</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn huỷ giao dịch của cộng tác viên
              <a className="text-name-modal">
                {itemEdit?.id_collaborator?.full_name}
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

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default TopupCollaborator;
