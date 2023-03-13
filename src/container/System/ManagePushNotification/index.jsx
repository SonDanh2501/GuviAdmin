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
import "./index.scss";

const ManagePushNotification = () => {
  const listNotification = useSelector(getListNotifications);
  const totalNotification = useSelector(getNotificationTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("todo");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getNotification.getNotificationRequest({
        status: status,
        start: 0,
        length: 20,
      })
    );
  }, [status]);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * listNotification.length - listNotification.length;

    dispatch(
      getNotification.getNotificationRequest({
        status: status,
        start: start > 0 ? start : 0,
        length: 20,
      })
    );
  };

  const items = [
    {
      key: "1",
      label: <a>Chỉnh sửa</a>,
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
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          {/* <div>
            {data?.is_verify ? (
              <img src={onToggle} className="img-toggle" />
            ) : (
              <img
                src={offToggle}
                className="img-toggle"
                onClick={toggleVerify}
              />
            )}
          </div> */}
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
      ),
    },
  ];

  return (
    <div>
      <h5>Thông báo</h5>
      <div>
        <AddPushNotification />
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
          pagination={false}
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
