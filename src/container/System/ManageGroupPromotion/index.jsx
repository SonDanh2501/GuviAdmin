import {
  UilEllipsisH,
  UilFileExport,
  UilTimes,
} from "@iconscout/react-unicons";
import { SearchOutlined } from "@ant-design/icons";
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
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../redux/selectors/auth";
import { getProvince, getService } from "../../../redux/selectors/service";
import AddCollaboratorOrder from "./DrawerAddCollaboratorToOrder";
import EditTimeOrder from "./EditTimeGroupOrder";
import DataTable from "../../../components/tables/dataTable";
import i18n from "../../../i18n";
import { Link } from "react-router-dom";
import { UilEllipsisV } from "@iconscout/react-unicons";
import ModalCustom from "../../../components/modalCustom";
import { deleteOrderApi, getOrderApi } from "../../../api/order";
import { errorNotify } from "../../../helper/toast";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import { useCookies } from "../../../helper/useCookies";
import Tabs from "../../../components/tabs/tabs1";
import "./index.scss";

const ManageGroupPromotion = () => {
  const itemTab = [
    {
      label: "Tất cả",
      value: "all",
      key: 0,
    },
  ];

  const [saveToCookie, readCookie] = useCookies();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const user = useSelector(getUser);
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState(itemTab[0].value);
  const [detectLoading, setDetectLoading] = useState(null);
  const [valueSearch, setValueSearch] = useState("");
  const [startPage, setStartPage] = useState(0);
  const [length, setLength] = useState(20);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getGroupPromotion(valueSearch, startPage, length);
  }, [valueSearch, startPage, length]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setDetectLoading(value, startPage, length);
      setValueSearch(value);
    }, 1000),
    []
  );

  const getGroupPromotion = (search, start, lengthPage) => {
    getGroupPromotion(search, start, lengthPage)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
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
      key: "customer_name_phone",
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
    },
    {
      i18n_title: "address",
      dataIndex: "address",
      key: "address",
      width: 220,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "collaborator",
      dataIndex: "collaborator",
      key: "collaborator",
      width: 160,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "status",
      dataIndex: "status",
      key: "case_status",
      width: 120,
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

  let items = [
    // {
    //   key: "1",
    //   label: checkElement?.includes("detail_guvi_job") && (
    //     <Link to={`/details-order/${item?.id_group_order}`}>
    //       <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
    //         lng: lang,
    //       })}`}</p>
    //     </Link>
    //   ),
    // },
    // {
    //   key: "2",
    //   label: checkElement?.includes("add_collaborator_guvi_job") &&
    //     (item?.status === "pending" || item?.status === "confirm") && (
    //       <AddCollaboratorOrder
    //         idOrder={item?._id}
    //         idCustomer={item?.id_customer?._id}
    //         status={item?.status}
    //         type={tab}
    //         kind={kind}
    //         startPage={startPage}
    //         setData={setData}
    //         setTotal={setTotal}
    //         setIsLoading={setIsLoading}
    //       />
    //     ),
    // }
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

  const deleteGroupPromotion = (id) => {
    setIsLoading(true);
    deleteGroupPromotion(id)
      .then((res) => {
        getGroupPromotion("", 0, 20);
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

  const onChangeTab = (item) => {
    setTab(item.value);
  };

  const onChangePage = (value) => {
    setStartPage(value);
  };

  return (
    <div className="div-container-content">
      <div className="div-flex-row">
        <div className="div-header-container">
          <h4 className="title-cv">{`${i18n.t("work_list", {
            lng: lang,
          })}`}</h4>
        </div>

        <div className="btn-action-header">
          {checkElement?.includes("create_guvi_job") ? (
            <Button
              className="btn-add"
              onClick={() => navigate("/group-order/manage-order/create-order")}
            >
              <i class="uil uil-plus-circle"></i>
              {`${i18n.t("create_order", { lng: lang })}`}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="div-flex-row">
        <Tabs itemTab={itemTab} onValueChangeTab={onChangeTab} />
      </div>

      <div className="div-flex-row">
        <div className="div-filter">
          <div className="header-filter">
            <Button
              type="primary"
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
              onClick={() => setCheckCondition(!checkCondition)}
            >
              Bộ lọc
            </Button>
          </div>
          {checkCondition && (
            <div className="filter-container">
              <div className="item-select">
                <span>Dịch vụ</span>
                <Select
                  style={{ width: "100%", marginRight: 10 }}
                  options={optionsService}
                  value={kind}
                  onChange={(e, item) => {
                    setKind(e);
                    setName(item?.label);
                    setArrFilter({
                      key: "service",
                      value: item.value,
                      label: item.label,
                    });
                  }}
                />
              </div>

              <div className="item-select">
                <span>Tỉnh/Thành phố</span>
                <Select
                  style={{ width: "100%", marginRight: 10 }}
                  options={cityOptions}
                  value={city}
                  onChange={(e, item) => {
                    setCity(e);
                    setDataDistrict(item?.district);
                    setName(item?.label);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </div>
              <div className="item-select">
                <span>Quận/Huyện</span>
                <Select
                  placeholde="Chọn quận/huyện"
                  style={{ width: "100%", marginRight: 10, marginTop: 10 }}
                  mode="multiple"
                  options={districtOption}
                  value={district}
                  onChange={(e, item) => {
                    setDistrict(e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                />
              </div>
            </div>
          )}
        </div>

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
          totalItem={total}
          getItemRow={setItem}
          onCurrentPageChange={onChangePage}
          detectLoading={detectLoading}
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
    </div>
  );
};

export default ManageGroupPromotion;
