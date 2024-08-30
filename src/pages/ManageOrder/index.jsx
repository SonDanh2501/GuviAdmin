import {
  UilEllipsisH,
  UilFileExport,
  UilTimes,
} from "@iconscout/react-unicons";
import {
  SearchOutlined,
  CaretDownOutlined,
  PoweroffOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
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
} from "../../redux/selectors/auth";
import { getProvince, getService } from "../../redux/selectors/service";
import AddCollaboratorOrder from "./DrawerAddCollaboratorToOrder";
import EditTimeOrder from "./EditTimeGroupOrder";
import DataTable from "../../components/tables/dataTable";
import i18n from "../../i18n";
import { Link } from "react-router-dom";
import { UilEllipsisV } from "@iconscout/react-unicons";
import ModalCustom from "../../components/modalCustom";
import { deleteOrderApi, getOrderApi, getTotalOrder } from "../../api/order";
import { errorNotify } from "../../helper/toast";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { useCookies } from "../../helper/useCookies";
import Tabs from "../../components/tabs/tabs1";
import "./index.scss";

const ManageOrder = () => {
  const itemTab = [
    {
      label: "Tất cả đơn hàng",
      value: "all",
      key: 0,
    },
    {
      label: "Đang chờ làm",
      value: "pending",
      key: 1,
    },
    {
      label: "Đã nhận",
      value: "confirm",
      key: 2,
    },
    {
      label: "Đang làm",
      value: "doing",
      key: 3,
    },
    {
      label: "Đã huỷ",
      value: "cancel",
      key: 4,
    },
    {
      label: "Hoàn thành",
      value: "done",
      key: 5,
    },
  ];

  const [saveToCookie, readCookie] = useCookies();
  const checkElement = useSelector(getElementState);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );

  // const [lengthPage, setLengthPage] = useState(20);
  const lang = useSelector(getLanguageState);
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const user = useSelector(getUser);
  const [name, setName] = useState("");
  const [tab, setTab] = useState(itemTab[0].value);
  const [kind, setKind] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("date_create");
  const [city, setCity] = useState("");
  const [dataDistrict, setDataDistrict] = useState([]);
  const [district, setDistrict] = useState([]);
  const [checkCondition, setCheckCondition] = useState(false);
  const [condition, setCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date("2022-12-31").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [item, setItem] = useState({ date_work: "" });
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const { width } = useWindowDimensions();
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [reCallData, setReCallData] = useState(false);
  const [arrFilter, setArrFilter] = useState([]);
  const [detectLoading, setDetectLoading] = useState(null);
  const [totalOrder, setTotalOrder] = useState([]);
  const [serviceLabel, setServiceLabel] = useState("");
  const [cityLabel, setCityLabel] = useState("");
  const [districtLabel, setDistrictLabel] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  useEffect(() => {
    getJobList();
    getTotal();
  }, [
    valueSearch,
    startPage,
    tab,
    kind,
    type,
    startDate,
    endDate,
    city,
    district,
    reCallData,
    lengthPage,
  ]);

  const handleSearch = useCallback(
    _debounce((value) => {
      // setIsLoading(true);
      setDetectLoading(value);
      setValueSearch(value);
      // getJobList();
    }, 1000),
    []
  );


  console.log("check >>>", totalOrder);
  const getJobList = () => {
    getOrderApi(
      valueSearch,
      startPage,
      lengthPage,
      tab,
      kind,
      type,
      startDate,
      endDate,
      city,
      district
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 60,
      fontSize: "text-size-M",
    },
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
      key: "customer_name_phone_rank",
      width: 150,
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
      key: "text",
      maxLength: 75,
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
      key: "status",
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

  // Items list các option có thể chọn
  let items = [
    {
      key: "1",
      label: checkElement?.includes("detail_guvi_job") && (
        <Link to={`/details-order/${item?.id_group_order}`}>
          <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
            lng: lang,
          })}`}</p>
        </Link>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("add_collaborator_guvi_job") &&
        (item?.status === "pending" || item?.status === "confirm") && (
          <AddCollaboratorOrder
            idOrder={item?._id}
            idCustomer={item?.id_customer?._id}
            status={item?.status}
            type={tab}
            kind={kind}
            startPage={startPage}
            setData={setData}
            setTotal={setTotal}
            setIsLoading={setIsLoading}
          />
        ),
    },
    {
      key: "3",
      label: checkElement?.includes("edit_guvi_job") &&
        item?.status !== "done" &&
        item?.status !== "cancel" &&
        item?.status !== "doing" && (
          <EditTimeOrder
            idOrder={item?._id}
            dateWork={item?.date_work}
            reCallData={reCallData}
            setReCallData={setReCallData}
            // code={item?.code_promotion ? item?.code_promotion?.code : ""}
            // status={tab}
            // kind={kind}
            // startPage={startPage}
            // setData={setData}
            // setTotal={setTotal}
            // setIsLoading={setIsLoading}
            // details={false}
            estimate={item?.total_estimate}
            // valueSearch={valueSearch}
            // type={type}
            // startDate={startDate}
            // endDate={endDate}
          />
        ),
    },
    {
      key: "4",
      label: checkElement?.includes("delete_order_guvi_job") && (
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];
  // Lọc những items list các option có thể chọn
  items = items.filter((x) => x.label !== false);

  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 50,
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

  const deleteOrder = (id) => {
    setIsLoading(true);
    deleteOrderApi(id)
      .then((res) => {
        getOrderApi(
          valueSearch,
          startPage,
          lengthPage,
          tab,
          kind,
          type,
          startDate,
          endDate,
          "",
          ""
        )
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
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
    setCheckCondition(false);
    setStartPage(0);
    setDetectLoading(item);
    saveToCookie("tab-order", item?.key);
    saveToCookie("status-order", item?.value);
    saveToCookie("order_scrolly", 0);
    saveToCookie("start_order", 0);
    saveToCookie("page_order", 1);
  };

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const cityOptions = [];
  const districtOption = [];
  const optionsService = [];

  // Thêm giá trị all vào list dữ liệu service
  optionsService.push({
    key: "",
    label: "Tất cả",
  });
  // Create optionsService List
  service.forEach((item) => {
    if (user?.id_service_manager?.length === 0) {
      optionsService.push({
        key: item?._id,
        label: item?.title?.[lang],
      });
      return;
    } else {
      user?.id_service_manager?.forEach((i) => {
        if (item?._id === i?._id) {
          optionsService.push({
            value: item?._id,
            label: item?.title?.[lang],
          });
          return;
        }
      });
    }
  });

  // Thêm giá trị all vào list dữ liệu city
  cityOptions.push({
    key: 0,
    label: "Tất cả",
    district: [],
  });
  province?.forEach((item) => {
    const itemDistrict = [];
    for (const item2 of item.districts) {
      itemDistrict.push({
        value: item2.code,
        label: item2.name,
      });
    }
    // Create cityOptions List
    if (user?.area_manager_lv_1?.length === 0) {
      cityOptions.push({
        key: item?.code,
        label: item?.name,
        district: item?.districts,
        // children: itemDistrict,
      });
      return;
    } else if (user?.area_manager_lv_1?.includes(item?.code)) {
      cityOptions.push({
        key: item?.code,
        label: item?.name,
        district: item?.districts,
        // children: itemDistrict,
      });
      return;
    }
  });

  dataDistrict?.forEach((item, index) => {
    if (user?.area_manager_lv_2?.length === 0) {
      districtOption.push({
        key: index,
        value: item?.code,
        label: item?.name,
      });
      return;
    } else if (user?.area_manager_lv_2?.includes(item?.code)) {
      districtOption.push({
        key: index,
        value: item?.code,
        label: item?.name,
      });
      return;
    }
  });

  const getTotal = () => {
    getTotalOrder()
      .then((res) => {
        const temp_arr = [];
        for (let i of Object.values(res)) {
          temp_arr.push({ value: i });
        }
        setTotalOrder(temp_arr);
      })
      .then((err) => {
        console.log("err ", err);
      });
  };
  const handleClickService = ({ key }) => {
    const found = optionsService.find((el) => el.key === key);
    setKind(found?.key);
    setServiceLabel(found?.label);
  };
  const handleClickSelectCity = ({ key }) => {
    const found = cityOptions.find((el) => el.key === +key);
    if (found && found?.key !== 0) {
      setCity(found?.key);
      setCityLabel(found?.label);
      setDataDistrict(found?.district);
    } else {
      setCity("");
      setCityLabel(found?.label);
      setDataDistrict(found?.district);
    }
    setSelectedDistrict([]); // Unselected all iteam in district menu when choose a new city
    setDistrict([]);
    setDistrictLabel([]);
  };
  const handleClickSelectDistrict = ({ key }) => {
    const found = districtOption.find((el) => el.key === +key);
    setSelectedDistrict([...selectedDistrict, key]);
    setDistrictLabel([...districtLabel, found?.label]);
    setDistrict([...district, found?.value]);
  };
  const handleClickDeselectDistrict = ({ key }) => {
    const found = districtOption.find((el) => el.key === +key);
    const district_filter = district.filter((el) => el !== found?.value);
    // Filter district label when unselected
    const district_label_filter = districtLabel.filter(
      (el) => el !== found?.label
    );
    // Delete unseleted district item
    const district_selected_filter = selectedDistrict.filter(
      (el) => +el !== +found?.key
    );
    // Set select with value after filter
    setSelectedDistrict(district_selected_filter);
    setDistrictLabel(district_label_filter);
    setDistrict(district_filter);
  };
  return (
    <div className="div-container-content">
      <div className="div-flex-row">
        {/*Tiêu đề trang order*/}
        <div className="div-header-container">
          <h4 className="title-cv">{`${i18n.t("work_list", {
            lng: lang,
          })}`}</h4>
        </div>
      </div>
      {/*Button tạo đơn*/}
      <div className="btn-action-header">
        {checkElement?.includes("create_guvi_job") ? (
          <div className="transfer-collaborator_search">
            {/*Tạo đơn*/}
            <Button
              className="btn-add"
              icon={<PlusCircleOutlined />}
              onClick={() => navigate("/group-order/manage-order/create-order")}
            >
              {/* <i class="uil uil-plus-circle"></i> */}
              {`${i18n.t("create_order", { lng: lang })}`}
            </Button>
            {/*Thanh tìm kiếm*/}
            <Input
              placeholder={`${i18n.t("search_order", { lng: lang })}`}
              // value={valueSearch}
              prefix={<SearchOutlined />}
              className="input-search"
              onChange={(e) => {
                handleSearch(e.target.value);
                // setValueSearch(e.target.value);
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {/*Các tab phân loại đơn hàng*/}
      <div className="div-flex-row">
        <Tabs
          itemTab={itemTab}
          onValueChangeTab={onChangeTab}
          dataTotal={totalOrder}
        />
      </div>
      {/*Container tìm kiếm và bộ lọc*/}
      <div className="div-flex-row">
        <div className="div-filter box-filter">
          {/*Service Select Option Drop Down*/}
          <div className="filter-transfer_status">
            {/*Drop down Menu*/}
            <Dropdown
              menu={{
                items: optionsService,
                selectable: true,
                defaultSelectedKeys: [""],
                onSelect: (key) => handleClickService(key),
              }}
              trigger={["click"]}
            >
              <Space>
                <span>Dịch vụ: </span>
                <span style={{ cursor: "pointer" }} className="fw-500">
                  {serviceLabel ? serviceLabel : optionsService[0]?.label}
                </span>
                <CaretDownOutlined />
              </Space>
            </Dropdown>
          </div>
          {/*City Select Option Drop Down*/}
          <div className="filter-transfer_status">
            {/*Drop down Menu*/}
            <Dropdown
              style={{}}
              menu={{
                items: cityOptions,
                selectable: true,
                defaultSelectedKeys: ["0"],
                onSelect: (key) => handleClickSelectCity(key),
              }}
              trigger={["click"]}
            >
              <Space>
                <span>Thành Phố:</span>
                <span style={{ cursor: "pointer" }} className="fw-500">
                  {cityLabel ? cityLabel : "Tất cả"}
                </span>
                <CaretDownOutlined />
              </Space>
            </Dropdown>
          </div>
          {/*Province Select Option Drop Down*/}
          <div className="filter-transfer_status">
            {/*Drop down Menu*/}
            <Dropdown
              menu={{
                multiple: true,
                items: districtOption,
                selectable: true,
                selectedKeys: selectedDistrict,
                onSelect: (key) => handleClickSelectDistrict(key),
                onDeselect: (key) => handleClickDeselectDistrict(key),
              }}
              trigger={["click"]}
            >
              <Space>
                <span>Quận/Huyện:</span>
                <div>
                  {/* { districtLabel?.map((el, index) => {
                    if (index < 3) {
                      return (
                        <span className="fw-500" style={{ marginRight: 4 }}>
                          {el},
                        </span>
                      );
                    } else if (index === 3) {
                      return <span className="fw-500">{el}</span>;
                    } else if (index === 4) {
                      return <span className="fw-500">,...</span>;
                    } else {
                      return <span></span>;
                    }
                  })} */}
                  {districtLabel && districtLabel.length > 0 ? (
                    districtLabel.map((el, index) => {
                      if (index < 3) {
                        return (
                          <span className="fw-500" style={{ marginRight: 4 }}>
                            {el},
                          </span>
                        );
                      } else if (index === 3) {
                        return <span className="fw-500">{el}</span>;
                      } else if (index === 4) {
                        return <span className="fw-500">,...</span>;
                      } else {
                        return <span></span>;
                      }
                    })
                  ) : (
                    <span
                      className={`fw-500 duration-500 ${
                        cityLabel && cityLabel !== "Tất cả"
                          ? "text-black cursor-pointer"
                          : "text-black/25 cursor-not-allowed"
                      } `}
                    >
                      Tất cả
                    </span>
                  )}
                </div>
                <CaretDownOutlined />
              </Space>
            </Dropdown>
          </div>
          {/*Các giá trị lọc*/}
          {checkCondition && (
            <div className="filter-container">
              {/*Dịch vụ*/}
              <div className="iteServicem-select">
                <span>Dịch vụ</span>
                <Select
                  style={{ width: "100%", marginRight: 10 }}
                  options={optionsService}
                  value={kind}
                  onChange={(e, item) => {
                    setKind(e); // Trả về value của dịch vụ, lọc theo id của dịch vụ
                    setName(item?.label); // Not using
                    setArrFilter({
                      // Not using
                      key: "service",
                      value: item.value,
                      label: item.label,
                    });
                  }}
                />
              </div>
              {/*Thành Phố*/}
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
              {/*Huyện*/}
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
      </div>
      {/*Table đơn hàng*/}
      <div>
        <DataTable
          columns={columns}
          data={data}
          actionColumn={addActionColumn}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
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

export default ManageOrder;
