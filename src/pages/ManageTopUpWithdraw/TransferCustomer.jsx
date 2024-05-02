import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { formatMoney } from "../../helper/formatMoney";
import { Button, Dropdown, Input, Pagination, Popover, Space } from "antd";
import ItemTotal from "./components/ItemTotal";
import Tabs from "../../components/tabs/tabs1";
import { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/tables/dataTable";
import { getElementState } from "../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import _debounce from "lodash/debounce";
import { UilEllipsisV } from "@iconscout/react-unicons";
import FilterTransfer from "./components/TransferFIlter";
import ModalCustom from "../../components/modalCustom";
import i18n from "../../i18n";
import AddTopup from "../../components/addTopup/addTopup";
import TransactionDrawer from "../../components/transactionDrawer";
import {
  cancelTransactionApi,
  createTransactionApi,
  getListTransactionV2Api,
  getTotalMoneyTransactionApi,
  getTotalMoneyTransactionPaySourceApi,
  getTotalTransactionApi,
  getTotalTransactionCustomerApi,
  verifyTransactionApi,
} from "../../api/transaction";
import { LENGTH_ITEM } from "../../constants";
import { errorNotify, successNotify } from "../../helper/toast";
import { endOfDay, startOfDay } from "date-fns";
import CommonFilter from "../../components/commonFilter";
const TransferCustomer = () => {
  const itemTab = [
    {
      label: "Tất cả",
      value: "all",
      key: 0,
    },
    {
      label: "Nạp",
      value: "top_up",
      key: 1,
    },
    {
      label: "Rút",
      value: "withdraw",
      key: 2,
    },
    {
      label: "Phạt",
      value: "phat",
      key: 3,
    },
  ];
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
  let queryDate = "&";
  for (const key of Object.keys(selectedDate)) {
    queryDate += `${key}=${selectedDate[key]}&`;
  }
  let query =
    returnFilter.map((item) => `&${item.key}=${item.value}`).join("") +
    queryDate +
    `status=${tab}&subject=customer`;
  let items = [
    {
      key: "1",
      label: <p style={{ margin: 0 }}>Chi tiết</p>,
    },
    {
      key: "2",
      label: (
        // checkElement?.includes("delete_transaction") &&
        <p className="m-0">xoá</p>
      ),
    },
  ];
  // console.log("quẻ y", query);
  items = items.filter((x) => x.label !== false);
  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 20,
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
  // ---------------------------- handle data ------------------------------------ //
  // const statisticsTransition = [
  //   {
  //     key: "top_up",
  //     value: totalTopUp,
  //     title: "Tổng giá trị NẠP",
  //     description:
  //       "Là tổng giá trị mà hệ thống ghi nhận KH đã nạp thành công vào hệ thống (trong ngày)",
  //     convertMoney: true,
  //   },
  //   {
  //     key: "withdraw",
  //     value: totalWithdraw,
  //     title: "Tổng giá trị RÚT",
  //     description:
  //       "Là tổng giá trị mà hệ thống ghi nhận KH đã rút tiền ra khỏi hệ thống thành công (trong ngày)",
  //     convertMoney: true,
  //   },
  //   {
  //     key: "momo",
  //     value: totalMoMo,
  //     title: "Tổng giá trị Nạp MoMo",
  //     description:
  //       "Là tổng giá trị mà hệ thống ghi nhận KH đã nạp thành công vào hệ thống bằng phương thức nạp tiền MoMo (trong ngày)",
  //     convertMoney: true,
  //   },
  //   {
  //     key: "vnpay",
  //     value: totalVNPay,
  //     title: "Tổng giá trị Nạp VNPAY",
  //     description:
  //       "Là tổng giá trị mà hệ thống ghi nhận KH đã nạp thành công vào hệ thống bằng phương thức nạp tiền VNPay (trong ngày)",
  //     convertMoney: true,
  //   },
  //   {
  //     key: "bank",
  //     value: totalBank,
  //     title: "Tổng giá trị Nạp VNPAY",
  //     description:
  //       "Là tổng giá trị mà hệ thống ghi nhận KH đã nạp thành công vào hệ thống bằng phương thức nạp tiền qua Ngân hàng (trong ngày)",
  //     convertMoney: true,
  //   },
  // ];
  // ---------------------------- action ------------------------------------ /
  const onChangeTab = (item) => {
    if (tab !== item.value) {
      setTab(item.value);
      setStartPage(0);
    }
  };
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const handleTopUp = (value) => {
    createTransaction({
      transfer_note: value.transfer_note,
      type_transfer: "top_up",
      money: value.money,
      id_customer: value.id,
      subject: "customer",
      payment_in: "pay_point",
      payment_out: "other",
    });
  };
  const handleWithdraw = (value) => {
    createTransaction({
      transfer_note: value.transfer_note,
      type_transfer: "withdraw",
      money: value.money,
      id_customer: value.id,
      subject: "customer",
      payment_out: "pay_point",
      payment_in: "other",
    });
  };

  const createTransaction = (data) => {
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
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 1000),
    []
  );
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

  useEffect(() => {
    getList();
  }, [startPage, returnFilter, tab, valueSearch, selectedDate]);

  // ---------------------------- UI ------------------------------------ //
  return (
    <div className="transfer-collaborator_container">
      <h5>Sổ quỹ KH</h5>
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
      <div className="transfer-collaborator_search">
        <div className="transfer-collaborator_transaction">
          <TransactionDrawer
            titleButton="Nạp tiền"
            subject="customer"
            titleHeader="Nạp tiền khách hàng"
            onClick={handleTopUp}
          />
          <TransactionDrawer
            titleButton="Rút tiền"
            titleHeader="Rút tiền khách hàng"
            subject="customer"
            onClick={handleWithdraw}
          />
        </div>
        <Input
          placeholder={"Tìm kiếm"}
          prefix={<SearchOutlined />}
          className="input-search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <Button type="primary">Tìm kiếm</Button>
      </div>
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
          // detectLoading={detectLoading}
        />
      </div>
      {/* ********************** Modal custom ***************************** */}
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
                Số tiền:{" "}
                <span className="fw-500">{formatMoney(item?.money || 0)}</span>{" "}
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

export default TransferCustomer;
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
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Mã giao dịch",
    dataIndex: "id_view",
    key: "code_transaction",
    width: 60,
    fontSize: "text-size-M",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status_transfer",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Tên KH",
    dataIndex: "customer-name-phone",
    key: "customer-name-phone",
    width: 70,
    fontSize: "text-size-M",
  },
  // {
  //   title: "SĐT",
  //   dataIndex: "phone",
  //   key: "phone",
  //   width: 70,
  //   fontSize: "text-size-M",
  // },
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
    dataIndex: "payment_source",
    key: "payment_source",
    width: 60,
    fontSize: "text-size-M",
  },
  // {
  //   title: "Ví",
  //   dataIndex: "type_wallet",
  //   key: "type_wallet",
  //   width: 30,
  //   fontSize: "text-size-M",
  // },
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
];

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
    key: "type_transfer",
    label: "Loại giao dịch",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "withdraw", label: "Rút" },
      { key: "2", value: "top_up", label: "Nạp" },
      { key: "3", value: "pay_service", label: "Thanh toán dịch vụ" },
      { key: "4", value: "refurn_service", label: "Hoàn tiền dịch vụ" },
    ],
  },
  {
    key: "payment_out",
    label: "Phương thức thanh toán",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "bank", label: "Ngân hàng" },
      { key: "2", value: "momo", label: "MoMo" },
      { key: "3", value: "vnpay", label: "VN Pay" },
      { key: "4", value: "viettel_money", label: "Viettel Money" },
    ],
  },
];
