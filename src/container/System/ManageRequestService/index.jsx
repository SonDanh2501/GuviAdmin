import {
  Button,
  DatePicker,
  Dropdown,
  FloatButton,
  Input,
  Select,
  Space,
  Pagination,
} from "antd";
import Tabs from "../../../components/tabs/tabs1";
import DataTable from "../../../components/tables/dataTable";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import i18n from "../../../i18n";
import {
  changeStatusCusomerRequest,
  contactedCusomerRequest,
  deleteCusomerRequest,
  getCusomerRequest,
} from "../../../api/requestCustomer";
import { SearchOutlined } from "@ant-design/icons";
import ModalCustom from "../../../components/modalCustom";
import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import _debounce from "lodash/debounce";
const { TextArea } = Input;
const ManageRequestService = () => {
  const lang = useSelector(getLanguageState);
  const [valueSearch, setValueSearch] = useState("");
  const [startPage, setStartPage] = useState(0);
  const [detectLoading, setDetectLoading] = useState(null);
  const [data, setData] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);
  const [itemRow, setItemRow] = useState(null);

  const columns = [
    {
      i18n_title: "date_create",
      dataIndex: "date_create",
      key: "date_create",
      width: 110,
    },
    {
      i18n_title: "customer",
      dataIndex: "customer",
      key: "customer-name-phone",
      width: 120,
    },
    {
      i18n_title: "address",
      dataIndex: "address",
      key: "address",
      width: 220,
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description_request",
      width: 220,
    },
    {
      i18n_title: "status",
      dataIndex: "status",
      key: "status_request",
      width: 110,
    },
    {
      title: "NV liên hệ",
      dataIndex: null,
      key: "user_contact",
      width: 110,
    },
    {
      i18n_title: "note",
      dataIndex: "note_admin",
      key: "note",
      width: 220,
    },
  ];

  const itemTab = [
    {
      label: "Tất cả",
      value: "all",
      key: 0,
    },
    {
      label: "Đã liên hệ",
      value: "done",
      key: 1,
    },
    {
      label: "Chưa liên hệ",
      value: "pending",
      key: 2,
    },
  ];
  const [tab, setTab] = useState(itemTab[0].value);

  let items = [
    {
      key: "0",
      label: checkElement?.includes("delete_request_service") && (
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  items = items.filter((x) => x.label !== false);

  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 40,
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

  const onChangeTab = (item) => {
    // console.log(item, 'item');
    setTab(item.value);
    setStartPage(0);
    setDetectLoading(item);
  };

  useEffect(() => {
    getListRequest();
  }, [valueSearch, startPage, tab]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setDetectLoading(value);
      setValueSearch(value);
    }, 500),
    []
  );

  const getListRequest = () => {
    getCusomerRequest(valueSearch, startPage, 20, tab, "", lang)
      .then((res) => {
        setData(res?.data);
        setTotalItem(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const contactedRequest = (idCustomer) => {
    setDetectLoading(idCustomer);
    const note_admin = document.getElementById("note_admin").value;
    changeStatusCusomerRequest(idCustomer, {
      status: "done",
      note_admin: note_admin,
    })
      .then(() => {
        setModal(false);
        getListRequest();
      })
      .catch((err) => {});
    // setModalStatus(false);
  };

  return (
    <div className="div-container-content">
      <div className="div-flex-row">
        <div className="div-header-container">
          <h4 className="title-cv">{`${i18n.t("manage_request_service", {
            lng: lang,
          })}`}</h4>
        </div>
        <div className="btn-action-header"></div>
      </div>

      <div className="div-flex-row">
        <Tabs itemTab={itemTab} onValueChangeTab={onChangeTab} />
      </div>

      <div className="div-flex-row">
        <div className="div-filter"></div>
        <div className="div-search">
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            // value={valueSearch}
            prefix={<SearchOutlined />}
            className="input-search"
            onChange={(e) => {
              handleSearch(e.target.value);
              // setValueSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={data}
          actionColumn={addActionColumn}
          start={startPage}
          pageSize={20}
          totalItem={totalItem}
          onCurrentPageChange={onChangePage}
          detectLoading={detectLoading}
          getItemRow={setItemRow}
          onToggleModal={setModal}
        />

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("request_status_change", { lng: lang })}`}
            handleOk={() => contactedRequest(itemRow?._id)}
            textOk={`${i18n.t("yes", { lng: lang })}`}
            handleCancel={toggle}
            body={
              <div>
                <p className="text-body-modal">
                  {`${i18n.t("sure_change_status", { lng: lang })}`}
                </p>
                <p className="text-name-modal">{itemRow?.name_customer}</p>
                <TextArea
                  id="note_admin"
                  rows={4}
                  placeholder="Thêm ghi chú tại đây"
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ManageRequestService;
