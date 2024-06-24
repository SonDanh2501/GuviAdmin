import { useCallback, useEffect, useState } from "react";
import { LENGTH_ITEM } from "../../constants";
import DataTable from "../../components/tables/dataTable";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Button, Dropdown, Input, Pagination, Popover, Space } from "antd";
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
import { Link } from "react-router-dom";
import CommonFilter from "../../components/commonFilter";
import Tabs from "../../components/tabs/tabs1";
import ModalCustom from "../../components/modalCustom";
const ManagePunish = () => {
  const [startPage, setStartPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState();
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [data, setData] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [returnFilter, setReturnFilter] = useState([]);
  const [totalPunishTicket, setTotalPunishTicket] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    start_date: "2024-02-09T17:00:00.000Z",
    end_date: "2024-04-08T16:59:59.999Z",
  });
  const [currentTab, setCurrentTab] = useState(itemTabStatus[0]);
  const [openModalRevoke, setOpenModalRevoke] = useState(false);
  // ------------------------------ xử lý data ---------------------------------- /
  let queryDate = "&";
  for (const key of Object.keys(selectedDate)) {
    queryDate += `${key}=${selectedDate[key]}&`;
  }
  const query =
    returnFilter.map((item) => `&${item.key}=${item.value}`).join("") +
    queryDate +
    `&search=${valueSearch}`;

  let items = [
    {
      key: "1",
      label: <div onClick={() => setOpenModalRevoke(true)}>Thu hồi</div>,
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
    },
  ];

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
  // ----------------------------- xử lý  action ----------------------------------- //
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 1000),
    []
  );
  const getList = () => {
    getListPunishTicketApi(startPage, LENGTH_ITEM, currentTab.value, query)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const getTotal = () => {
    getTotalPunishTicketApi(query)
      .then((res) => {
        const temp_arr = [];
        for (let i of Object.values(res)) {
          temp_arr.push({ value: i });
        }
        setTotalPunishTicket(temp_arr);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const createPunishTicket = (value) => {
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
    createPunishTicketApi(payload)
      .then((res) => {
        getList();
        successNotify({
          message: "Tạo lệnh phạt thành công",
        });
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
  };
  const onChangeTab = (item) => {
    setCurrentTab(item);
  };
  const handleCancelPunishTicket = () => {
    console.log("vé này sẽ bị huỷ ", item);
    cancelPunishTicketApi(item?._id)
      .then(() => {
        getList();
        getTotal();
        successNotify({
          message: "Huỷ vé phạt thành công",
        });
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
    setOpenModalCancel(false);
  };
  const handleRevoke = () => {
    console.log("thu hooif");
    revokePunishTicketApi(item?._id)
      .then((res) => {
        console.log("ré ", res);
        successNotify({
          message: "Thu hồi lệnh phạt thành công",
        });
        setOpenModalRevoke(false);
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
  };
  const handleVerify = () => {
    console.log("vé này sẽ được duyệt ", item);
    verifyPunishTicketApi(item?._id)
      .then(() => {
        getList();
        getTotal();
        successNotify({
          message: "Duyệt vé phạt thành công",
        });
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
    setOpenModalChangeStatus(false);
  };
  // --------------------------- xử lý useEffect ------------------------------------- //
  useEffect(() => {
    getList();
    getTotal();
  }, [startPage, returnFilter, selectedDate, currentTab, valueSearch]);
  return (
    <div className="manage-punish_container">
      <h5>Quản lý lệnh phạt</h5>
      <CommonFilter
        setDate={setSelectedDate}
        data={dataFilter}
        setReturnFilter={setReturnFilter}
      />
      <Tabs
        itemTab={itemTabStatus}
        onValueChangeTab={onChangeTab}
        dataTotal={totalPunishTicket}
      />
      <div className="transfer-collaborator_search">
        <div className="transfer-collaborator_transaction">
          <PunishDrawer
            titleButton="Tạo lệnh phạt"
            subject="collaborator"
            titleHeader="Tạo lệnh phạt cho cộng tác viên"
            onClick={createPunishTicket}
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
          scrollX={1600}
        />
      </div>
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
          handleOk={handleVerify}
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
          handleOk={handleRevoke}
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
    </div>
  );
};
export default ManagePunish;

const columns = [
  {
    title: "STT",
    dataIndex: "",
    key: "ordinal",
    width: 25,
    fontSize: "text-size-M",
  },
  {
    title: "Mã lệnh phạt",
    dataIndex: "id_view",
    key: "code_punish_ticket",
    width: 53,
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
    title: "Trạng thái",
    dataIndex: "status",
    key: "status_ticket",
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
    title: "Tạo bởi",
    dataIndex: "id_admin_action",
    key: "id_admin_action",
    width: 40,
    fontSize: "text-size-M",
  },
  // {
  //   title: "Mã lệnh giao dịch",
  //   dataIndex: "id_transaction",
  //   key: "id_transaction",
  //   width: 70,
  //   fontSize: "text-size-M",
  // },
  {
    title: "Số tiền",
    dataIndex: "punish_money",
    key: "money",
    width: 70,
    fontSize: "text-size-M",
  },
  {
    title: "Mã đơn hàng",
    dataIndex: "id_order",
    key: "id_view_order",
    width: 70,
    fontSize: "text-size-M",
  },
  {
    title: "Ngày hoàn thành",
    dataIndex: "time_end",
    key: "time_end",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Nội dung",
    dataIndex: "note_admin",
    key: "text",
    width: 80,
    fontSize: "text-size-M",
  },
  // {
  //   dataIndex: "verify",
  //   key: "verify",
  //   width: 50,
  //   fontSize: "text-size-M",
  // },
];

const dataFilter = [
  {
    key: "user_apply",
    label: "Đối tượng phạt",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "collaborator", label: "Cộng tác viên" },
      { key: "2", value: "customer", label: "Khách hàng" },
    ],
  },
  {
    key: "created_by",
    label: "Đối tượng tạo",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "system", label: "Hệ thống" },
      { key: "2", value: "admin_action", label: "Quản trị viên" },
    ],
  },
];
const itemTabStatus = [
  {
    label: "Tất cả",
    key: "0",
    value: "",
  },
  {
    label: "Chờ duyệt",
    key: "1",
    value: "standby",
  },
  {
    label: "Đang xử lý",
    key: "2",
    value: "waiting",
  },
  {
    label: "Đang xét duyệt",
    key: "3",
    value: "processing",
  },
  {
    label: "Đang thực thi",
    key: "4",
    value: "doing",
  },
  {
    label: "Hoàn thành",
    key: "6",
    value: "done",
  },
  {
    label: "Đã huỷ",
    key: "7",
    value: "cancel",
  },
  {
    label: "Đã thu hồi",
    key: "5",
    value: "revoke",
  },
];
