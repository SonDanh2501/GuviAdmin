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
// import {
//   // getListNotifications,
//   // getNotificationTotal,
// } from "../../../redux/selectors/notification";
import AddPushNotification from "./AddPushNotification";
import EditPushNotification from "./EditPushNotification";
import "./index.scss";
import { getListNotifications } from "../../../api/notification";
import ButtonCustom from "../../../components/button";
import DataTable from "../../../components/tables/dataTable";
import FilterData from "../../../components/filterData/filterData";
import { CaretDownOutlined } from "@ant-design/icons";
import { compareDateIsBefore } from "../../../utils/contant";
import icons from "../../../utils/icons";
import CustomHeaderDatatable from "../../../components/tables/tableHeader";

const { IoCaretDown } = icons;

const ManagePushNotification = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const toggle = () => setModal(!modal);
  const toggleVerify = () => setModalVerify(!modalVerify);
  /* ~~~ Value ~~~ */
  const [dataNotifications, setDataNotifications] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todo");
  const [modalVerify, setModalVerify] = useState(false);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [isCreateNotification, setIsCreateNotification] = useState(false); // Giá trị cờ để kiểm tra có tạo thông báo không để fetch lại dữ liệu thông báo
  /* ~~~ List ~~~ */
  // 1. Danh sách các cột của bảng
  const columns = [
    {
      customTitle: (
        <CustomHeaderDatatable title="STT" textToolTip="Số thứ tự" />
      ),
      dataIndex: "",
      key: "ordinal",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày tạo"
          textToolTip="Ngày tạo của thông báo"
        />
      ),
      dataIndex: "",
      key: "date_create",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tiêu đề"
          textToolTip="Tiêu đề hiển thị của thông báo"
        />
      ),
      dataIndex: "",
      key: "notification_title",
      width: 30,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Nội dung"
          textToolTip="Nội dung chi tiết của thông báo"
        />
      ),
      dataIndex: "body",
      key: "text",
      width: 40,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày thông báo"
          textToolTip="Ngày thông báo được gửi đến khách hàng"
        />
      ),
      dataIndex: "body",
      key: "notification_date_schedule",
      width: 20,
    },
  ];
  // 2. Danh sách các trạng thái của bộ lọc
  const statusOptions = [
    { code: "todo", label: "Đang chờ" },
    { code: "done", label: "Đã xong" },
  ];
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu thông báo
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.loadingRequest(true));
        const dataNotificationsFetch = await getListNotifications(
          startPage,
          lengthPage,
          statusFilter
        );
        setDataNotifications(dataNotificationsFetch);
      } catch (err) {
        errorNotify({
          message: err?.message,
        });
      } finally {
        dispatch(loadingAction.loadingRequest(false));
      }
    };
    // 1. Cách chạy 1
    fetchData();
    // 2. Cách chạy 2
    // const timer = setTimeout(() => {
    //   fetchData();
    // }, 2000);
    // return () => clearTimeout(timer);
  }, [dispatch, startPage, lengthPage, statusFilter, isCreateNotification]);
  /* ~~~ Handle function ~~~ */
  const onChangePage = (value) => {
    setStartPage(value);
  };
  /* ~~~ Other ~~~ */
  const filterContent = () => {
    return (
      <div>
        <ButtonCustom
          label="Trạng thái"
          options={statusOptions}
          value={statusFilter}
          setValueSelectedProps={setStatusFilter}
        />
      </div>
    );
  };
  const items = [
    {
      key: "1",
      label: statusFilter === "todo" &&
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
  // const addActionColumn = {
  //   i18n_title: "",
  //   dataIndex: "action",
  //   key: "action",
  //   fixed: "right",
  //   width: 50,
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
  // };
  const onActive = (id, active) => {};
  const onDelete = (id) => {};
  /* ~~~ Main ~~~ */
  return (
    <div className="manage-push-notification">
      {/* Header */}
      <div className="manage-push-notification__label">
        <span className="manage-push-notification__label--header">
          Thông báo
        </span>
      </div>
      {/* Filter */}
      <div>
        <FilterData leftContent={filterContent()} />
      </div>
      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={dataNotifications?.data ? dataNotifications?.data : []}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          onCurrentPageChange={onChangePage}
          // actionColumn={addActionColumn}
          totalItem={dataNotifications?.totalItem}
          headerRightContent={
            <AddPushNotification
              isCreateNotification={isCreateNotification}
              setIsCreateNotification={setIsCreateNotification}
            />
          }
        />
      </div>
      <div style={{ display: `${!modalVerify && "none"}` }}>
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
      <div style={{ display: `${!modal && "none"}` }}>
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
