import { Dropdown, Pagination, Space, Table } from "antd";
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
import "./ReasonManage.scss";

import {
  activeReason,
  deleteReason,
  fetchReasons,
  getListReasonCancel,
} from "../../../../../api/reasons";
import offToggle from "../../../../../assets/images/off-button.png";
import onToggle from "../../../../../assets/images/on-button.png";
import AddReason from "../../../../../components/addReason/addReason";
import EditReason from "../../../../../components/editReason/editReason";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getReasons } from "../../../../../redux/actions/reason";
import {
  getReason,
  getReasonTotal,
} from "../../../../../redux/selectors/reason";
import { errorNotify } from "../../../../../helper/toast";
import LoadingPagination from "../../../../../components/paginationLoading";

export default function ReasonManage() {
  const dispatch = useDispatch();
  const totalReason = useSelector(getReasonTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReasons(0, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteReason(id, { is_delete: true })
        .then((res) => {
          setIsLoading(false);
          setModal(false);
          fetchReasons(startPage, 10)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
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

  const blockReason = useCallback(
    (id, is_active) => {
      dispatch(loadingAction.loadingRequest(true));
      if (is_active === true) {
        activeReason(id, { is_active: false })
          .then((res) => {
            setModalBlock(false);
            fetchReasons(startPage, 10)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => console.log(err));
      } else {
        activeReason(id, { is_active: true })
          .then((res) => {
            setModalBlock(false);
            fetchReasons(startPage, 10)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => console.log(err));
      }
    },
    [startPage]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    setStartPage(start);
    fetchReasons(start, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const items = [
    {
      key: "1",
      label: (
        <EditReason
          data={itemEdit}
          setIsLoading={setIsLoading}
          setData={setData}
          setTotal={setTotal}
          startPage={startPage}
        />
      ),
    },
    {
      key: "2",
      label: <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Lý do huỷ việc",
      render: (data) => <a>{data?.title?.vi}</a>,
    },
    {
      title: "Mô tả",
      render: (data) => <a>{data?.description?.vi}</a>,
    },
    {
      title: "Đối tượng áp dụng",
      render: (data) => (
        <a>
          {data?.apply_user === "admin"
            ? "Admin"
            : data?.apply_user === "customer"
            ? "Khách hàng"
            : data?.apply_user === "collaborator"
            ? "Cộng tác viên"
            : "Hệ thống"}
        </a>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    // {
    //   key: "action",
    //   render: (data) => {
    //     return (
    //       <div>
    //         {data?.is_active ? (
    //           <img
    //             className="img-unlock-reason"
    //             src={onToggle}
    //             onClick={toggleBlock}
    //           />
    //         ) : (
    //           <img
    //             className="img-unlock-reason"
    //             src={offToggle}
    //             onClick={toggleBlock}
    //           />
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "",
      key: "action",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
          >
            <a>
              <i class="uil uil-ellipsis-v"></i>
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddReason
                  setIsLoading={setIsLoading}
                  setData={setData}
                  setTotal={setTotal}
                  startPage={startPage}
                />
              </Col>
              {/* <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  // onChange={(e) => handleSearch(e.target.value)}
                />
              </Col> */}
            </Row>
          </CardHeader>

          <Table
            columns={columns}
            dataSource={data}
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
          />
          <div className="mt-2 div-pagination p-2">
            <a>Tổng: {total}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={total}
                showSizeChanger={false}
              />
            </div>
          </div>
        </Card>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa lí do huỷ việc</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa lí do{" "}
                <a className="text-name-modal"> {itemEdit?.title?.vi} </a>này
                không?
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
          <Modal isOpen={modalBlock} toggle={toggleBlock}>
            <ModalHeader toggle={toggleBlock}>
              {" "}
              {itemEdit?.is_active === true
                ? "Khóa lí do huỷ việc"
                : "Mở lí do huỷ việc"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa lí do huỷ việc này"
                : "Bạn có muốn kích hoạt lí do huỷ việc này"}
              <h3>{itemEdit?.title?.vi}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => blockReason(itemEdit?._id, itemEdit?.is_active)}
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
}
