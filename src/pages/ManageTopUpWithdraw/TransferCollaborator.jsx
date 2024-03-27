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
import CommonFilter from "../../components/filter/commonFilter/CommonFilter";
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
  getTotalTransactionApi,
  verifyTransactionApi,
} from "../../api/transaction";
import { LENGTH_ITEM } from "../../constants";
import { errorNotify, successNotify } from "../../helper/toast";
import { endOfDay, startOfDay } from "date-fns";
const TransferCollaborator = () => {
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
  const [tab, setTab] = useState(itemTab[0].value);
  const checkElement = useSelector(getElementState);
  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [total, setTotal] = useState(100);
  const [item, setItem] = useState();
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [returnFilter, setReturnFilter] = useState();
  const [valueSearch, setValueSearch] = useState("");
  const [query, setQuery] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [statePunish, setStatePunish] = useState();
  const [totalTransaction, setTotalTransaction] = useState([]);
  const [totalTopUp, setTotalTopUp] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalHolding, setTotalHolding] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [totalPunish, setTotalPunish] = useState(0);
  const [status, setStatus] = useState({
    label: "Tất cả",
    key: "0",
    value: "",
  });
  const [queryTotal, setQueryTotal] = useState("");
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
  const statisticsTransition = [
    {
      key: "top_up",
      value: totalTopUp,
      title: "Tổng giá trị NẠP",
      description:
        "Là tổng giá trị mà hệ thống ghi nhận CTV đã nạp thành công vào hệ thống (trong ngày)",
      convertMoney: true,
    },
    {
      key: "withdraw",
      value: totalWithdraw,
      title: "Tổng giá trị RÚT",
      description:
        "Là tổng giá trị mà hệ thống ghi nhận CTV đã rút tiền ra khỏi hệ thống thành công (trong ngày)",
      convertMoney: true,
    },
    // {
    //   key: "holding",
    //   value: totalHolding,
    //   title: "Tổng giá trị TẠM GIỮ",
    //   description:
    //     "Là tổng số tiền mà hệ thống tạm giữ của CTV khi CTV đang yêu cầu lệnh rút tiền và chờ xét duyệt (trong ngày)",
    //   convertMoney: true,
    // },
    {
      key: "reward",
      value: totalReward,
      title: "Tổng giá trị THƯỞNG",
      description:
        "Là tổng giá trị mà hệ thống (hoặc quản trị viên) đã thưởng cho CTV (trong ngày)",
      convertMoney: true,
    },
    {
      key: "punish",
      value: totalPunish,
      title: "Tổng giá trị PHẠT",
      description:
        "Là tổng giá trị mà hệ thống (hoặc quản trị viên) đã phạt CTV (trong ngày)",
      convertMoney: true,
    },
  ];
  // ---------------------------- action ------------------------------------ /
  const onChangeTab = (item) => {
    if (tab !== item.value) {
      setTab(item.value);
      setStartPage(0);
      const _temp = returnFilter;
      _temp.pop();
      _temp.push({ key: "status", value: item?.value });
      setReturnFilter(_temp);
    }
  };
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const handleTopUp = (value) => {
    createTransaction({
      transfer_note: value?.note,
      type_transfer: "top_up",
      money: value.money,
      id_collaborator: value?.id,
      type_wallet: value?.wallet,
      subject: "collaborator",
    });
  };
  const handleWithdraw = (value) => {
    createTransaction({
      transfer_note: value.transfer_note,
      type_transfer: "withdraw",
      money: value.money,
      id_collaborator: value.id,
      type_wallet: value.wallet,
      subject: "collaborator",
    });
  };

  const createTransaction = (data) => {
    createTransactionApi(data)
      .then((res) => {
        reCallData();
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
        console.log("ress ", res);
        successNotify({
          message: "Huỷ lệnh giao dịch thành công",
        });
        reCallData();
      })
      .catch((err) => {
        console.log("err ", err);
      });
    setOpenModalCancel(false);
  };
  const handleVerifyTransfer = () => {
    verifyTransactionApi(item?._id)
      .then((res) => {
        successNotify({
          message: "Duyệt lệnh thành công",
        });
        reCallData();
      })
      .catch((err) => {
        console.log("err ", err);
      });
    setOpenModalChangeStatus(false);
  };
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 1000),
    []
  );
  const getList = (_query) => {
    getListTransactionV2Api(startPage, LENGTH_ITEM, _query)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const getTotalMoney = (key, _tempQueryTotal, _setValue) => {
    let result;
    getTotalMoneyTransactionApi(key, _tempQueryTotal)
      .then((res) => {
        _setValue(res?.total);
      })
      .catch((err) => {
        console.log("err ", err);
      });
    return result;
  };
  const getTotal = (_tempQueryTotal) => {
    getTotalTransactionApi(_tempQueryTotal)
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
  const reCallData = () => {
    getList(query);
    getTotal(queryTotal);
    const date = new Date(Date.now());
    const start_date = startOfDay(date).toISOString();
    const end_date = endOfDay(date).toISOString();
    const _query = `subject=collaborator&type_transfer=top_up&start_date=${start_date}
    &end_date=${end_date}`;
    getTotalMoney("top_up", _query, setTotalTopUp);
    getTotalMoney("withdraw", _query, setTotalWithdraw);
    getTotalMoney("reward", _query, setTotalReward);
    getTotalMoney("punish", _query, setTotalPunish);
    getTotalMoney("holding", _query, setTotalHolding);
  };
  // ---------------------------- use effect ------------------------------------ //

  useEffect(() => {
    let tempQuery = "";
    let _tempQueryTotal = "";
    if (returnFilter) {
      returnFilter.map((i) => {
        tempQuery = tempQuery + `${i.key}=${i.value}&`;
        if (i.key === "start_date" || i.key === "end_date") {
          _tempQueryTotal = _tempQueryTotal + `${i.key}=${i.value}&`;
        }
      });
      tempQuery = tempQuery + `search=${valueSearch}`;
      setQuery(tempQuery);
    }
    setQueryTotal(_tempQueryTotal);
  }, [returnFilter, valueSearch, tab]);

  useEffect(() => {
    if (query && query !== "") {
      reCallData();
    }
  }, [startPage, query]);

  // ---------------------------- UI ------------------------------------ //
  return (
    <div className="transfer-collaborator_container">
      <h5>Sổ quỹ CTV</h5>
      <div className="transfer-collaborator_total">
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
      </div>
      <div className="transfer-collaborator_search">
        <div className="transfer-collaborator_transaction">
          <TransactionDrawer
            titleButton="Nạp tiền"
            subject="collaborator"
            titleHeader="Nạp tiền cộng tác viên"
            onClick={handleTopUp}
          />
          <TransactionDrawer
            titleButton="Rút tiền"
            titleHeader="Rút tiền cộng tác viên"
            subject="collaborator"
            onClick={handleWithdraw}
            defaultWallet={"collaborator_wallet"}
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
        <FilterTransfer
          setReturnFilter={setReturnFilter}
          dataFilter={[
            {
              key: "subject",
              default_value: "collaborator",
            },
          ]}
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

export default TransferCollaborator;
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
    key: "id_view",
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
    i18n_title: "collaborator",
    dataIndex: "collaborator",
    key: "collaborator_no_star",
    width: 100,
    fontSize: "text-size-M",
  },
  {
    title: "Loại giao dịch",
    dataIndex: "method_transfer",
    key: "method_transfer",
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
  {
    title: "Ví",
    dataIndex: "type_wallet",
    key: "type_wallet",
    width: 30,
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
