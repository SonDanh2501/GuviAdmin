import { Dropdown, Pagination, Space, Switch, Table, Tabs } from "antd";
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
  getListNotifications,
  getNotificationTotal,
} from "../../../redux/selectors/notification";
import AddPushNotification from "./AddPushNotification";
import EditPushNotification from "./EditPushNotification";
import "./index.scss";
// import { getListNotifications } from "../../../api/notification";
import ButtonCustom from "../../../components/button";
import DataTable from "../../../components/tables/dataTable";
import FilterData from "../../../components/filterData/filterData";
import { CaretDownOutlined } from "@ant-design/icons";

const ManagePushNotification = () => {
  const listNotification = useSelector(getListNotifications);
  const totalNotification = useSelector(getNotificationTotal);
  const [dataNotifications, setDataNotifications] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("todo");
  const [modalVerify, setModalVerify] = useState(false);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [selectedStatus, setSelectedStatus] = useState("todo");

  /* ~~~ Use effect ~~~ */
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch(loadingAction.loadingRequest(true));
  //       // Chạy API
  //       const dataNotificationsFetch = await getListNotifications(
  //         startPage,
  //         lengthPage,
  //         1
  //       ); // Fetch dữ liệu thông báo
  //       /* Gán giá trị */
  //       setDataNotifications(dataNotificationsFetch);
  //     } catch (err) {
  //       errorNotify({
  //         message: err?.message,
  //       });
  //     } finally {
  //       dispatch(loadingAction.loadingRequest(false));
  //     }
  //   };
  //   fetchData();
  // }, [status, dispatch, startPage, lengthPage]);

  useEffect(() => {
    dispatch(
      getNotification.getNotificationRequest({
        status: status,
        start: startPage,
        length: lengthPage,
      })
    );
  }, [status, dispatch, startPage, lengthPage]);

  const onActive = (id, active) => {
  };

  const onDelete = (id) => {
  };

  
  // const toggle = () => setModal(!modal);
  // const toggleVerify = () => setModalVerify(!modalVerify);

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
  /* ~~~ Handle function ~~~ */
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const handleSelectStatus = ({ key }) => {
    const findStatus = statusOptions.find((el) => el.key === key);
    console.log("check findStatus", findStatus);
    setStatus(findStatus?.key);
  };
  /* ~~~ Data list ~~~ */
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      title: "Ngày tạo",
      key: "date_create",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      title: "Tiêu đề",
      key: "notification_title",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      title: "Nội dung",
      key: "notification_content",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      title: "Ngày thông báo",
      key: "notification_date_schedule",
      width: 60,
      fontSize: "text-size-M",
    },
    //   key: "action",
    //   align: "center",
    //   render: (data) => {
    //     return (
    //       <div>
    //         <Space size="middle">
    //           <div>
    //             {checkElement?.includes("active_notification") && (
    //               <Switch
    //                 checked={data?.is_active}
    //                 onClick={toggleVerify}
    //                 style={{
    //                   backgroundColor: data?.is_active ? "#00cf3a" : "",
    //                 }}
    //               />
    //             )}
    //           </div>
    //           <Dropdown
    //             menu={{
    //               items,
    //             }}
    //             placement="bottomRight"
    //             trigger={["click"]}
    //           >
    //             <div>
    //               <i class="uil uil-ellipsis-v"></i>
    //             </div>
    //           </Dropdown>
    //         </Space>
    //       </div>
    //     );
    //   },
    // },
  ];
  const statusOptions = [
    { key: "todo", label: "Đang chờ" },
    { key: "done", label: "Đã xong" },
  ];


  console.log("check status", status)
  return (
    <div className="manage-push-notification">
      <div className="manage-push-notification__label">
        <span>Thông báo</span>
        {/* <div className="div-tab mt-5">
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
        </div> */}
      </div>
      <FilterData
        content={
          <div>
            <Dropdown
              placement="bottom"
              arrow={{
                pointAtCenter: true,
              }}
              menu={{
                items: statusOptions,
                selectable: true,
                defaultSelectedKeys: [""],
                onSelect: (key) => handleSelectStatus(key),
              }}
              trigger={["click"]}
            >
              <Space>
                <span>Trạng thái: </span>
                <span style={{ cursor: "pointer", fontWeight: 500 }}>
                  {status === "done" ? "Đã xong" : "Đang chờ"}
                </span>
                <CaretDownOutlined />
              </Space>
            </Dropdown>
          </div>
        }
      />
      <div>
        <DataTable
          columns={columns}
          data={listNotification}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          onCurrentPageChange={onChangePage}
          totalItem={totalNotification}
          headerRightContent={<AddPushNotification />}
        />
      </div>
      {/* <div>
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
    </div> */}
    </div>
    // <div>
    //   <h5>{`${i18n.t("notification", { lng: lang })}`}</h5>
    //   <div>
    //     {checkElement?.includes("create_notification") && (
    //       <AddPushNotification />
    //     )}
    //   </div>
    //   <div className="div-tab mt-5">
    //     {DATA.map((item) => {
    //       return (
    //         <div
    //           key={item?.id}
    //           className={
    //             status === item?.value
    //               ? "div-item-tab-selected"
    //               : "div-item-tab"
    //           }
    //           onClick={() => setStatus(item?.value)}
    //         >
    //           <p className="text-tab">
    //             {`${i18n.t(item?.title, { lng: lang })}`}
    //           </p>
    //         </div>
    //       );
    //     })}
    //   </div>
    //   <div className="mt-3">
    //     <Table
    //       columns={columns}
    //       // dataSource={listNotification}
    //       onRow={(record, rowIndex) => {
    //         return {
    //           onClick: (event) => {
    //             setItemEdit(record);
    //           },
    //         };
    //       }}
    //       pagination={false}
    //       scroll={{
    //         x: width <= 490 ? 1000 : 0,
    //       }}
    //     />
    //   </div>
    //   <div className="div-pagination p-2">
    //     <p>
    //       {`${i18n.t("total", { lng: lang })}`}: {totalNotification}
    //     </p>
    //     <div>
    //       <Pagination
    //         current={currentPage}
    //         // onChange={onChange}
    //         total={totalNotification}
    //         showSizeChanger={false}
    //         pageSize={20}
    //       />
    //     </div>
    //   </div>

    //   <div>
    //     <ModalCustom
    //       isOpen={modalVerify}
    //       title={
    //         !itemEdit?.is_active === true
    //           ? `${i18n.t("unlock_noti", { lng: lang })}`
    //           : `${i18n.t("lock_noti", { lng: lang })}`
    //       }
    //       handleOk={() => onActive(itemEdit?._id, itemEdit?.is_active)}
    //       handleCancel={toggleVerify}
    //       textOk={
    //         !itemEdit?.is_active === true
    //           ? `${i18n.t("lock", { lng: lang })}`
    //           : `${i18n.t("unlock", { lng: lang })}`
    //       }
    //       body={
    //         <>
    //           {!itemEdit?.is_active === true
    //             ? `${i18n.t("want_unlock_noti", { lng: lang })}`
    //             : `${i18n.t("want_lock_noti", { lng: lang })}`}
    //           <h6>{itemEdit?.title}</h6>
    //         </>
    //       }
    //     />
    //   </div>
    //   <div>
    //     <ModalCustom
    //       isOpen={modal}
    //       title={`${i18n.t("remove_notification", { lng: lang })}`}
    //       handleOk={() => onDelete(itemEdit?._id)}
    //       handleCancel={toggle}
    //       textOk={`${i18n.t("delete", { lng: lang })}`}
    //       body={
    //         <>
    //           <p className="m-0">{`${i18n.t("want_remove_notification", {
    //             lng: lang,
    //           })}`}</p>
    //           <p className="text-name-modal m-0">{itemEdit?.title}</p>
    //         </>
    //       }
    //     />
    //   </div>
    // </div>
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
