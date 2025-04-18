import { Button, Dropdown, message, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  cancelTransactionApi,
  createTransactionApi,
  getTotalTransactionApi,
  verifyTransactionApi,
  getListTransactionApi,
  getListTransactionAffiliateAdminApi,
  verifyTransactionAffiliateAdminApi,
  cancelTransactionAffiliateAdminApi,
} from "../../api/transaction";
import { errorNotify, successNotify } from "../../helper/toast";
import {
  getLanguageState,
  getPermissionState,
} from "../../redux/selectors/auth";
import DataTable from "../../components/tables/dataTable";
import ModalCustom from "../../components/modalCustom";
import { formatMoney } from "../../helper/formatMoney";
import TransactionDrawer2 from "../../components/transactionDrawer/TransactionDrawer2";
import useWindowDimensions from "../../helper/useWindowDimensions";
import i18n from "../../i18n";
import "./index.scss";
import FilterData from "../../components/filterData";
import ButtonCustom from "../../components/button";
import CustomHeaderDatatable from "../../components/tables/tableHeader";
import { loadingAction } from "../../redux/actions/loading";
import InputTextCustom from "../../components/inputCustom";
import { exportToExcel } from "../../utils/contant";

const ManageTopUpWithdraw = (props) => {
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [valueSearch, setValueSearch] = useState("");

  const handleTopUp = (value) => {
    createTransaction({
      transfer_note: value?.note,
      type_transfer: "top_up",
      money: value.money,
      id_collaborator: value?.id,
      id_customer: value.id,
      subject: value?.subject,
      payment_in: value?.payment_in,
      payment_out: value?.payment_out,
      type_wallet: value?.type_wallet,
    });
  };
  // Action rút tiền
  const handleWithdraw = (value) => {
    createTransaction({
      transfer_note: value.note,
      type_transfer: "withdraw",
      money: value.money,
      id_collaborator: value.id,
      id_customer: value.id,
      payment_in: value?.payment_in,
      payment_out: value?.payment_out,
      subject: value?.subject,
      type_wallet: value?.type_wallet,
    });
  };
  // Action tạo mã nạp tiền (cần phải xác nhận)
  const createTransaction = (data) => {
    console.log("data ", data);
    createTransactionApi(data)
      .then((res) => {
        fetchData();
        fetchTotalData();
        successNotify({
          message: "Tạo lệnh giao dịch thành công",
        });
      })
      .catch((err) => {
        console.log("err", err);
        errorNotify({
          message: "Tạo lệnh giao dịch thất bại",
        });
      });
  };
  // Action từ chối (hủy) lệnh giao dịch
  const handleCancelTransfer = async () => {
    try {
      const res = await cancelTransactionApi(item?._id);
      successNotify({
        message: "Huỷ lệnh giao dịch thành công",
      });
      setOpenModalCancel(false);
      await fetchData();
      await fetchTotalData();
    } catch (err) {
      errorNotify({
        message: "Hủy lệnh giao dịch thất bại \n" + err?.message,
      });
    }
  };
  // Action từ chối (hủy) lệnh giao dịch afffiliate
  const handleCancelAffiliateTransfer = async () => {
    try {
      const res = await cancelTransactionAffiliateAdminApi(item?._id);
      successNotify({
        message: "Huỷ lệnh giao dịch thành công",
      });
      setOpenModalCancel(false);
      fetchDataAffiliate();
    } catch (err) {
      errorNotify({
        message: "Hủy lệnh giao dịch thất bại \n" + err?.message,
      });
    }
  };
  // Action đồng ý lệnh giao dịch
  const handleVerifyTransfer = async () => {
    try {
      const res = await verifyTransactionApi(item?._id);
      successNotify({
        message: "Duyệt lệnh thành công",
      });
      await fetchData();
      await fetchTotalData();
      setOpenModalChangeStatus(false);
    } catch (err) {
      errorNotify({
        message: "Duyệt lệnh giao dịch thất bại \n" + err?.message,
      });
    }
  };
  // Action đồng ý lệnh giao dịch affiliate
  const handleVerifyAffiliateTransfer = async () => {
    try {
      const res = await verifyTransactionAffiliateAdminApi(item?._id);
      successNotify({
        message: "Duyệt lệnh thành công",
      });
      await fetchDataAffiliate();
      setOpenModalChangeStatus(false);
    } catch (err) {
      errorNotify({
        message: "Duyệt lệnh giao dịch thất bại \n" + err?.message,
      });
    }
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~ SON ~~~~~~~~~~~~~~~~~~~~~~~~ */
  const { object } = props;
  let { width } = useWindowDimensions();
  const permission = useSelector(getPermissionState);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  const [isLoading, setIsLoading] = useState(false);
  /* ~~~ Value ~~~ */
  const [selectStatus, setSelectStatus] = useState(""); // Giá trị lựa chọn trạng thái
  const [selectObject, setSelectObject] = useState(""); // Giá trị lựa chọn đối tượng (mặc định là đối tác)
  const [selectDateType, setSelectDateType] = useState("date_create"); // Giá trị lựa chọn loại ngày
  const [selectTransferType, setSelectTransferType] = useState(""); // Giá trị lựa chọn loại giao dịch
  const [selectPaymentMetod, setSelectPaymentMetod] = useState(""); // Giá trị lựa chọn phương thức thanh toán
  const [selectWalletType, setSelectWalletMetod] = useState(""); // Giá trị lựa chọn phương thức thanh toán
  const [data, setData] = useState([]); // Giá trị dữ liệu của bảng
  const [total, setTotal] = useState(0); // Giá trị tổng các phần tử trong bảng
  const [startDate, setStartDate] = useState(""); // Giá trị ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Giá trị ngày kết thúc
  const [selectFilter, setSelectFilter] = useState([
    { key: "status", code: "" },
    { key: "subject", code: "" },
    { key: "type_transfer", code: "" },
    { key: "payment_out", code: "" },
    { key: "payment_in", code: "" },
    { key: "type_date", code: "" },
  ]);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [item, setItem] = useState();
  /* ~~~ List ~~~ */
  // 1. Danh sách các loại trạng thái
  const [statusList, setStatusList] = useState([
    { code: "", label: "Tất cả", total: 0 },
    {
      code: `${object === "customer" ? "processing" : "pending"}`,
      label: "Đang xử lý",
      total: 0,
    }, // pending là đang xử lý của đối tác, processing là đang xử lý của khách hàng
    { code: "transferred", label: "Đã chuyển tiền", total: 0 },
    { code: "holding", label: "Tạm giữ", total: 0 },
    { code: "done", label: "Hoàn thành", total: 0 },
    { code: "cancel", label: "Đã hủy", total: 0 },
  ]);
  // 2. Danh sách các đối tượng
  const objectList = [
    { code: "", label: "Tất cả" },
    { code: "collaborator", label: "Đối tác" },
    { code: "customer", label: "Khách hàng" },
    { code: "other", label: "Khác" },
  ];
  // 3. Danh sách các loại giao dịch
  const transferTypeList = [
    { code: "", label: "Tất cả" },
    { code: "withdraw", label: "Phiếu chi" },
    { code: "top_up", label: "Phiếu thu" },
    { code: "order_payment", label: "Phiếu thu VNPAY" },
  ];
  // 4. Danh sách các loại phương thức thanh toán
  const paymentMethodList = [
    { code: "", label: "Tất cả" },
    { code: "bank", label: "Chuyển khoản" },
    { code: "momo", label: "MoMo" },
    { code: "viettel_money", label: "Viettel Money" },
    { code: "vnpay", label: "VNPAY-QR" },
    { code: "vnbank", label: "VNPAY-ATM" },
    { code: "intcard", label: "Thẻ quốc tế" },
  ];
  // 5. Danh sách các loại ví
  const walletTypeList = [
    { code: "", label: "Tất cả" },
    { code: "collaborator_wallet", label: "Ví CTV" },
    { code: "work_wallet", label: "Ví công việc" },
    { code: "pay_point", label: "Ví Pay Point" },
    { code: "other", label: "Ví Khác" },
  ];
  // 6. Danh sách các loại ngày
  const dateTypeList = [
    { code: "date_create", label: "Ngày tạo" },
    { code: "date_verify", label: "Ngày duyệt" },
  ];
  // 7. Danh sách các cột của bảng
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
          textToolTip="Ngày tạo của lệnh giao dịch"
        />
      ),
      dataIndex: "date_create",
      key: "date_create",
      width: 30,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày duyệt"
          textToolTip="Ngày xét duyệt của lệnh giao dịch"
        />
      ),
      dataIndex: "date_verify",
      key: "date_create",
      width: 30,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Mã giao dịch"
          textToolTip="Mã giao dịch của lệnh giao dịch"
        />
      ),
      dataIndex: "code_transaction",
      key: "code_transaction",
      width: 40,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng thái"
          textToolTip="Trạng thái hiện tại của lệnh giao dịch"
        />
      ),
      dataIndex: "status",
      key: "transfer_status",
      width: 35,
    },
    ...(object !== "other"
      ? [
          {
            customTitle: (
              <CustomHeaderDatatable
                title="Thông tin tài khoản"
                textToolTip="Thông tin cơ bản của tài khoản khách hàng/đối tác"
              />
            ),
            dataIndex: "",
            key: "information",
            width: 50,
          },
        ]
      : []),
    ...(object !== "other"
      ? [
          {
            customTitle: (
              <CustomHeaderDatatable
                title="Loại tài khoản"
                textToolTip="Loại tài khoản"
              />
            ),
            dataIndex: "",
            key: "type_account",
            width: 35,
          },
        ]
      : []),

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Loại giao dịch"
          textToolTip="Loại giao dịch (Phiếu thu/ Phiếu chi)"
        />
      ),
      dataIndex: "type_transfer",
      key: "type_transfer",
      width: 35,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số tiền"
          textToolTip="Giá trị của giao dịch"
          position="right"
        />
      ),
      dataIndex: "money",
      key: "money",
      width: 35,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Phương thức TT"
          textToolTip="Phương thức thanh toán (Momo, Chuyển khoản NH, Ví VNPAY, Tiền mặt)"
        />
      ),
      dataIndex: "",
      key: "payment_out",
      width: 45,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Nguồn tiền"
          textToolTip="Nguồn tiền thanh toán đi từ nguồn nào đến"
        />
      ),
      dataIndex: "payment_out",
      key: "",
      width: 35,
    },
    // Chưa làm nên ẩn đi
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Tài khoản đến"
    //       textToolTip="Nơi mà nguồn tiền thanh toán đi đến cuối cùng"
    //     />
    //   ),
    //   dataIndex: "",
    //   key: "payment_in",
    //   width: 40,
    // },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Mô tả giao dịch"
          textToolTip="Nội dung của giao dịch"
        />
      ),
      dataIndex: "transfer_note",
      key: "text",
      width: 50,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Yêu cầu bởi"
          textToolTip="Thông tin cơ bản của người yêu cầu (Họ tên và chức vụ: Khách hàng, đối tác, GUVI)"
        />
      ),
      dataIndex: "",
      key: "created_by",
      width: 45,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Xác nhận bởi"
          textToolTip="Thông tin cơ bản của người xác nhận (Họ tên và chức vụ) hoặc hệ thống xác nhận (Automation)"
        />
      ),
      dataIndex: "id_admin_verify",
      key: "admin_verify",
      width: 35,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thời gian xác nhận"
          textToolTip="Thời gian yêu cầu được duyệt"
        />
      ),
      dataIndex: "date_verify_created",
      key: "date_verify",
      width: 45,
      position: "center",
    },
  ];
  // 8. Danh sách các hành động
  let items = [
    {
      key: "1",
      label: <p style={{ margin: 0 }}>Chi tiết</p>,
      disabled: false,
    },
    {
      key: "2",
      label: <p className="m-0">Xóa</p>,
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
  /* ~~~ Handle function ~~~ */
  // 1. Hàm xử lí đổi trang
  const onChangePage = (value) => {
    setStartPage(value);
  };
  // 2. Hàm fetch dữ liệu
  const fetchData = async () => {
    try {
      setIsLoading(true);
      let query =
        selectFilter.map((item) => `&${item.key}=${item.code}`).join("") +
        `&start_date=${startDate}&end_date=${endDate}`;

      const res = await getListTransactionApi(
        startPage,
        lengthPage,
        query,
        valueSearch,

      );
      setData(res?.data);
      setTotal(res?.totalItem);
      setIsLoading(false);
    } catch (err) {
      console.log("Lỗi fetchData: ", err);
    }
  };
  // 3. Hàm fetch số lượng total để hiển thị bên cạnh các tabs
  const fetchTotalData = async () => {
    try {
      let selectFilterNoStatus = selectFilter.filter(
        (el) => el.key !== "status"
      );

      let query =
        selectFilterNoStatus
          .map((item) => `&${item?.key}=${item?.code}`)
          .join("") + `&start_date=${startDate}&end_date=${endDate}`;

      const res = await getTotalTransactionApi(query, valueSearch);
      setStatusList((prevList) =>
        prevList.map((item) => ({
          ...item,
          total: item?.code === "" ? res["total"] : res[item?.code],
        }))
      );
      const temp_arr = Object.values(res).map((i) => ({ value: i }));
    } catch (err) {
      console.log("Lỗi fetchTotalData: ", err);
    }
  };
  // 4. Hàm searching
  const handleSearch = useCallback(
    _.debounce((value) => {
      setValueSearch(value);
      setStartPage(0);
    }, 500),
    []
  );
  // 5. Hàm fetch dữ liệu của affiliate
  const fetchDataAffiliate = async () => {
    try {
      setIsLoading(true);
      let query =
        selectFilter.map((item) => `&${item.key}=${item.code}`).join("") +
        `&start_date=${startDate}&end_date=${endDate}`;
      const res = await getListTransactionAffiliateAdminApi(
        startPage,
        lengthPage,
        query,
        valueSearch
      );
      setData(res?.data);
      setTotal(res?.totalItem);
      setIsLoading(false);
    } catch (err) {
      console.log("Lỗi fetchData: ", err);
    }
  };
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu bảng
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      if (object !== "affiliate") {
        fetchData();
      } else {
        fetchDataAffiliate();
      }
    }
  }, [startPage, valueSearch, lengthPage, selectFilter, startDate, endDate, selectDateType]);
  // 2. Fetch dữ liệu total
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchTotalData();
    }
  }, [valueSearch, selectFilter, startDate, endDate]);
  // 3. Cập nhật lại giá trị search
  useEffect(() => {
    setSelectFilter((prevFilter) =>
      prevFilter.map((item) => {
        if (item.key === "status") {
          return { ...item, code: selectStatus };
        } else if (item.key === "subject") {
          // return { ...item, code: selectObject };
          return { ...item, code: object !== "affiliate" ? object : "" };
        } else if (item.key === "type_transfer") {
          return { ...item, code: selectTransferType };
        } else if (item.key === "payment_out") {
          return { ...item, code: selectPaymentMetod };
        } else if (item.key === "payment_in") {
          return { ...item, code: selectWalletType };
        } else if (item.key === "type_date") {
          return { ...item, code: selectDateType };
        }
        return item; // Giữ nguyên các phần tử khác
      })
    );
  }, [
    // selectObject,
    object,
    selectStatus,
    selectPaymentMetod,
    selectTransferType,
    selectWalletType,
    selectDateType
  ]);

  // 4. Hàm tự động lấy giá trị từ param
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
    if (params.get("type_date")) {
      setSelectDateType(params.get("type_date"));
    }
  }, []);

  useEffect(() => {
    setStatusList([
      { code: "", label: "Tất cả", total: 0 },
      {
        code: object === "customer" ? "processing" : "pending",
        label: "Đang xử lý",
        total: 0,
      },
      { code: "transferred", label: "Đã chuyển tiền", total: 0 },
      { code: "holding", label: "Tạm giữ", total: 0 },
      { code: "done", label: "Hoàn thành", total: 0 },
      { code: "cancel", label: "Đã hủy", total: 0 },
    ]);
  }, [object]); // Theo dõi sự thay đổi của `object`
  
  /* ~~~ Other ~~~ */
  const leftContent = () => {
    return (
      <div className="manage-top-up-with-draw__table--right-header">
        <TransactionDrawer2
          titleButton="Phiếu thu"
          titleHeader="Phiếu thu"
          onClick={handleTopUp}
        />
        <TransactionDrawer2
          titleButton="Phiếu chi"
          titleHeader="Phiếu chi"
          onClick={handleWithdraw}
        />
      </div>
    );
  };
  const rightContent = () => {
    return (
      <div className="manage-top-up-with-draw__filter-content">
        <div>
          <ButtonCustom
            label="Loại ngày"
            options={dateTypeList}
            value={selectDateType}
            setValueSelectedProps={setSelectDateType}
          />
        </div>
        <div>
          <ButtonCustom
            label="Đối tượng"
            options={objectList}
            value={object}
            setValueSelectedProps={setSelectObject}
            disable={true}
          />
        </div>
        <div>
          <ButtonCustom
            label="Loại giao dịch"
            options={transferTypeList}
            value={selectTransferType}
            setValueSelectedProps={setSelectTransferType}
          />
        </div>
        <div>
          <ButtonCustom
            label="Phương thức thanh toán"
            options={paymentMethodList}
            value={selectPaymentMetod}
            setValueSelectedProps={setSelectPaymentMetod}
          />
        </div>
        <div>
          <ButtonCustom
            label="Vào ví"
            options={walletTypeList}
            value={selectWalletType}
            setValueSelectedProps={setSelectWalletMetod}
          />
        </div>
      </div>
    );
  };
  const totalByStatusFilter = () => {
    return (
      <div className="manage-top-up-with-draw__filter-content">
        {object !== "affiliate" &&
          statusList?.map((el) => (
            <div
              onClick={() => setSelectStatus(el.code)}
              className={`manage-top-up-with-draw__filter-content--tab ${
                selectStatus === el.code && "selected"
              }`}
            >
              <span className="manage-top-up-with-draw__filter-content--tab-label">
                {el?.label}
              </span>
              <span className="manage-top-up-with-draw__filter-content--tab-number">
                {el?.total}
              </span>
            </div>
          ))}
        {object === "affiliate" &&
          statusList
            ?.filter(
              (status) =>
                status.code !== "transferred" && status.code !== "pending"
            )
            .map((el) => (
              <div
                onClick={() => setSelectStatus(el.code)}
                className={`manage-top-up-with-draw__filter-content--tab ${
                  selectStatus === el.code && "selected"
                }`}
              >
                <span className="manage-top-up-with-draw__filter-content--tab-label">
                  {el?.label}
                </span>
                <span className="manage-top-up-with-draw__filter-content--tab-number">
                  {el?.total}
                </span>
              </div>
            ))}
      </div>
    );
  };
  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: width > 900 ? 35 : 25,
    render: (_, record) => {
      const _isDisableVerify =
        record?.status === "done" ||
        record?.status === "cancel" ||
        // record?.status === "revoke" ||
        // record?.status === "waiting" ||
        // record?.status === "doing" ||
        // record?.status === "processing" ||
        !permission.find((el) => el.name_api === "Duyệt/huỷ lệnh nạp CTV");
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

  console.log("check statusList >>>", statusList, object);
  /* ~~~ Main ~~~ */
  return (
    <div className="manage-top-up-with-draw">
      {/* Header */}
      <div className="manage-top-up-with-draw__header">
        <span>Sổ quỹ</span>
      </div>
      {/* Filter */}
      <FilterData leftContent={totalByStatusFilter()} />
      {/* Filter */}
      <FilterData
        isTimeFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        leftContent={object !== "affiliate" ? leftContent() : ""}
        rightContent={object !== "affiliate" ? rightContent() : ""}
      />
      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={data}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          onCurrentPageChange={onChangePage}
          scrollX={2300}
          actionColumn={addActionColumn}
          getItemRow={setItem}
          loading={isLoading}
          headerRightContent={
            <div className="manage-top-up-with-draw__table--right-header">
              <div className="manage-top-up-with-draw__table--right-header--search-field">
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
      </div>
      {/* Modal */}
      <div>
        <ModalCustom
          isOpen={openModalCancel}
          title={`Huỷ giao dịch`}
          handleOk={
            object !== "affiliate"
              ? handleCancelTransfer
              : handleCancelAffiliateTransfer
          }
          handleCancel={() => setOpenModalCancel(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn huỷ lệnh giao dịch</p>
              <p>
                Mã giao dịch: <span className="fw-500">{item?.id_view}</span>
              </p>
              <p>
                Số tiền:{" "}
                <span className="fw-500">{formatMoney(item?.money || 0)}</span>{" "}
              </p>
              <p>
                <span className="fw-500">
                  {item?.id_collaborator?.full_name}
                </span>
              </p>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={openModalChangeStatus}
          title={`Duyệt giao dịch`}
          handleOk={
            object !== "affiliate"
              ? handleVerifyTransfer
              : handleVerifyAffiliateTransfer
          }
          handleCancel={() => setOpenModalChangeStatus(false)}
          textOk={`Xác nhận`}
          body={
            <>
              <p>Bạn có xác nhận muốn duyệt lệnh giao dịch</p>
              <p>
                Mã giao dịch: <span className="fw-500">{item?.id_view}</span>
              </p>
              <p>
                Số tiền:
                <span className="fw-500">
                  {formatMoney(item?.money || 0)}
                </span>{" "}
              </p>
              <p>
                Nội dung: <span>{item?.transfer_note}</span>
              </p>
            </>
          }
        />
      </div>
    </div>
  );
};

export default ManageTopUpWithdraw;