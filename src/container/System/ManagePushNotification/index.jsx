import { Dropdown, Pagination, Space, Switch, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activePushNotification,
  deletePushNotification,
} from "../../../api/notification";
import ModalCustom from "../../../components/modalCustom";
import { errorNotify } from "../../../helper/toast";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import i18n from "../../../i18n";
import { loadingAction } from "../../../redux/actions/loading";
import { getNotification } from "../../../redux/actions/notification";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import {
  // getListNotifications,
  getNotificationTotal,
} from "../../../redux/selectors/notification";
import AddPushNotification from "./AddPushNotification";
import EditPushNotification from "./EditPushNotification";
import "./index.scss";
import { getListNotifications } from '../../../api/notification'
const ManagePushNotification = () => {
  // const listNotification = useSelector(getListNotifications);
  const totalNotification = useSelector(getNotificationTotal);
  const [itemEdit, setItemEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("todo");
  const [modalVerify, setModalVerify] = useState(false);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     getNotification.getNotificationRequest({
  //       status: status,
  //       start: 0,
  //       length: 20,
  //     })
  //   );
  // }, [status, dispatch]);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getListNotifications(0, 15, 1)
      .then((res) => {
        console.log("check res notification", res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [dispatch, status]);
  const toggle = () => setModal(!modal);
  const toggleVerify = () => setModalVerify(!modalVerify);

  // const onChange = (page) => {
  //   setCurrentPage(page);
  //   const dataLength =
  //     listNotification.length < 20 ? 20 : listNotification.length;
  //   const start = page * dataLength - dataLength;
  //   dispatch(
  //     getNotification.getNotificationRequest({
  //       status: status,
  //       start: start > 0 ? start : 0,
  //       length: 20,
  //     })
  //   );
  // };

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
          message: err?.message,
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
          message: err?.message,
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
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-date-create">
            <p className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("title", { lng: lang })}`,
      render: (data) => <p className="text-title-table">{data?.title}</p>,
    },
    {
      title: `${i18n.t("content", { lng: lang })}`,
      render: (data) => <p className="text-title-table">{data?.body}</p>,
    },
    {
      title: `${i18n.t("announcement_date", { lng: lang })}`,
      render: (data) => (
        <p className="text-title-table">
          {data?.date_schedule
            ? moment(new Date(data?.date_schedule)).format("DD/MM/YYYY - HH:mm")
            : ""}
        </p>
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
                  <Switch
                    checked={data?.is_active}
                    onClick={toggleVerify}
                    style={{
                      backgroundColor: data?.is_active ? "#00cf3a" : "",
                    }}
                  />
                )}
              </div>
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div>
                  <i class="uil uil-ellipsis-v"></i>
                </div>
              </Dropdown>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h5>{`${i18n.t("notification", { lng: lang })}`}</h5>
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
              <p className="text-tab">
                {`${i18n.t(item?.title, { lng: lang })}`}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          // dataSource={listNotification}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
          pagination={false}
          scroll={{
            x: width <= 490 ? 1000 : 0,
          }}
        />
      </div>
      <div className="div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {totalNotification}
        </p>
        <div>
          <Pagination
            current={currentPage}
            // onChange={onChange}
            total={totalNotification}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalVerify}
          title={
            !itemEdit?.is_active === true
              ? `${i18n.t("unlock_noti", { lng: lang })}`
              : `${i18n.t("lock_noti", { lng: lang })}`
          }
          handleOk={() => onActive(itemEdit?._id, itemEdit?.is_active)}
          handleCancel={toggleVerify}
          textOk={
            !itemEdit?.is_active === true
              ? `${i18n.t("lock", { lng: lang })}`
              : `${i18n.t("unlock", { lng: lang })}`
          }
          body={
            <>
              {!itemEdit?.is_active === true
                ? `${i18n.t("want_unlock_noti", { lng: lang })}`
                : `${i18n.t("want_lock_noti", { lng: lang })}`}
              <h6>{itemEdit?.title}</h6>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("remove_notification", { lng: lang })}`}
          handleOk={() => onDelete(itemEdit?._id)}
          handleCancel={toggle}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          body={
            <>
              <p className="m-0">{`${i18n.t("want_remove_notification", {
                lng: lang,
              })}`}</p>
              <p className="text-name-modal m-0">{itemEdit?.title}</p>
            </>
          }
        />
      </div>
    </div>
  );
};

export default ManagePushNotification;

const DATA = [
  {
    id: 1,
    title: "waiting",
    value: "todo",
  },
  {
    id: 2,
    title: "done",
    value: "done",
  },
];
