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
  createTransactionApi,
  getListTransactionApi,
  getListTransactionV2Api,
  verifyTransactionApi,
} from "../../api/transaction";
import { LENGTH_ITEM } from "../../constants";
import { errorNotify, successNotify } from "../../helper/toast";
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
  // ---------------------------- action ------------------------------------ /
  const onChangeTab = useCallback((item) => {
    setTab(item.value);
    setStartPage(0);
  }, []);
  const onChangePage = useCallback((value) => {
    setStartPage(value);
  }, []);
  const handleTopUp = useCallback((value) => {
    createTransaction({
      transfer_note: value.transfer_note,
      type_transfer: "top_up",
      money: value.money,
      id_collaborator: value.id,
      type_wallet: value.wallet,
      subject: "collaborator",
    });
  }, []);
  const handleWithdraw = useCallback((value) => {
    createTransaction({
      transfer_note: value.transfer_note,
      type_transfer: "withdraw",
      money: value.money,
      id_collaborator: value.id,
      type_wallet: value.wallet,
      subject: "collaborator",
    });
  }, []);
  const createTransaction = useCallback(
    (data) => {
      console.log("dât ", data);
      createTransactionApi(data)
        .then((res) => {
          getList(query);
          console.log("res", res);
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
    },
    [query]
  );
  const handleCancelTransfer = useCallback(() => {
    setOpenModalCancel(false);
  }, []);
  const handleVerifyTransfer = useCallback(() => {
    verifyTransactionApi(item?._id)
      .then((res) => {
        successNotify({
          message: "Duyệt lệnh thành công",
        });
      })
      .catch((err) => {
        console.log("err ", err);
      });
    setOpenModalChangeStatus(false);
    console.log("call APi xác nhận ");
  }, []);
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 1000),
    []
  );
  const getList = useCallback(
    async (_query) => {
      await getListTransactionV2Api(startPage, LENGTH_ITEM, _query)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
          console.log("ress ", res);
        })
        .catch((err) => {
          console.log("err ", err);
        });
    },
    [startPage]
  );
  // ---------------------------- use effect ------------------------------------ //

  useEffect(() => {
    let tempQuery = "";
    if (returnFilter) {
      returnFilter.map((i) => {
        tempQuery = tempQuery + `${i.key}=${i.value}&`;
      });
      tempQuery = tempQuery + `search=${valueSearch}`;
      setQuery(tempQuery);
    }
  }, [returnFilter, valueSearch]);

  useEffect(() => {
    if (query && query !== "") {
      getList(query);
      console.log("query ", query);
    }
  }, [startPage, query]);

  // ---------------------------- UI ------------------------------------ //
  return (
    <div className="transfer-collaborator_container">
      <h5>Sổ quỷ CTV</h5>
      <div className="transfer-collaborator_header">
        <Tabs
          itemTab={itemTabStatus}
          onValueChangeTab={onChangeTab}
          dataTotal={dataTotal}
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
        {/* <div className="transfer-collaborator_search">
          <Input
            placeholder={"Tìm kiếm"}
            prefix={<SearchOutlined />}
            className="input-search"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
          <Button type="primary">Tìm kiếm</Button>
        </div> */}
      </div>
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
        />
      </div>
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

const statisticsTransition = [
  {
    key: "top_up",
    value: 1203000,
    title: "Tổng giá trị NẠP",
    description:
      "Là tổng giá trị mà hệ thống ghi nhận CTV đã nạp thành công vào hệ thống",
    convertMoney: true,
  },
  {
    key: "withdraw",
    value: 203000,
    title: "Tổng giá trị RÚT",
    description:
      "Là tổng giá trị mà hệ thống ghi nhận CTV đã rút tiền ra khỏi hệ thống thành công.",
    convertMoney: true,
  },
  {
    key: "holding",
    value: 2030000,
    title: "Tổng giá trị TẠM GIỮ",
    description:
      "Là tổng số tiền mà hệ thống tạm giữ của CTV khi CTV đang yêu cầu lệnh rút tiền và chờ xét duyệt",
    convertMoney: true,
  },
  {
    key: "reward",
    value: 2030000,
    title: "Tổng giá trị THƯỞNG",
    description:
      "Là tổng giá trị mà hệ thống (hoặc quản trị viên) đã thưởng cho CTV",
    convertMoney: true,
  },
  {
    key: "punish",
    value: 2030000,
    title: "Tổng giá trị PHẠT",
    description: "Là tổng giá trị mà hệ thống (hoặc quản trị viên) đã phạt CTV",
    convertMoney: true,
  },
  // {
  //   key: "total_done_transition",
  //   value: 20,
  //   title: "Giao dịch thành công",
  //   description: "Là tổng số giao dịch mà hệ thống ghi nhận là hoàn thành",
  //   convertMoney: false,
  // },
  // {
  //   key: "total_cancel_transition",
  //   value: 18,
  //   title: "Giao dịch huỷ",
  //   description: "Là tổng số giao dịch mà hệ thống ghi nhận là chưa thành công",
  //   convertMoney: false,
  // },
  {
    key: "total_work_wallet",
    value: 10030000,
    title: "Tổng giá trị ví Nạp",
    description: "Là tổng số tiền còn tồn tại trong ví Nạp của ctv",
    convertMoney: true,
  },
  {
    key: "total_collaborator_wallet",
    value: 1030000,
    title: "Tổng giá trị ví CTV",
    description: "Là tổng số tiền còn tồn tại trong ví CTV của các ctv",
    convertMoney: true,
  },
];
const itemTabStatus = [
  {
    label: "Tất cả",
    value: "all",
    key: 0,
  },
  {
    label: "Đang xử lý",
    value: "processing",
    key: 1,
  },
  {
    label: "Đã chuyển tiền",
    value: "transferred",
    key: 2,
  },
  {
    label: "Tạm giữ",
    value: "hoding",
    key: 3,
  },
  {
    label: "Hoàn thành",
    value: "done",
    key: 4,
  },
];
const dataTotal = [
  {
    value: 400,
  },
  {
    value: 100,
  },
  {
    value: 100,
  },
  {
    value: 80,
  },
  {
    value: 120,
  },
];
