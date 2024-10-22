import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Pagination, Popover, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  cancelTransactionApi,
  createTransactionApi,
  getListTransactionV2Api,
  getTotalMoneyTransactionApi,
  getTotalTransactionApi,
  verifyTransactionApi,
  getListTransactionApi,
} from "../../api/transaction";
import { LENGTH_ITEM } from "../../constants";
import { errorNotify, successNotify } from "../../helper/toast";
import CommonFilter from "../../components/commonFilter";
import {
  getElementState,
  getLanguageState,
  getPermissionState,
} from "../../redux/selectors/auth";
import TransactionDrawer from "../../components/transactionDrawer";
import DataTable from "../../components/tables/dataTable";
import ModalCustom from "../../components/modalCustom";
import { formatMoney } from "../../helper/formatMoney";
import TransactionDrawer2 from "../../components/transactionDrawer/TransactionDrawer2";
import Tabs from "../../components/tabs/tabs1";
import useWindowDimensions from "../../helper/useWindowDimensions";
import i18n from "../../i18n";
import "./index.scss";
import FilterData from "../../components/filterData/filterData";
import ButtonCustom from "../../components/button";
import CustomHeaderDatatable from "../../components/tables/tableHeader";
import { loadingAction } from "../../redux/actions/loading";
import InputTextCustom from "../../components/inputCustom";

const ManageTopUpWithdraw = () => {
  let { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  const permission = useSelector(getPermissionState);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [returnFilter, setReturnFilter] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [totalTransaction, setTotalTransaction] = useState([]);
  // ---------------------------- xử lý data ------------------------------------ //
  // List items trong dấu 3 chấm

  // ---------------------------- action ------------------------------------ /
  // NOTE

  // NOTE
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
      transfer_note: value.transfer_note,
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
  const handleCancelTransfer = () => {
    cancelTransactionApi(item?._id)
      .then((res) => {
        fetchData();
        successNotify({
          message: "Huỷ lệnh giao dịch thành công",
        });
        fetchData();
      })
      .catch((err) => {
        errorNotify({
          message: "Huỷ lệnh giao dịch thất bại \n" + err?.message,
        });
      });
    setOpenModalCancel(false);
  };
  // Action đồng ý lệnh giao dịch
  const handleVerifyTransfer = () => {
    verifyTransactionApi(item?._id)
      .then((res) => {
        successNotify({
          message: "Duyệt lệnh thành công",
        });
        fetchData();
      })

      .catch((err) => {
        errorNotify({
          message: "Duyệt lệnh giao dịch thất bại \n" + err?.message,
        });
      });
    setOpenModalChangeStatus(false);
  };
  /* ~~~~~~~~~~~~~~~~~~~~~~~~ SON ~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* ~~~ Value ~~~ */
  const dispatch = useDispatch();
  const [selectStatus, setSelectStatus] = useState(""); // Giá trị lựa chọn trạng thái
  const [selectObject, setSelectObject] = useState(""); // Giá trị lựa chọn đối tượng
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
    { code: "pending", label: "Đang xử lí", total: 0 },
    { code: "transferred", label: "Đã chuyển tiền", total: 0 },
    { code: "holding", label: "Tạm giữ", total: 0 },
    { code: "done", label: "Hoàn thành", total: 0 },
    { code: "cancel", label: "Đã hủy", total: 0 },
  ]);
  // 2. Danh sách các đối tượng

  // const objectList = [
  // { code: "", label: "Tất cả" },
  // { code: "collaborator", label: "Cộng tác viên" },
  // { code: "customer", label: "Khách hàng" },
  // { code: "other", label: "Khác" },
  // ];
  const [objectList, setObjectList] = useState([
    { code: "", label: "Tất cả" },
    { code: "collaborator", label: "Cộng tác viên" },
    { code: "customer", label: "Khách hàng" },
    { code: "other", label: "Khác" },
  ]);
  // 3. Danh sách các loại giao dịch
  const transferTypeList = [
    { code: "", label: "Tất cả" },
    { code: "withdraw", label: "Rút" },
    { code: "top_up", label: "Nạp" },
  ];
  // 4. Danh sách các loại phương thức thanh toán
  const paymentMethodList = [
    { code: "", label: "Tất cả" },
    { code: "bank", label: "Chuyển khoản" },
    { code: "momo", label: "MoMo" },
    { code: "vnpay", label: "VN Pay" },
    { code: "viettel_money", label: "Viettel Money" },
  ];
  // 5. Danh sách các loại ví
  const walletTypeList = [
    { code: "", label: "Tất cả" },
    { code: "collaborator_wallet", label: "Ví CTV" },
    { code: "work_wallet", label: "Ví công việc" },
    { code: "pay_point", label: "Ví Pay Point" },
    { code: "other", label: "Ví Khác" },
  ];
  // 6. Danh sách các cột của bảng
  const columns = [
    {
      customTitle: (
        <CustomHeaderDatatable title="STT" textToolTip="Số thứ tự" />
      ),
      dataIndex: "",
      key: "ordinal",
      width: 30,
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
      width: 40,
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
      width: 50,
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
      width: 40,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thông tin tài khoản"
          textToolTip="Thông tin tài khoản tài khoản ngân hàng của đối tác"
        />
      ),
      dataIndex: "",
      key: "information",
      width: 50,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Loại tài khoản"
          textToolTip="Loại tài khoản của người yêu cầu lệnh giao dịch"
        />
      ),
      dataIndex: "",
      key: "type_account",
      width: 50,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Loại giao dịch"
          textToolTip="Loại giao dịch (Phiếu thu/ Phiếu chi)"
        />
      ),
      dataIndex: "type_transfer",
      key: "type_transfer",
      width: 50,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số tiền"
          textToolTip="Giá trị của giao dịch"
        />
      ),
      dataIndex: "money",
      key: "money",
      width: 50,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Phương thức thanh toán"
          textToolTip="Phương thức thanh toán (Momo, Chuyển khoản NH, Ví VNPAY, Tiền mặt)"
        />
      ),
      dataIndex: "payment_out",
      key: "",
      width: 60,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Nguồn tiền"
          textToolTip="Nguồn tiền thanh toán đi từ nguồn nào đến"
        />
      ),
      dataIndex: "",
      key: "payment_out",
      width: 40,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tài khoản đến"
          textToolTip="Nơi mà nguồn tiền thanh toán đi đến cuối cùng"
        />
      ),
      dataIndex: "",
      key: "payment_in",
      width: 50,
    },
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
      width: 50,
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
      width: 40,
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
      width: 50,
    },
  ];
  // 7. Danh sách các hành động
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
      dispatch(loadingAction.loadingRequest(true));
      let query =
        selectFilter.map((item) => `&${item.key}=${item.code}`).join("") +
        `&start_date=${startDate}&end_date=${endDate}`;
      const res = await getListTransactionApi(
        startPage,
        lengthPage,
        query,
        valueSearch
      );
      setData(res?.data);
      setTotal(res?.totalItem);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      console.log("Lỗi fetchData: ", err);
    }
  };
  // 3. Hàm fetch số lượng total để hiển thị bên cạnh các tabs
  const fetchTotalData = async () => {
    try {
      let query =
        selectFilter.map((item) => `&${item?.key}=${item?.code}`).join("") +
        `&start_date=${startDate}&end_date=${endDate}`;
      const res = await getTotalTransactionApi(query, valueSearch);
      console.log("check res", res);
        setStatusList((prevList) =>
          prevList.map((item) => ({
            ...item,
            total: item?.code === "" ? res["total"] : res[item?.code],
          }))
        );
      const temp_arr = Object.values(res).map((i) => ({ value: i }));
      setTotalTransaction(temp_arr);
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
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu bảng
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchData();
      fetchTotalData();
    }
  }, [
    startPage,
    returnFilter,
    valueSearch,
    lengthPage,
    selectFilter,
    startDate,
    endDate,
  ]);
  // 2. Cập nhật lại giá trị search
  useEffect(() => {
    setSelectFilter((prevFilter) =>
      prevFilter.map((item) => {
        if (item.key === "status") {
          return { ...item, code: selectStatus };
        } else if (item.key === "subject") {
          return { ...item, code: selectObject };
        } else if (item.key === "type_transfer") {
          return { ...item, code: selectTransferType };
        } else if (item.key === "payment_out") {
          return { ...item, code: selectPaymentMetod };
        } else if (item.key === "payment_in") {
          return { ...item, code: selectWalletType };
        }
        return item; // Giữ nguyên các phần tử khác
      })
    );
  }, [
    selectObject,
    selectStatus,
    selectPaymentMetod,
    selectTransferType,
    selectWalletType,
  ]);
  /* ~~~ Other ~~~ */
  const filterByType = () => {
    return (
      <div className="manage-top-up-with-draw__filter-content">
        {/* Lọc theo loại trạng thái */}
        <div>
          <ButtonCustom
            label="Trạng thái"
            options={statusList}
            value={selectStatus}
            setValueSelectedProps={setSelectStatus}
          />
        </div>
        {/* Lọc theo loại đối tượng */}
        <div>
          <ButtonCustom
            label="Đối tượng"
            options={objectList}
            value={selectObject}
            setValueSelectedProps={setSelectObject}
          />
        </div>
        {/* Lọc theo loại giao dịch */}
        <div>
          <ButtonCustom
            label="Loại giao dịch"
            options={transferTypeList}
            value={selectTransferType}
            setValueSelectedProps={setSelectTransferType}
          />
        </div>
        {/* Lọc theo loại phương thức thanh toán */}
        <div>
          <ButtonCustom
            label="Phương thức thanh toán"
            options={paymentMethodList}
            value={selectPaymentMetod}
            setValueSelectedProps={setSelectPaymentMetod}
          />
        </div>
        {/* Lọc theo loại ví vào */}
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
  const filterDateAndSearch = () => {
    return (
      <div className="manage-top-up-with-draw__filter-content">
        <div className="manage-top-up-with-draw__filter-content--search-field">
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
        record?.status === "revoke" ||
        record?.status === "waiting" ||
        record?.status === "doing" ||
        record?.status === "processing" ||
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
  /* ~~~ Main ~~~ */
  return (
    <div className="manage-top-up-with-draw">
      {/* Header */}
      <div className="manage-top-up-with-draw__header">
        <span>Sổ quỹ</span>
      </div>
      {/* Filter */}
      <FilterData
        isTimeFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        leftContent={filterDateAndSearch()}
      />
      {/* Filter */}
      <FilterData leftContent={filterByType()} />
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
          scrollX={2500}
          actionColumn={addActionColumn}
          getItemRow={setItem}
          headerRightContent={
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
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={openModalCancel}
          title={`Huỷ giao dịch`}
          handleOk={handleCancelTransfer}
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
          handleOk={handleVerifyTransfer}
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

    // <div className="transfer-collaborator_container">
    //   <h5>Sổ quỹ</h5>
    //   {/* <div className="transfer-collaborator_total">
    //     {statisticsTransition.map((item, index) => {
    //       return (
    //         <ItemTotal
    //           key={index}
    //           title={item.title}
    //           description={item.description}
    //           value={item.value}
    //           convertMoney={item.convertMoney}
    //         />
    //       );
    //     })}
    //   </div> */}
    //   Container của nạp, rút, tìm kiếm
    //   <div className="transfer-collaborator_search">
    //     {/*Container của hai button nạp và rút*/}
    //     <div className="transfer-collaborator_transaction">
    //       {/*Nạp tiền*/}
    //       <TransactionDrawer2
    //         titleButton="Phiếu thu"
    //         titleHeader="Phiếu thu"
    //         onClick={handleTopUp}
    //       />
    //       {/*Rút tiền*/}
    //       <TransactionDrawer2
    //         titleButton="Phiếu chi"
    //         titleHeader="Phiếu chi"
    //         onClick={handleWithdraw}
    //       />
    //     </div>
    //     {/*Input search field*/}
    //     <Input
    //       placeholder={`${i18n.t("search_transaction", { lng: lang })}`}
    //       prefix={<SearchOutlined />}
    //       className="input-search"
    //       onChange={(e) => {
    //         handleSearch(e.target.value);
    //       }}
    //     />
    //     {/*Button tìm kiếm*/}
    //     <Button type="primary">Tìm kiếm</Button>
    //   </div>
    //   {/*Container của list of tab và các bộ lọc filter*/}
    //   <div className="transfer-collaborator_header">
    //     {/* <Tabs
    //       itemTab={itemTabStatus}
    //       onValueChangeTab={onChangeTab}
    //       dataTotal={totalTransaction}
    //     />
    //     <CommonFilter
    //       data={dataFilter}
    //       setReturnFilter={setReturnFilter}
    //       setDate={setSelectedDate}
    //     /> */}
    //   </div>
    //   {/*Datatable component*/}
    //   <div>
    //     <DataTable
    //       columns={columns}
    //       data={data}
    //       actionColumn={addActionColumn}
    //       start={startPage}
    //       pageSize={lengthPage}
    //       setLengthPage={setLengthPage}
    //       totalItem={total}
    //       getItemRow={setItem}
    //       onCurrentPageChange={onChangePage}
    //       setOpenModalChangeStatus={setOpenModalChangeStatus}
    //       setOpenModalCancel={setOpenModalCancel}
    //       scrollX={2000}
    //     />
    //   </div>
    //   {/* ********************** Modal custom ***************************** */}
    //   {/*Pop up xác thực*/}
    // <div>
    //   <ModalCustom
    //     isOpen={openModalCancel}
    //     title={`Huỷ giao dịch`}
    //     handleOk={handleCancelTransfer}
    //     handleCancel={() => setOpenModalCancel(false)}
    //     textOk={`Xác nhận`}
    //     body={
    //       <>
    //         <p>Bạn có xác nhận muốn huỷ lệnh giao dịch</p>
    //         <p>
    //           Mã giao dịch: <span className="fw-500">{item?.id_view}</span>
    //         </p>
    //         <p>
    //           Số tiền:{" "}
    //           <span className="fw-500">{formatMoney(item?.money || 0)}</span>{" "}
    //         </p>
    //         <p>
    //           <span className="fw-500">
    //             {item?.id_collaborator?.full_name}
    //           </span>
    //         </p>
    //       </>
    //     }
    //   />
    // </div>
    // <div>
    //   <ModalCustom
    //     isOpen={openModalChangeStatus}
    //     title={`Duyệt giao dịch`}
    //     handleOk={handleVerifyTransfer}
    //     handleCancel={() => setOpenModalChangeStatus(false)}
    //     textOk={`Xác nhận`}
    //     body={
    //       <>
    //         <p>Bạn có xác nhận muốn duyệt lệnh giao dịch</p>
    //         <p>
    //           Mã giao dịch: <span className="fw-500">{item?.id_view}</span>
    //         </p>
    //         <p>
    //           Số tiền:
    //           <span className="fw-500">
    //             {formatMoney(item?.money || 0)}
    //           </span>{" "}
    //         </p>
    //         <p>
    //           Nội dung: <span>{item?.transfer_note}</span>
    //         </p>
    //       </>
    //     }
    //   />
    // </div>
    // </div>
  );
};

export default ManageTopUpWithdraw;

