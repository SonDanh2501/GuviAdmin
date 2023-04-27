import { Dropdown, Empty, Skeleton, Space, Table, Pagination } from "antd";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";
import "./ReasonManage.scss";

import AddReason from "../../../../../components/addReason/addReason";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getReasons } from "../../../../../redux/actions/reason";
import {
  getReason,
  getReasonTotal,
} from "../../../../../redux/selectors/reason";
import EditReason from "../../../../../components/editReason/editReason";
import { activeReason, deleteReason } from "../../../../../api/reasons";
import { formatMoney } from "../../../../../helper/formatMoney";

export default function ReasonManage() {
  const dispatch = useDispatch();
  const reason = useSelector(getReason);
  const totalReason = useSelector(getReasonTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);

  React.useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(getReasons.getReasonsRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteReason(id, { is_delete: true })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockReason = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeReason(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeReason(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * reason.length - reason.length;
    dispatch(
      getReasons.getReasonsRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            setModalEdit(!modalEdit);
          }}
        >
          Chỉnh sửa
        </a>
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
      dataIndex: ["title", "vi"],
    },
    {
      title: "Mô tả",
      dataIndex: ["description", "vi"],
    },
    {
      title: "Hình thức phạt (phạt tiền hoặc khoá app)",
      dataIndex: "punish_type",
    },
    {
      title: "Phạt tiền / Thời gian khoá app",
      key: "action",
      render: (record) => (
        <a>
          {record?.punish_type === "cash"
            ? formatMoney(record?.punish)
            : record?.punish / (60 * 1000)}
        </a>
      ),
    },
    {
      title: "Đối tượng áp dụng",
      dataIndex: "apply_user",
      filters: [
        {
          text: "Collaborator",
          value: "collaborator",
        },
        {
          text: "Customer",
          value: "customer",
        },
        {
          text: "system_out_confirm",
          value: "system_out_confirm",
        },
        {
          text: "system_out_date",
          value: "system_out_date",
        },
      ],
      onFilter: (value, record) => record.apply_user.indexOf(value) === 0,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <a onClick={toggleBlock}>
            {record?.is_active ? " Chặn" : " Kích hoạt"}
          </a>
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
                <AddReason />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  // onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader>

          <Table
            columns={columns}
            dataSource={reason}
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
            //     reason.length > 0 ? <Empty /> : <Skeleton active={true} />,
            // }}
          />
          <div className="mt-2 div-pagination p-2">
            <a>Tổng: {totalReason}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={totalReason}
                showSizeChanger={false}
              />
            </div>
          </div>
        </Card>
        <div>
          <EditReason
            state={modalEdit}
            setState={() => setModalEdit(!modalEdit)}
            data={itemEdit}
          />
        </div>
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
      </div>
    </React.Fragment>
  );
}
