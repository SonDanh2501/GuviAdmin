import { Dropdown, Pagination, Space, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postFile } from "../../../api/file";
import { getNotification } from "../../../redux/actions/notification";
import {
  getListNotifications,
  getNotificationTotal,
} from "../../../redux/selectors/notification";
import AddPushNotification from "./AddPushNotification";
import EditPushNotification from "./EditPushNotification";
import offToggle from "../../../assets/images/off-button.png";
import onToggle from "../../../assets/images/on-button.png";
import "./index.scss";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activePushNotification,
  deletePushNotification,
} from "../../../api/notification";
import { loadingAction } from "../../../redux/actions/loading";
import { errorNotify } from "../../../helper/toast";
import { getElementState } from "../../../redux/selectors/auth";
const width = window.innerWidth;

const ManagePushNotification = () => {
  const listNotification = useSelector(getListNotifications);
  const totalNotification = useSelector(getNotificationTotal);
  const [itemEdit, setItemEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("todo");
  const [modalVerify, setModalVerify] = useState(false);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);

  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(
      getNotification.getNotificationRequest({
        status: status,
        start: 0,
        length: 20,
      })
    );
  }, [status]);
  const toggle = () => setModal(!modal);
  const toggleVerify = () => setModalVerify(!modalVerify);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength =
      listNotification.length < 20 ? 20 : listNotification.length;
    const start = page * dataLength - dataLength;
    dispatch(
      getNotification.getNotificationRequest({
        status: status,
        start: start > 0 ? start : 0,
        length: 20,
      })
    );
  };

  const onActive = (id, active) => {
    dispatch(loadingAction.loadingRequest(true));
    activePushNotification(id, {
      is_active: active ? false : true,
    })
      .then((res) => {
        dispatch(
          getNotification.getNotificationRequest({
            status: status,
            start: 0,
            length: 20,
          })
        );
        setModalVerify(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
        setModalVerify(false);
      });
  };

  const onDelete = (id) => {
    dispatch(loadingAction.loadingRequest(true));

    deletePushNotification(id)
      .then((res) => {
        dispatch(
          getNotification.getNotificationRequest({
            status: status,
            start: 0,
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
        dispatch(loadingAction.loadingRequest(false));
        setModal(false);
      });
  };

  const items = [
    {
      key: "1",
      label: status === "todo" &&
        checkElement?.includes("edit_notification") && (
          <EditPushNotification id={itemEdit?._id} />
        ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_notification") && (
        <a onClick={toggle}>Xoá</a>
      ),
    },
  ];

  const columns = [
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-date-create">
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Tiêu đề",
      render: (data) => <a>{data?.title}</a>,
    },
    {
      title: "Nội dung",
      render: (data) => <a>{data?.body}</a>,
    },
    {
      title: "Ngày thông báo",
      render: (data) => (
        <a>
          {data?.date_schedule
            ? moment(new Date(data?.date_schedule)).format("DD/MM/YYYY - HH:mm")
            : ""}
        </a>
      ),
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <div>
            <Space size="middle">
              <div>
                {checkElement?.includes("active_notification") && (
                  <img
                    src={data?.is_active ? onToggle : offToggle}
                    className="img-toggle"
                    onClick={toggleVerify}
                  />
                )}
              </div>
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottom"
                trigger={["click"]}
              >
                <a>
                  <i class="uil uil-ellipsis-v"></i>
                </a>
              </Dropdown>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h5>Thông báo</h5>
      <div>
        {checkElement?.includes("create_notification") && (
          <AddPushNotification />
        )}
      </div>
      <div className="div-tab mt-5">
        {DATA.map((item) => {
          return (
            <div
              key={item?.id}
              className={
                status === item?.value
                  ? "div-item-tab-selected"
                  : "div-item-tab"
              }
              onClick={() => setStatus(item?.value)}
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={listNotification}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
          pagination={false}
          scroll={
            width <= 490
              ? {
                  x: 1000,
                }
              : null
          }
        />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {totalNotification}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalNotification}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <Modal isOpen={modalVerify} toggle={toggleVerify}>
          <ModalHeader toggle={toggleVerify}>
            {!itemEdit?.is_active === true
              ? "Bật hoạt động cho thông báo"
              : "Ẩn hoạt động cho thông báo"}
          </ModalHeader>
          <ModalBody>
            {!itemEdit?.is_active === true
              ? "Bạn có muốn Bật hoạt động cho thông báo"
              : "Bạn có muốn Ẩn hoạt động cho thông báo"}
            <h3>{itemEdit?.title}</h3>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => onActive(itemEdit?._id, itemEdit?.is_active)}
            >
              Có
            </Button>
            <Button color="#ddd" onClick={toggleVerify}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Xóa thông báo</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn xóa thông báo
              <a className="text-name-modal">{itemEdit?.title}</a> này không?
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
    </div>
  );
};

export default ManagePushNotification;

const DATA = [
  {
    id: 1,
    title: "Đang chờ",
    value: "todo",
  },
  {
    id: 2,
    title: "Đã xong",
    value: "done",
  },
];
