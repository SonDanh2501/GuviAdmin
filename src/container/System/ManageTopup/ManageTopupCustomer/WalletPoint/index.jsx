import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import _debounce from "lodash/debounce";
import {
  cancelPointCustomerApi,
  deletePointCustomerApi,
  getTopupPointCustomerApi,
  searchTopupPointCustomerApi,
  verifyPointCustomerApi,
} from "../../../../../api/topup";
import AddPoint from "../../../../../components/addPointCustomer/addPoint";
import LoadingPagination from "../../../../../components/paginationLoading";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getUser } from "../../../../../redux/selectors/auth";
import "./index.scss";
import { errorNotify } from "../../../../../helper/toast";

const TopupPoint = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState();
  const [valueSearch, setValueSearch] = useState("");
  const [itemEdit, setItemEdit] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);

  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const toggle = () => setModal(!modal);
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleCancel = () => setModalCancel(!modalCancel);

  useEffect(() => {
    getTopupPointCustomerApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  const onDelete = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));

      deletePointCustomerApi(id)
        .then((res) => {
          getTopupPointCustomerApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModal(false);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => {
              errorNotify({
                message: err,
              });
              dispatch(loadingAction.loadingRequest(false));
            });
        })
        .catch((err) => {});
    },
    [startPage]
  );

  const onConfirm = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));

      verifyPointCustomerApi(id)
        .then((res) => {
          getTopupPointCustomerApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModalConfirm(false);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => {
              errorNotify({
                message: err,
              });
              dispatch(loadingAction.loadingRequest(false));
            });
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
      cancelPointCustomerApi(id)
        .then((res) => {
          getTopupPointCustomerApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModalCancel(false);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => dispatch(loadingAction.loadingRequest(false)));
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
      searchTopupPointCustomerApi(startPage, 20, value)
        .then((res) => {
          setDataSearch(res?.data);
          setTotalSearch(res?.totalItem);
        })
        .catch((err) => {});
    }, 1000),
    [startPage]
  );

  const columns = [
    {
      title: "Tên",
      render: (data) => {
        return (
          <div className="div-name-point">
            <a className="text-name">{data?.name_customer}</a>
            <a className="text-phone-point">{data?.phone_customer}</a>
          </div>
        );
      },
    },
    {
      title: "Số điểm",
      render: (data) => {
        return <a className="text-point">{data?.value}</a>;
      },
      align: "center",
    },
    {
      title: "Loại điểm",
      render: (data) => {
        return (
          <a className="text-type-point">
            {data?.type_point === "point" ? "Thưởng" : "Hạng thành viên"}
          </a>
        );
      },
    },
    {
      title: "Nội dung",
      render: (data) => {
        return <a className="text-description-topup-point">{data?.note}</a>;
      },
    },
    {
      title: "Ngày nạp",
      render: (data) => {
        return (
          <div className="div-day-create-point">
            <a className="text-day">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-day">
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
              <a className="text-pending-point">Đang xử lý</a>
            ) : data?.status === "done" ? (
              <a className="text-done-point">Hoàn tất</a>
            ) : (
              <a className="text-cancel-point">Huỷ</a>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <div>
            <button
              className="btn-confirm"
              disabled={
                data?.is_verify ||
                (!data?.is_verify && data?.status === "cancel")
                  ? true
                  : false
              }
              onClick={toggleConfirm}
            >
              Duyệt lệnh
            </button>

            <div>
              {data?.status === "pending" && (
                <a className="text-cancel-point" onClick={toggleCancel}>
                  Huỷ
                </a>
              )}

              {user?.role === "admin" && (
                <button className="btn-delete-point" onClick={toggle}>
                  <i className="uil uil-trash"></i>
                </button>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;
    setStartPage(start);

    dataSearch.length > 0
      ? searchTopupPointCustomerApi(start, 20, valueSearch)
          .then((res) => {
            setDataSearch(res?.data);
            setTotalSearch(res?.totalItem);
          })
          .catch((err) => {})
      : getTopupPointCustomerApi(start, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="div-head-point mt-2">
        <AddPoint setDataL={setData} setTotal={setTotal} start={startPage} />
        <Input
          placeholder="Tìm kiếm"
          type="text"
          className="input-search-topup-point"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={dataSearch.length > 0 ? dataSearch : data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
        />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {totalSearch > 0 ? totalSearch : total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalSearch > 0 ? totalSearch : total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
          <ModalHeader toggle={toggleConfirm}>Duyệt lệnh nạp điểm</ModalHeader>
          <ModalBody>
            <>
              <h4>Bạn có muốn duyệt lệnh nạp điểm cho :</h4>
              <div className="body-modal">
                <a>Khách hàng: {itemEdit?.name_customer}</a>
                <a>Số điểm: {itemEdit?.value}</a>
                <a>Nội dung: {itemEdit?.note}</a>
                <a>
                  Loại điểm:{" "}
                  {itemEdit?.type_point === "point"
                    ? "Điểm thưởng"
                    : "Điểm thứ hạng"}
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
          <ModalHeader toggle={toggle}>Xóa lệnh nạp điểm</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn xóa lệnh nạp điểm của khách hàng
              <a className="text-name-modal">{itemEdit?.name_customer}</a>
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
          <ModalHeader toggle={toggleCancel}>Huỷ lệnh nạp tiền</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn huỷ lệnh nạp điểm của khách hàng
              <a className="text-name-modal">{itemEdit?.name_customer}</a>
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

export default TopupPoint;
