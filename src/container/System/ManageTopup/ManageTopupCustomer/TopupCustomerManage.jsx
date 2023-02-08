import { Empty, Pagination, Skeleton, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  deleteMoneyCustomerApi,
  searchTopupCustomerApi,
  verifyMoneyCustomerApi,
} from "../../../../api/topup";
import AddTopupCustomer from "../../../../components/addTopupCustomer/addTopupCustomer";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import EditPopup from "../../../../components/editTopup/editTopup";
import { formatMoney } from "../../../../helper/formatMoney";
import { loadingAction } from "../../../../redux/actions/loading";
import { getTopupCustomer } from "../../../../redux/actions/topup";
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
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [modalConfirm, setModalConfirm] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const toggle = () => setModal(!modal);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(
      getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 10 })
    );
  }, [dispatch]);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteMoneyCustomerApi(id, { is_delete: true })
      .then((res) => window.location.reload())
      .catch((err) => {
        console.log(err);
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const onConfirm = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    verifyMoneyCustomerApi(id, { is_verify_money: true })
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
      title: "Tên khách hàng",
      dataIndex: ["id_customer", "full_name"],
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
      title: "",
      key: "action",
      render: (data) => {
        return (
          <>
            {!data?.is_verify_money && (
              <button className="btn-confirm" onClick={toggleConfirm}>
                Duyệt lệnh
              </button>
            )}
            {!data?.is_verify_money && (
              <button
                className="btn-edit"
                onClick={() => {
                  toggleEdit();
                  setItemEdit(data);
                }}
              >
                <i className="uil uil-edit-alt"></i>
              </button>
            )}

            <button className="btn-delete" onClick={toggle}>
              <i className="uil uil-trash"></i>
            </button>
          </>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left add">
                <div>
                  <AddTopupCustomer />
                </div>
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader>
          {/* <Table className="align-items-center table-flush " responsive>
            <thead>
              <tr>
                <th>Tên khách hàng</th>
                <th>Số tiền</th>
                <th>Nạp/rút</th>
                <th>Nội dung</th>
                <th>Ngày nạp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageTopup data={e} />)
                : listCustomer &&
                  listCustomer.map((e) => <TableManageTopup data={e} />)}
            </tbody>
          </Table> */}
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
          <div className="div-pagination p-2">
            <a>Tổng: {dataFilter.length > 0 ? totalFilter : totalCustomer}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={dataFilter.length > 0 ? totalFilter : totalCustomer}
                showSizeChanger={false}
              />
            </div>
          </div>
        </Card>
        <div>
          <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
            <ModalHeader toggle={toggleConfirm}>
              Duyệt lệnh nạp tiền
            </ModalHeader>
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
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa giao dịch</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa giao dịch của khách hàng
                <a className="text-name-modal">{itemEdit?.id_customer?.name}</a>
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
      </div>
    </React.Fragment>
  );
}
