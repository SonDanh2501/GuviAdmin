import { useCallback, useEffect, useState } from "react";
import { LENGTH_ITEM } from "../../constants";
import DataTable from "../../components/tables/dataTable";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  Button,
  Dropdown,
  Input,
  message,
  Pagination,
  Popover,
  Space,
} from "antd";
import {
  cancelPunishTicketApi,
  createPunishTicketApi,
  getListPunishTicketApi,
  getTotalPunishTicketApi,
  revokePunishTicketApi,
  verifyPunishTicketApi,
} from "../../api/punish";
import _debounce from "lodash/debounce";
import { SearchOutlined } from "@ant-design/icons";
import TransactionDrawer from "../../components/transactionDrawer";
import PunishDrawer from "../../components/punishDrawer";
import dayjs from "dayjs";
import { errorNotify, successNotify } from "../../helper/toast";
import ActivityHistory from "../../components/activityHistory";
import { Link, useNavigate } from "react-router-dom";
import CommonFilter from "../../components/commonFilter";
import Tabs from "../../components/tabs/tabs1";
import ModalCustom from "../../components/modalCustom";
import useWindowDimensions from "../../helper/useWindowDimensions";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../redux/selectors/auth";
import i18n from "../../i18n";
import { useSelector } from "react-redux";
import "./index.scss";
import FilterData from "../../components/filterData";
import ButtonCustom from "../../components/button";
import { getProvince, getService } from "../../redux/selectors/service";
import InputTextCustom from "../../components/inputCustom";
import CustomHeaderDatatable from "../../components/tables/tableHeader";

const ManagePunish = () => {
  let { width } = useWindowDimensions();
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const user = useSelector(getUser);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );

  /* ~~~ Value ~~~ */
  const [startDate, setStartDate] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectStatus, setSelectStatus] = useState(""); // Giá trị lựa chọn trạng thái
  const [selectValueUserApply, setSelectValueUserApply] = useState(""); // Giá trị của đối tượng phạt lựa chọn
  const [selectValueCreatedBy, setSelectValueCreatedBy] = useState(""); // Giá trị của đối tượng tạo lệnh phạt
  const [selectValueOfStatusPunishTicket, setSelectValueOfStatusPunishTicket] =
    useState(""); // Giá trị của trạng thái vé phạt
  const [item, setItem] = useState();
  const [total, setTotal] = useState(0);

  /* ~~~ Flag ~~~ */
  const [isLoading, setIsLoading] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalRevoke, setOpenModalRevoke] = useState(false);

  /* ~~~ List ~~~ */
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      key: "case_numbering",
      width: 30,
    },
    {
      customTitle: <CustomHeaderDatatable title="Mã lệnh phạt" />,
      dataIndex: "id_view",
      key: "case_code_punish_ticket",
      width: 70,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày tạo" />,
      dataIndex: "date_create",
      key: "case_date-create-time",
      width: 50,
    },

    {
      customTitle: <CustomHeaderDatatable title="Đối tác" />,
      dataIndex: "collaborator",
      key: "case_collaborator-name-phone",
      width: 70,
    },
    {
      customTitle: <CustomHeaderDatatable title="Tạo bởi" />,
      dataIndex: "id_admin_action",
      key: "case_id_admin_action",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Số tiền"  position="right"/>,
      dataIndex: "punish_money",
      key: "case_money",
      width: 70,
    },
    {
      customTitle: <CustomHeaderDatatable title="Mã đơn hàng"  />,
      dataIndex: "id_order",
      key: "case_code_order",
      width: 70,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày xác nhận"  />,
      dataIndex: "time_end",
      key: "case_date-create-time",
      width: 70,
    },
    {
      customTitle: <CustomHeaderDatatable title="Trạng thái" />,
      dataIndex: "status",
      key: "case_status_ticket",
      width: 70,
    },

  ];
  const [listData, setListData] = useState([]);
  const [statusList, setStatusList] = useState([
    { code: "", label: "Tất cả", total: 0 },
    { code: "processing", label: "Chờ duyệt", total: 0 },
    { code: "pending", label: "Đang xử lý", total: 0 },
    { code: "confirm", label: "Đang xét duyệt", total: 0 },
    { code: "doing", label: "Đang thực thi", total: 0 },
    { code: "done", label: "Hoàn thành", total: 0 },
    { code: "cancel", label: "Đã hủy", total: 0 },
    { code: "revoke", label: "Đã thu hồi", total: 0 },
  ]);
  // Danh sách các đối tượng phạt
  const objectPunishList = [
    { code: "", label: "Tất cả" },
    { code: "collaborator", label: "Đối tác" },
    { code: "customer", label: "Khách hàng" },
  ];
  // Danh sách các đối tượng tạo lệnh phạt
  const objectCreatePunishList = [
    { code: "", label: "Tất cả" },
    { code: "system", label: "Hệ thống" },
    { code: "admin_action", label: "Quản trị viên" },
  ];

  let items = [
    {
      key: "1",
      label: <div onClick={() => setOpenModalRevoke(true)}>Thu hồi</div>,
      disabled: false,
    },
    {
      key: "2",
      label: (
        // checkElement?.includes("delete_transaction") &&
        <p
          onClick={() => {
            errorNotify({
              message: "Tính năng không khả dụng",
            });
          }}
          className="m-0"
        >
          xoá
        </p>
      ),
      disabled: false,
    },
    {
      key: "3",
      label:
        width < 900 ? (
          <a
            onClick={() => setOpenModalChangeStatus(true)}
            style={{ margin: 0 }}
          >
            Xác Nhận
          </a>
        ) : (
          false
        ),
      disabled: false,
    },
    {
      key: "4",
      label:
        width < 900 ? (
          <a onClick={() => setOpenModalCancel(true)} style={{ margin: 0 }}>
            Hủy Bỏ
          </a>
        ) : (
          false
        ),
      disabled: false,
    },
  ];
  // Lọc bỏ những items không có label
  items = items.filter((x) => x.label !== false);

  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: width > 900 ? 60 : 20,
    render: (_, record) => {
      // console.log("CHECK STATUS", record?.status);
      const _isDisableVerify =
        record?.status === "done" ||
        record?.status === "cancel" ||
        record?.status === "revoke" ||
        record?.status === "waiting" ||
        record?.status === "doing" ||
        record?.status === "processing";
      // Set disabled = true nếu status là một trong các trường hợp trên
      if (_isDisableVerify) {
        items?.map((el) => {
          // console.log("CHECK DISABLED >>> ", el?.disabled);
          if (+el?.key === 3 || +el?.key === 4) {
            el.disabled = true;
            // console.log("CHECK DISABLED >>> ", el?.disabled);
          }
        });
      }
      // Nếu không có thì phải trả lại giá trị initial là disabled = false
      else {
        items?.map((el) => {
          el.disabled = false;
        });
      }
      return (
        <div style={{ display: "flex" }}>
          {width < 900 ? (
            <>
              <Space size="middle">
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <a>
                    <UilEllipsisV />
                  </a>
                </Dropdown>
              </Space>
            </>
          ) : (
            <>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <Button
                  disabled={_isDisableVerify}
                  onClick={() => setOpenModalChangeStatus(true)}
                >
                  Xác nhận
                </Button>
                <Button
                  disabled={_isDisableVerify}
                  type="primary"
                  danger
                  onClick={() => setOpenModalCancel(true)}
                >
                  Huỷ
                </Button>
              </div>
              <Space size="middle">
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <a>
                    <UilEllipsisV />
                  </a>
                </Dropdown>
              </Space>
            </>
          )}
        </div>
      );
    },
  };
  /* ~~~ Handle function ~~~ */
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 500),
    []
  );
  // Hàm fetch dữ liệu danh sách các lệnh phạt
  const handleFetchPunishData = async (payload) => {
    try {
      setIsLoading(true);
      const res = await getListPunishTicketApi(
        payload.startPage,
        payload.lengthPage,
        payload.startDate,
        payload.endDate,
        payload.selectStatus,
        payload.selectValueUserApply,
        payload.selectValueCreatedBy,
        payload.valueSearch
      );
      setListData(res?.data);
      setTotal(res?.totalItem);
      setIsLoading(false);
    } catch (err) {
      errorNotify({ message: err?.message || err });
      setIsLoading(false);
    }
  };
  // Hàm fetch dữ liệu tổng của các trạng thái của lệnh phạt
  const handleFetchTotalPunish = async (payload) => {
    try {
      setIsLoading(true);
      const res = await getTotalPunishTicketApi(
        payload.startDate,
        payload.endDate
      );
      setStatusList((prevList) =>
        prevList.map((item) => ({
          ...item,
          total: item?.code === "" ? res["total"] : res[item?.code] || 0,
        }))
      );
      setIsLoading(false);
    } catch (err) {
      errorNotify({ message: err?.message || err });
      setIsLoading(false);
    }
  };
  // Hàm tạo lệnh phạt mới
  const handleCreatePunishTicket = async (value) => {
    try {
      setIsLoading(true);
      let id_order;
      if (value?.id_order && id_order !== "") {
        id_order = value.id_order;
      }
      const payload = {
        id_collaborator: value?.id_collaborator,
        id_punish_policy: value?.id_punish_policy,
        date_start_lock_time: value?.start_date,
        user_apply: "collaborator",
        note_admin: value?.note,
        id_order: id_order,
      };
      const res = await createPunishTicketApi(payload);
      successNotify({
        message: "Tạo lệnh phạt thành công",
      });
      handleFetchPunishData({
        startPage,
        lengthPage,
        startDate,
        endDate,
        selectStatus,
        selectValueUserApply,
        selectValueCreatedBy,
        valueSearch,
      });
      handleFetchTotalPunish({ startDate, endDate });
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setIsLoading(false);
    }
  };
  // Hàm hủy lệnh phạt
  const handleCancelPunishTicket = async () => {
    try {
      setIsLoading(true);
      const res = await cancelPunishTicketApi(item?._id);
      successNotify({
        message: "Hủy lệnh phạt thành công",
      });
      handleFetchPunishData({
        startPage,
        lengthPage,
        startDate,
        endDate,
        selectStatus,
        selectValueUserApply,
        selectValueCreatedBy,
        valueSearch,
      });
      handleFetchTotalPunish({ startDate, endDate });
      setOpenModalCancel(false);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setOpenModalCancel(false);
      setIsLoading(false);
    }
  };
  // Hàm thu hồi lệnh phạt
  const handleRevokePunishTicket = async () => {
    try {
      setIsLoading(true);
      const res = await revokePunishTicketApi(item?._id);
      successNotify({
        message: "Thu hồi lệnh phạt thành công",
      });
      handleFetchPunishData({
        startPage,
        lengthPage,
        startDate,
        endDate,
        selectStatus,
        selectValueUserApply,
        selectValueCreatedBy,
        valueSearch,
      });
      handleFetchTotalPunish({ startDate, endDate });
      setOpenModalRevoke(false);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setOpenModalRevoke(false);
      setIsLoading(false);
    }
  };
  // Hàm xác thực lệnh phạt
  const handleVerifyPunishTicket = async () => {
    try {
      setIsLoading(true);
      const res = await verifyPunishTicketApi(item?._id);
      successNotify({
        message: "Duyệt lệnh phạt thành công",
      });
      handleFetchPunishData({
        startPage,
        lengthPage,
        startDate,
        endDate,
        selectStatus,
        selectValueUserApply,
        selectValueCreatedBy,
        valueSearch,
      });
      handleFetchTotalPunish({ startDate, endDate });
      setOpenModalChangeStatus(false);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setOpenModalChangeStatus(false);
      setIsLoading(false);
    }
  };

  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      handleFetchPunishData({
        startPage,
        lengthPage,
        startDate,
        endDate,
        selectStatus,
        selectValueUserApply,
        selectValueCreatedBy,
        valueSearch,
      });
      handleFetchTotalPunish({ startDate, endDate });
    }
  }, [
    startPage,
    lengthPage,
    startDate,
    endDate,
    selectStatus,
    selectValueUserApply,
    selectValueCreatedBy,
    valueSearch,
  ]);

  /* ~~~ Other ~~~ */
  const filterByStatus = () => {
    return (
      <div className="manage-punish__filter-content">
        {statusList?.map((el) => (
          <div
            onClick={() => setSelectStatus(el.code)}
            className={`manage-punish__filter-content--tab ${
              selectStatus === el.code && "selected"
            }`}
          >
            <span className="manage-punish__filter-content--tab-label">
              {el?.label}
            </span>
            <span className="manage-punish__filter-content--tab-number">
              {el?.total}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const filterContentLeft = () => {
    return (
      <div className="manage-order__filter-content">
        <div className="manage-order__search">
          <div>
            <PunishDrawer
              titleButton="Tạo lệnh phạt"
              subject="collaborator"
              titleHeader="Tạo lệnh phạt cho cộng tác viên"
              onClick={handleCreatePunishTicket}
            />
          </div>
        </div>
      </div>
    );
  };

  const filterContentRight = () => {
    return (
      <div className="manage-punish__filter-content">
        <div>
          <ButtonCustom
            label="Đối tượng phạt"
            options={objectPunishList}
            value={selectValueUserApply}
            setValueSelectedProps={setSelectValueUserApply}
          />
        </div>
        <div>
          <ButtonCustom
            label="Đối tượng tạo lệnh"
            options={objectCreatePunishList}
            value={selectValueCreatedBy}
            setValueSelectedProps={setSelectValueCreatedBy}
          />
        </div>
      </div>
    );
  };

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const onChangeTab = (item) => {
    setSelectValueOfStatusPunishTicket(item);
  };

  console.log("check data >>> ", listData);
  return (
    <div className="manage-punish">
      {/* Header */}
      <div className="manage-punish__header">
        <span>Quản lý lệnh phạt</span>
      </div>
      {/* Filter */}
      <FilterData leftContent={filterByStatus()} />
      {/* Filter */}
      <FilterData
        isTimeFilter={true}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        leftContent={filterContentLeft()}
        rightContent={filterContentRight()}
        rangeDateDefaults={"thirty_last"}
      />
      {/* Data table */}
      <DataTable
        columns={columns}
        data={listData}
        actionColumn={addActionColumn}
        start={startPage}
        pageSize={lengthPage}
        setLengthPage={setLengthPage}
        totalItem={total}
        getItemRow={setItem}
        onCurrentPageChange={onChangePage}
        loading={isLoading}
        headerRightContent={
          <div className="manage-punish__search">
            <div className="manage-punish__search-field">
              <InputTextCustom
                type="text"
                placeHolderNormal={`${i18n.t("search_transaction", {
                  lng: lang,
                })}`}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
        }
      />
      <div>
        <ModalCustom
          isOpen={openModalCancel}
          title={`Huỷ vé phạt`}
          handleOk={handleCancelPunishTicket}
          handleCancel={() => setOpenModalCancel(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn huỷ vé phạt không?</p>
              <p>
                Mã vé phạt: <span className="fw-500">{item?.id_view}</span>
              </p>
              <p>Tên: {item?.id_collaborator?.full_name}</p>
              <p>SĐT: {item?.id_collaborator?.phone}</p>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={openModalChangeStatus}
          title={`Duyệt vé phạt`}
          handleOk={handleVerifyPunishTicket}
          handleCancel={() => setOpenModalChangeStatus(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn duyệt vé phạt này? </p>
              <p>
                Mã vé phạt: <span className="fw-500">{item?.id_view}</span>
              </p>
              <p>Tên: {item?.id_collaborator?.full_name}</p>
              <p>SĐT: {item?.id_collaborator?.phone}</p>
            </>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={openModalRevoke}
          title={`Thu hồi vé phạt`}
          handleOk={handleRevokePunishTicket}
          handleCancel={() => setOpenModalRevoke(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn thu hồi vé phạt này? </p>
              <p>
                Mã vé phạt: <span className="fw-500">{item?.id_view}</span>
              </p>
              <p>Tên: {item?.id_collaborator?.full_name}</p>
              <p>SĐT: {item?.id_collaborator?.phone}</p>
            </>
          }
        />
      </div>
      {/* <div>
        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("delete_order", { lng: lang })}`}
          handleOk={() => deleteOrder(item?._id)}
          handleCancel={toggle}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          body={
            <>
              <p>{`${i18n.t("confirm_delete", { lng: lang })}`}</p>
              <p className="text-name-modal">{item?.id_view}</p>
            </>
          }
        />
      </div> */}
    </div>
  );
};

export default ManagePunish;
