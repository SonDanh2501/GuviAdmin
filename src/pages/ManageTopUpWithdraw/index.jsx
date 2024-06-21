// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import TransferCollaborator from "./TransferCollaborator";
// import TransferCustomer from "./TransferCustomer";
// import CustomTab from "../../components/customTab/CustomTab";
// import TransferStaff from "./TransferStaff";

// const ManageTopUpWithdraw = () => {
//   // const tempData = [
//   //   {
//   //     label: "Cộng tác viên",
//   //     children: <TransferCollaborator />,
//   //   },
//   //   {
//   //     label: "Khách hàng",
//   //     children: <TransferCustomer />,
//   //   },

//   //   {
//   //     label: "Nhân viên",
//   //     children: <TransferStaff />,
//   //   },
//   // ];
//   return (
//     // <>
//     //   <CustomTab dataItems={tempData} />
//     //    </>
//     <div>
//       <h5>SỔ QUỶ</h5>
//     </div>
//   );
// };

// export default ManageTopUpWithdraw;

// const columns = [];

import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Pagination, Popover, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  cancelTransactionApi,
  createTransactionApi,
  getListTransactionV2Api,
  getTotalMoneyTransactionApi,
  getTotalTransactionApi,
  verifyTransactionApi,
} from "../../api/transaction";
import { LENGTH_ITEM } from "../../constants";
import { errorNotify, successNotify } from "../../helper/toast";
import CommonFilter from "../../components/commonFilter";
import { getElementState } from "../../redux/selectors/auth";
import TransactionDrawer from "../../components/transactionDrawer";
import DataTable from "../../components/tables/dataTable";
import ModalCustom from "../../components/modalCustom";
import { formatMoney } from "../../helper/formatMoney";
import TransactionDrawer2 from "../../components/transactionDrawer/TransactionDrawer2";
import Tabs from "../../components/tabs/tabs1";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { EditLocationOutlined } from "@material-ui/icons";
const ManageTopUpWithdraw = () => {
  let { width } = useWindowDimensions();
  const [tab, setTab] = useState(itemTabStatus[0].value);
  const checkElement = useSelector(getElementState);
  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [total, setTotal] = useState(100);
  const [item, setItem] = useState();
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [returnFilter, setReturnFilter] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [totalTransaction, setTotalTransaction] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    start_date: "",
    end_date: "",
  });
  // ---------------------------- xử lý data ------------------------------------ //
  // List items trong dấu 3 chấm
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
  let queryDate = "&";
  for (const key of Object.keys(selectedDate)) {
    queryDate += `${key}=${selectedDate[key]}&`;
  }
  // NOTE
  let query =
    returnFilter.map((item) => `&${item.key}=${item.value}`).join("") +
    queryDate +
    `status=${tab}`;
  // Lọc bỏ những items không có label
  items = items.filter((x) => x.label !== false);
  // Dấu ba chấm
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

  // ---------------------------- action ------------------------------------ /
  // Action đổi tab
  const onChangeTab = (item) => {
    if (tab !== item.value) {
      setTab(item.value);
      setStartPage(0);
    }
  };
  // NOTE
  const onChangePage = (value) => {
    setStartPage(value);
  };
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
        getList();
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
        getList();
        successNotify({
          message: "Huỷ lệnh giao dịch thành công",
        });
        getList();
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
        getList();
      })

      .catch((err) => {
        errorNotify({
          message: "Duyệt lệnh giao dịch thất bại \n" + err?.message,
        });
      });
    setOpenModalChangeStatus(false);
  };
  // Action re-render sau khi search
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      setStartPage(0);
    }, 1000),
    []
  );
  // Fetch dữ liệu
  const getList = () => {
    getListTransactionV2Api(startPage, LENGTH_ITEM, query, valueSearch)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        getTotal();
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  // NOTE
  const getTotal = () => {
    getTotalTransactionApi(query, valueSearch)
      .then((res) => {
        const temp_arr = [];
        for (let i of Object.values(res)) {
          temp_arr.push({ value: i });
        }
        setTotalTransaction(temp_arr);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  // ---------------------------- use effect ------------------------------------ //
  // Re-render nếu một vài giá trị thay đổi
  useEffect(() => {
    if (selectedDate.end_date !== "") {
      getList();
    }
  }, [startPage, returnFilter, tab, valueSearch, selectedDate]);
  // console.log("CHECK DATA >>> ", data);
  // ---------------------------- UI ------------------------------------ //
  return (
    <div className="transfer-collaborator_container">
      <h5>Sổ quỹ</h5>
      {/* <div className="transfer-collaborator_total">
        {statisticsTransition.map((item, index) => {
          return (
            <ItemTotal
              key={index}
              title={item.title}
              description={item.description}
              value={item.value}
              convertMoney={item.convertMoney}
            />
          );
        })}
      </div> */}
      {/*Container của nạp, rút, tìm kiếm*/}
      <div className="transfer-collaborator_search">
        {/*Container của hai button nạp và rút*/}
        <div className="transfer-collaborator_transaction">
          {/*Nạp tiền*/}
          <TransactionDrawer2
            titleButton="Nạp tiền"
            titleHeader="Nạp tiền"
            onClick={handleTopUp}
          />
          {/*Rút tiền*/}
          <TransactionDrawer2
            titleButton="Rút tiền"
            titleHeader="Rút tiền"
            onClick={handleWithdraw}
          />
        </div>
        {/*Input search field*/}
        <Input
          placeholder={"Tìm kiếm"}
          prefix={<SearchOutlined />}
          className="input-search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        {/*Button tìm kiếm*/}
        <Button type="primary">Tìm kiếm</Button>
      </div>
      {/*Container của list of tab và các bộ lọc filter*/}
      <div className="transfer-collaborator_header">
        <Tabs
          itemTab={itemTabStatus}
          onValueChangeTab={onChangeTab}
          dataTotal={totalTransaction}
        />
        <CommonFilter
          data={dataFilter}
          setReturnFilter={setReturnFilter}
          setDate={setSelectedDate}
        />
      </div>
      {/*Datatable component*/}
      <div>
        <DataTable
          columns={columns}
          data={data}
          actionColumn={addActionColumn}
          start={startPage}
          pageSize={LENGTH_ITEM}
          totalItem={total}
          getItemRow={setItem}
          onCurrentPageChange={onChangePage}
          setOpenModalChangeStatus={setOpenModalChangeStatus}
          setOpenModalCancel={setOpenModalCancel}
          scrollX={1600}
        />
      </div>
      {/* ********************** Modal custom ***************************** */}
      {/*Pop up xác thực*/}
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
  );
};

export default ManageTopUpWithdraw;
// Các cột trong table
const columns = [
  {
    title: "STT",
    dataIndex: "",
    key: "ordinal",
    width: 30,
    fontSize: "text-size-M",
  },
  {
    title: "Ngày tạo",
    dataIndex: "date_create",
    key: "date_create",
    width: 45,
    fontSize: "text-size-M",
  },
  {
    title: "Mã giao dịch",
    dataIndex: "code_transaction",
    key: "code_transaction",
    width: 65,
    fontSize: "text-size-M",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status_transfer",
    width: 60,
    fontSize: "text-size-M",
  },
  {
    title: "Đối tượng",
    dataIndex: "",
    key: "subject_transaction",
    width: 70,
    fontSize: "text-size-M",
  },
  {
    title: "Loại giao dịch",
    dataIndex: "type_transfer",
    key: "type_transfer",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    i18n_title: "money",
    dataIndex: "money",
    key: "money",
    width: 40,
    fontSize: "text-size-M",
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment_out",
    key: "payment_out",
    width: 60,
    fontSize: "text-size-M",
  },
  // {
  //   title: "Vào Ví",
  //   dataIndex: "type_wallet",
  //   key: "type_wallet",
  //   width: 60,
  //   fontSize: "text-size-M",
  // },
  {
    title: "Nội dung",
    dataIndex: "transfer_note",
    key: "text",
    width: 80,
    fontSize: "text-size-M",
  },
  {
    dataIndex: "verify",
    key: "verify",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Duyệt bởi",
    dataIndex: "id_admin_verify",
    key: "admin_verify",
    width: 40,
    fontSize: "text-size-M",
  },
  {
    title: "Ngày duyệt",
    dataIndex: "date_verify_created",
    key: "date_verify",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Nguồn vào",
    // dataIndex: "payment_in",
    key: "text",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Nguồn ra",
    // dataIndex: "payment_out",
    key: "text",
    width: 50,
    fontSize: "text-size-M",
  },
];
// Các tab trong list of tabs
const itemTabStatus = [
  {
    label: "Tất cả",
    key: "0",
    value: "",
  },
  {
    label: "Đang xử lý",
    key: "1",
    value: "pending",
  },
  {
    label: "Đã chuyển tiền",
    key: "3",
    value: "transferred",
  },
  {
    label: "Tạm giữ",
    key: "5",
    value: "holding",
  },
  {
    label: "Hoàn thành",
    key: "2",
    value: "done",
  },
  {
    label: "Đã huỷ",
    key: "4",
    value: "cancel",
  },
];

const dataFilter = [
  {
    // Các giá trị filter ở ĐỐI TƯỢNG
    key: "subject",
    label: "Đối tượng",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "collaborator", label: "Cộng tác viên" },
      { key: "2", value: "customer", label: "Khách hàng" },
      { key: "3", value: "other", label: "Khác" },
    ],
  },
  {
    // Các giá trị filter ở LOẠI GIAO DỊCH
    key: "type_transfer",
    label: "Loại giao dịch",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "withdraw", label: "Rút" },
      { key: "2", value: "top_up", label: "Nạp" },
    ],
  },
  {
    // Các giá trị filter ở PHƯƠNG THỨC THANH TOÁN
    key: "payment_out",
    label: "Phương thức thanh toán",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "bank", label: "Chuyển khoản" },
      { key: "2", value: "momo", label: "MoMo" },
      { key: "3", value: "vnpay", label: "VN Pay" },
      { key: "4", value: "viettel_money", label: "Viettel Money" },
    ],
  },
  {
    // Các giá trị filter ở VÀO VÍ
    key: "payment_in",
    label: "Vào Ví",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "collaborator_wallet", label: "Ví CTV" },
      { key: "2", value: "work_wallet", label: "Ví công việc" },
      { key: "3", value: "pay_point", label: "Ví Pay Point" },
      { key: "4", value: "other", label: "Ví Khác" },
    ],
  },
];
