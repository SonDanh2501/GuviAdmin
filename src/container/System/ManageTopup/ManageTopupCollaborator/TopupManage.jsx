import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Pagination, Select, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  deleteMoneyCollaboratorApi,
  searchTopupCollaboratorApi,
  verifyMoneyCollaboratorApi,
} from "../../../../api/topup";
import AddTopup from "../../../../components/addTopup/addTopup";
import EditPopup from "../../../../components/editTopup/editTopup";
import LoadingPagination from "../../../../components/paginationLoading";
import Withdraw from "../../../../components/withdraw/withdraw";
import { formatMoney } from "../../../../helper/formatMoney";
import { loadingAction } from "../../../../redux/actions/loading";
import { getTopupCollaborator } from "../../../../redux/actions/topup";
import { getUser } from "../../../../redux/selectors/auth";
import { getTopupCTV, totalTopupCTV } from "../../../../redux/selectors/topup";
import "./TopupManage.scss";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TopupManage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [valueSearch, setValueSearch] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const listCollaborators = useSelector(getTopupCTV);
  const totalCollaborators = useSelector(totalTopupCTV);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [modalConfirm, setModalConfirm] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [typeDate, setTypeDate] = useState("week");
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const toggle = () => setModal(!modal);
  const user = useSelector(getUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getTopupCollaborator.getTopupCollaboratorRequest({ start: 0, length: 20 })
    );
  }, [dispatch]);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteMoneyCollaboratorApi(id, { is_delete: true })
      .then((res) => window.location.reload())
      .catch((err) => {
        console.log(err);
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const onConfirm = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    verifyMoneyCollaboratorApi(id, { is_verify_money: true })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        console.log(err);
      });
  }, []);

  const handleSearch = useCallback(
    _debounce((value) => {
      setIsLoading(true);
      setValueSearch(value);
      searchTopupCollaboratorApi(value, 0, 20)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * listCollaborators.length - listCollaborators.length;
    dataFilter.length > 0
      ? searchTopupCollaboratorApi(valueSearch, 0, 20)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getTopupCollaborator.getTopupCollaboratorRequest({
            start: start > 0 ? start : 0,
            length: 20,
          })
        );
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: ["id_collaborator", "id_view"],
    },
    {
      title: "Tên cộng tác viên",
      render: (data) => {
        return (
          <div className="div-name-topup">
            <a>{data?.id_collaborator?.full_name}</a>
            <a>{data?.id_collaborator?.phone}</a>
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
      width: "10%",
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
              disabled={
                (!data?.is_verify_money && data?.status === "cancel") ||
                data?.is_verify_money
                  ? true
                  : false
              }
            >
              Duyệt lệnh
            </button>

            <div className="mt-1">
              <button
                className="btn-edit"
                disabled={
                  (!data?.is_verify_money && data?.status === "cancel") ||
                  data?.is_verify_money
                    ? true
                    : false
                }
                onClick={() => {
                  toggleEdit();
                  setItemEdit(data);
                }}
              >
                <i
                  className={
                    (!data?.is_verify_money && data?.status === "cancel") ||
                    data?.is_verify_money
                      ? "uil uil-edit-alt icon-edit"
                      : "uil uil-edit-alt"
                  }
                ></i>
              </button>

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

  const onChangeDate = useCallback((start, end) => {
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
  }, []);

  return (
    <React.Fragment>
      {/* <div className="div-total">
        <div className="div-date">
          <Input.Group compact>
            <Select defaultValue={typeDate} onChange={(e) => setTypeDate(e)}>
              <Option value="week">Tuần </Option>
              <Option value="month">Tháng</Option>
              <Option value="quarter">Quý</Option>
            </Select>
          </Input.Group>
          <div>
            <RangePicker
              picker={typeDate}
              className="picker"
              onChange={(e) => onChangeDate(e[0]?.$d, e[1]?.$d)}
            />
          </div>
        </div>
        <a className="total-revenue">
          Tổng thu:
          <a className="text-money-revenue">
            <i class="uil uil-arrow-up icon-up"></i>
            {formatMoney(0)}
          </a>
        </a>
        <a className="total-expenditure">
          Tổng chi:
          <a className="text-money-expenditure">
            <i class="uil uil-arrow-down icon-down"></i>
            {formatMoney(0)}
          </a>
        </a>
      </div> */}
      <div className="div-header-topup">
        <AddTopup />
        <Withdraw />
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
          dataSource={dataFilter.length > 0 ? dataFilter : listCollaborators}
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
          //     listCollaborators.length > 0 ? (
          //       <Empty />
          //     ) : (
          //       <Skeleton active={true} />
          //     ),
          // }}
        />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {dataFilter.length > 0 ? totalFilter : totalCollaborators}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={dataFilter.length > 0 ? totalFilter : totalCollaborators}
            showSizeChanger={false}
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
                <a>CTV: {itemEdit?.id_collaborator?.full_name}</a>
                <a>SĐT: {itemEdit?.id_collaborator?.phone}</a>
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
        <EditPopup item={itemEdit} state={modalEdit} setState={toggleEdit} />
      </div>
      {isLoading && <LoadingPagination />}
    </React.Fragment>
  );
}
