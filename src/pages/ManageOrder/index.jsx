import { Dropdown, Space } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../redux/selectors/auth";
import { getProvince, getService } from "../../redux/selectors/service";
import AddCollaboratorOrder from "./DrawerAddCollaboratorToOrder";
import EditTimeOrder from "./EditTimeGroupOrder";
import DataTable from "../../components/tables/dataTable";
import i18n from "../../i18n";
import { Link } from "react-router-dom";
import { UilEllipsisV } from "@iconscout/react-unicons";
import ModalCustom from "../../components/modalCustom";
import { deleteOrderApi, getOrderApi, getTotalOrder } from "../../api/order";
import { errorNotify } from "../../helper/toast";
import InputTextCustom from "../../components/inputCustom";
import ButtonCustom from "../../components/button";
import FilterData from "../../components/filterData";
import "./index.scss";
import { select } from "redux-saga/effects";

const ManageOrder = () => {
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
  const toggle = () => setModal(!modal);

  /* ~~~ Value ~~~ */
  const [valueSearch, setValueSearch] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("date_create");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDuplicate, setIsDuplicate] = useState("");
  const [item, setItem] = useState({ date_work: "" });
  const [modal, setModal] = useState(false);
  const [reCallData, setReCallData] = useState(false);
  const [selectStatus, setSelectStatus] = useState("all"); // Giá trị lựa chọn trạng thái
  const [selectService, setSelectService] = useState(""); // Giá trị lựa chọn dịch vụ
  const [selectCity, setSelectCity] = useState(""); // Giá trị lựa chọn thành phố/tỉnh
  const [selectDistrict, setSelectDistrict] = useState([]); // Giá trị lựa chọn quận/huyện
  const [selectPaymentMethod, setSelectPaymentMethod] = useState(""); // Giá trị lựa chọn phương thức thanh toán

  /* ~~~ List ~~~ */
  // 1. Danh sách các trạng thái của đơn hàng
  const [statusList, setStatusList] = useState([
    { code: "all", label: "Tất cả", total: 0 },
    { code: "processing", label: "Chờ thanh toán", total: 0 },
    { code: "pending", label: "Đang Chờ làm", total: 0 },
    { code: "confirm", label: "Đã nhận", total: 0 },
    { code: "doing", label: "Đang làm", total: 0 },
    { code: "done", label: "Hoàn thành", total: 0 },
    { code: "cancel", label: "Đã hủy", total: 0 },
  ]);
  // Danh sách các phương thức thanh toán
  const paymentMethodList = [
    { code: "all", label: "Tất cả" },
    { code: "cash", label: "Tiền mặt" },
    { code: "point", label: "Ví G-pay" },
    { code: "momo", label: "Momo" },
    { code: "vnpay", label: "VNPAY-QR" },
    { code: "vnbank", label: "VNPAY-ATM" },
    { code: "intcard", label: "Thẻ quốc tế" },
  ];
  // 2. Danh sách các loại dịch vụ
  const serviceList = [{ code: "", label: "Tất cả" }];
  service.forEach((item) => {
    if (user?.id_service_manager?.length === 0) {
      serviceList.push({
        code: item?._id,
        label: item?.title?.[lang],
      });
      return;
    } else {
      user?.id_service_manager?.forEach((i) => {
        if (item?._id === i?._id) {
          serviceList.push({
            code: item?._id,
            label: item?.title?.[lang],
          });
          return;
        }
      });
    }
  });
  // 3. Danh sách các loại thành phố
  const cityList = [{ code: "", label: "Tất cả" }];
  province?.forEach((item) => {
    const itemDistrict = [];
    for (const item2 of item.districts) {
      itemDistrict.push({
        code: item2.code,
        label: item2.name,
      });
    }
    if (user?.area_manager_lv_1?.length === 0) {
      cityList.push({
        code: item?.code,
        label: item?.name,
        district: item?.districts,
      });
      return;
    } else if (user?.area_manager_lv_1?.includes(item?.code)) {
      cityList.push({
        code: item?.code,
        label: item?.name,
        district: item?.districts,
      });
      return;
    }
  });
  // 4. Danh sách các loại quận/huyện của thành phố/tỉnh
  const [districtList, setDistrictList] = useState([]);
  // 5. Danh sách các cột trong bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "code_order",
      dataIndex: "id_view",
      key: "code_order",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "date_create",
      dataIndex: "date_create",
      key: "date_create",
      width: 100,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "customer",
      dataIndex: "customer",
      key: "customer_name_phone_rank",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "service",
      dataIndex: "service._id.title.vi",
      key: "service",
      width: 110,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "date_work",
      dataIndex: "date_work",
      key: "date_work",
      width: 100,
      fontSize: "text-size-M",
      position: "center",
    },
    {
      i18n_title: "address",
      dataIndex: "address",
      key: "text",
      maxLength: 75,
      width: 200,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "collaborator",
      dataIndex: "collaborator",
      key: "collaborator",
      width: 150,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "status",
      dataIndex: "status",
      key: "status",
      width: 130,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "pay",
      dataIndex: "pay",
      key: "pay",
      width: 90,
      fontSize: "text-size-M",
    },
  ];
  // 6. Danh sách các lựa chọn của action Column
  let items = [
    {
      key: "1",
      label: checkElement?.includes("detail_guvi_job") && (
        <Link to={`/details-order/${item?.id_group_order}`}>
          <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
            lng: lang,
          })}`}</p>
        </Link>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("add_collaborator_guvi_job") &&
        (item?.status === "pending" || item?.status === "confirm") && (
          <AddCollaboratorOrder
            idOrder={item?._id}
            idCustomer={item?.id_customer?._id}
            status={item?.status}
            type={selectStatus}
            kind={selectService}
            startPage={startPage}
            setData={setData}
            setTotal={setTotal}
            setIsLoading={setIsLoading}
          />
        ),
    },
    {
      key: "3",
      label: checkElement?.includes("edit_guvi_job") &&
        item?.status !== "done" &&
        item?.status !== "cancel" &&
        item?.status !== "doing" && (
          <EditTimeOrder
            idOrder={item?._id}
            dateWork={item?.date_work}
            reCallData={reCallData}
            setReCallData={setReCallData}
            estimate={item?.total_estimate}
          />
        ),
    },
    {
      key: "4",
      label: checkElement?.includes("delete_order_guvi_job") && (
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];
  // Lọc những items list các option có thể chọn
  items = items.filter((x) => x.label !== false);

  /* ~~~ Handle function ~~~ */
  // 1. Hàm tìm kiếm theo giá trị search
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 500),
    []
  );
  // 2. Hàm fetch dữ liệu bảng
  const getJobList = async () => {
    try {
      setIsLoading(true);
      const res = await getOrderApi(
        valueSearch,
        startPage,
        lengthPage,
        selectStatus,
        selectService,
        type,
        startDate,
        endDate,
        selectCity,
        selectDistrict,
        selectPaymentMethod,
        isDuplicate
      );
      setData(res?.data);
      setTotal(res?.totalItem);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 3. Hàm fetch các giá trị total cho từng trạng thái của đơn hàng
  const getTotal = async () => {
    try {
      if (startDate.trim() !== "" && startDate !== undefined) {
        const res = await getTotalOrder(startDate, endDate);
        setStatusList((prevList) =>
          prevList.map((item) => ({
            ...item,
            total: item?.code === "all" ? res["total"] : res[item?.code] || 0,
          }))
        );
      }
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 4. Hàm xóa đơn hàng (hiện tại đang chạy không được)
  const deleteOrder = (id) => {
    setIsLoading(true);
    deleteOrderApi(id)
      .then((res) => {
        getOrderApi(
          valueSearch,
          startPage,
          lengthPage,
          selectStatus,
          selectService,
          type,
          startDate,
          endDate,
          "",
          ""
        )
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
        setModal(false);
        setIsLoading(false);
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        setIsLoading(false);
      });
  };
  // 5. Hàm chuyển trang
  const onChangePage = (value) => {
    setStartPage(value);
  };

  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu bảng
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      getJobList();
    }
  }, [
    valueSearch,
    startPage,
    selectStatus,
    type,
    startDate,
    endDate,
    reCallData,
    lengthPage,
    selectService,
    selectCity,
    selectDistrict,
    selectPaymentMethod,
    isDuplicate,
  ]);
  // 2. Fetch dữ liệu tổng
  useEffect(() => {
    getTotal();
  }, [
    startDate,
    endDate,
    valueSearch,
    selectStatus,
    selectService,
    selectCity,
    selectDistrict,
    selectPaymentMethod,
  ]);
  // 3. Set giá trị quận/huyện khi thành phố/tỉnh thay đổi
  useEffect(() => {
    const found = cityList?.find((el) => el.code === +selectCity);
    if (found) {
      let tempDistrictList = [];
      found?.district.forEach((element) => {
        tempDistrictList.push({
          code: element?.code,
          label: element?.name,
          ...element,
        });
      });
      setDistrictList(tempDistrictList);
    } else {
      // Nếu trường hợp không tìm thấy thành phố/tỉnh (chọn giá trị tất cả) thì set các giá trị sau về rỗng
      // List quận huyện
      setDistrictList([]);
    }
    setSelectDistrict([]);
  }, [selectCity]);
  // 4. Hàm tự động lấy giá trị ngày bắt đầu và ngày kết thúc từ param
  useEffect(() => {
    // Lấy query string từ URL hiện tại
    const queryString = window.location.search;

    // Chuyển thành đối tượng URLSearchParams
    const params = new URLSearchParams(queryString);
    if (params.get("start_date")) {
      setStartDate(params.get("start_date"));
    }
    if (params.get("end_date")) {
      setEndDate(params.get("end_date"));
    }
    if (params.get("is_duplicate")) {
    setIsDuplicate(params.get("is_duplicate"));
    }
  }, []);

  /* ~~~ Other ~~~ */
  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 50,
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a>
            <UilEllipsisV />
          </a>
        </Dropdown>
      </Space>
    ),
  };
  const filterByStatus = () => {
    return (
      <div className="manage-order__filter-content">
        {statusList?.map((el) => (
          <div
            onClick={() => setSelectStatus(el.code)}
            className={`manage-order__filter-content--tab ${
              selectStatus === el.code && "selected"
            }`}
          >
            <span className="manage-order__filter-content--tab-label">
              {el?.label}
            </span>
            <span className="manage-order__filter-content--tab-number">
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
            <ButtonCustom
              label={`${i18n.t("create_order", { lng: lang })}`}
              onClick={() => navigate("/group-order/manage-order/create-order")}
            />
          </div>
          {/* <div className="manage-order__search-field">
              <InputTextCustom
                type="text"
                placeHolderNormal={`${i18n.t("search_transaction", {
                  lng: lang,
                })}`}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div> */}
        </div>
      </div>
    );
  };
  const filterContentRight = () => {
    return (
      <div className="manage-order__filter-content">
        <div>
          <ButtonCustom
            label="Dịch vụ"
            options={serviceList}
            value={selectService}
            setValueSelectedProps={setSelectService}
          />
        </div>
        <div>
          <ButtonCustom
            label="Phương thức thanh toán"
            options={paymentMethodList}
            value={selectPaymentMethod}
            setValueSelectedProps={setSelectPaymentMethod}
          />
        </div>
        <div>
          <ButtonCustom
            label="Thành phố/Tỉnh"
            options={cityList}
            value={selectCity}
            setValueSelectedProps={setSelectCity}
          />
        </div>
        <div>
          <ButtonCustom
            label="Quận/huyện"
            options={districtList}
            value={selectDistrict}
            setValueSelectedProps={setSelectDistrict}
            disable={districtList?.length > 0 ? false : true}
            type="multiSelect"
          />
        </div>
      </div>
    );
  };

  /* ~~~ Main ~~~ */
  return (
    <div className="manage-order">
      {/* Header */}
      <div className="manage-order__header">
        <span>Danh sách đơn hàng</span>
      </div>
      {/* Filter */}
      <FilterData leftContent={filterByStatus()} />
      {/* Filter */}
      <FilterData
        isTimeFilter={true}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        leftContent={filterContentLeft()}
        rightContent={filterContentRight()}
        rangeDateDefaults={"all"}
      />
      {/* Data table */}
      <DataTable
        columns={columns}
        data={data}
        actionColumn={addActionColumn}
        start={startPage}
        pageSize={lengthPage}
        setLengthPage={setLengthPage}
        totalItem={total}
        getItemRow={setItem}
        onCurrentPageChange={onChangePage}
        loading={isLoading}
        headerRightContent={
          <div className="manage-order__search">
            <div className="manage-order__search-field">
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
      </div>
    </div>
  );
};

export default ManageOrder;
