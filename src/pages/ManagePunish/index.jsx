import { useCallback, useEffect, useState } from "react";
import { LENGTH_ITEM } from "../../constants";
import DataTable from "../../components/tables/dataTable";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Button, Dropdown, Input, Pagination, Popover, Space } from "antd";
import {
  createPunishTicketApi,
  getListPunishTicketApi,
} from "../../api/punish";
import _debounce from "lodash/debounce";
import { SearchOutlined } from "@ant-design/icons";
import TransactionDrawer from "../../components/transactionDrawer";
import PunishDrawer from "../../components/punishDrawer";
import dayjs from "dayjs";
import { successNotify } from "../../helper/toast";
const ManagePunish = () => {
  const [startPage, setStartPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState();
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [data, setData] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const onChangePage = (value) => {
    setStartPage(value);
  };
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
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 1000),
    []
  );
  const getList = (_query) => {
    getListPunishTicketApi(startPage, LENGTH_ITEM, _query)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  const createPunishTicket = (value) => {
    const payload = {
      id_collaborator: value?.id_collaborator,
      id_punish_policy: value?.id_punish_policy,
      date_start_lock_time: value?.start_date,
    };
    createPunishTicketApi(payload)
      .then((res) => {
        getList();
        successNotify({
          message: "Tạo lệnh phạt thành công",
        });
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="manage-punish_container">
      <h5>Quản lý lệnh phạt</h5>
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
    width: 30,
    fontSize: "text-size-M",
  },
  {
    title: "Mã lệnh phạt",
    dataIndex: "id_view",
    key: "id_view",
    width: 50,
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
    key: "status",
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
  {
    title: "Ngày duyệt",
    dataIndex: "date_done",
    key: "date_verify",
    width: 50,
    fontSize: "text-size-M",
  },
  {
    title: "Nội dung",
    dataIndex: "title_punish_ticket",
    key: "title_punish_ticket",
    width: 80,
    fontSize: "text-size-M",
  },
];
