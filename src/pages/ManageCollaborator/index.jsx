import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  FloatButton,
  Input,
  Select,
  Space,
  Pagination
} from "antd";
import { useSelector } from "react-redux";
import i18n from "../../i18n";
import { useCookies } from "../../helper/useCookies";
import useWindowDimensions from "../../helper/useWindowDimensions";
import "./index.scss";
import {
  getElementState,
  getLanguageState,
  getUser
} from "../../redux/selectors/auth";
import { getProvince, getService } from "../../redux/selectors/service.js";

import { 
  fetchCollaborators, 
  lockTimeCollaborator,
  verifyCollaborator,
  deleteCollaborator,
  changeContactedCollaborator
 } from "../../api/collaborator"
import DataTable from "../../components/tables/dataTable"
import { UilEllipsisV } from "@iconscout/react-unicons";
import { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import Tabs from "../../components/tabs/tabs1"

import ModalCustom from "../../components/modalCustom";
import { errorNotify } from "../../helper/toast";
import { OPTIONS_SELECT_STATUS_COLLABORATOR } from "../../@core/constant/constant.js";
import ModalNoteAdmin from "./components/NoteAdminModal"

const ManageCollaborator = () => {

  const itemTabStatusCollaborator = [
    {
      label: "Tất cả",
      value: "verify",
      key: 0,
    },
    {
      label: "Đang hoạt động",
      value: "online",
      key: 1,
    },
    {
      label: "Đã khoá",
      value: "locked",
      key: 2,
    },
    {
      label: "Chưa xác thực",
      value: "not_verify",
      key: 3,
    }
  ];

  const province = useSelector(getProvince);
  const service = useSelector(getService);
  const user = useSelector(getUser);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(25);
  const [city, setCity] = useState("");

  const [totalItem, setTotalItem] = useState(0)

const [modal, setModal] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [item, setItem] = useState(null);
  const [tabStatus, setTabStatus] = useState(itemTabStatusCollaborator[0].value);
  const [detectLoading, setDetectLoading] = useState(null)
  const [saveToCookie, readCookie] = useCookies();
  const [selectStatus, setSelectStatus] = useState(["done", "doing", "confirm"])
  const cityOptions = [
    {
      value: "",
      label: "Tất cả",
    },
  ];
  
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

  province?.forEach((item) => {
    if(item.code === 1 ||
      item.code === 79 ||
      item.code === 74 ||
      item.code === 48
      )
    cityOptions.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onFilterCity = (value) => {
    setCity(value);
    // saveToCookie("ctv-city", value);
    // fetchCollaborators(lang, startPage, 20, status, valueSearch, value)
    //   .then((res) => {
    //     setData(res?.data);
    //     setTotal(res?.totalItems);
    //   })
    //   .catch((err) => {});
  };



  const getListCollaborator = async () => {
    const res = await fetchCollaborators(lang, valueSearch, startPage, lengthPage, tabStatus, city);

    for(let i = 0 ; i < res.data.length ; i++) {
      const tempCity = province.filter(x => x.code === res.data[i].city);

      const tempService = service.filter(x => res.data[i].service_apply.includes(x._id) )
      res.data[i]["name_level_1"] = (tempCity.length > 0) ? tempCity[0].name.replace(new RegExp(`${"Thành phố"}|${"Tỉnh"}`),"") : "Khác";
      res.data[i]["name_service_apply"] = ""
      for(const item of tempService) {
        res.data[i]["name_service_apply"] += (res.data[i]["name_service_apply"] === "") ? `${item.title.vi}` : `, ${item.title.vi}` 
      }

      if(res.data[i].is_locked === true) {
        res.data[i]["status_collaborator"] = "lock"
      } else if (res.data[i].is_verify === true) {
        res.data[i]["status_collaborator"] = "online"
      } else if (res.data[i].is_contacted === true) {
        res.data[i]["status_collaborator"] = "contacted"
      } else {
        res.data[i]["status_collaborator"] = "pending"
      }
    }

      setData(res?.data);
      setTotalItem(res?.totalItems);
  }


  useEffect(() => {
    getListCollaborator();
  }, [valueSearch, startPage, province, tabStatus, city]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      setDetectLoading(value);
    }, 1000),
    []
  );

  const showModal = (key) => {
    setModal(key);
  } 


  const columns = [
    {
        title: "Ngày tạo",
        dataIndex: 'date_create',
        key: "date_create",
        width: 80
    },
    {
        title: "Mã CTV",
        dataIndex: 'id_view',
        key: "other",
        width: 85
    },
    {
        title: "CTV",
        dataIndex: 'custom',
        key: "collaborator_name_phone_avatar",
        width: 150
    },
    // {
    //     title: 'Ngày vào làm',
    //     dataIndex: 'date_create',
    //     key: "date_create",
    //     width: 90
    // },
    {
        title: 'Khu vực',
        dataIndex: 'name_level_1',
        key: "text",
        width: 110
    },
    {
        title: 'Nhóm dịch vụ',
        dataIndex: 'name_service_apply',
        key: "text",
        maxLength: 20,
        width: 110
    },
    {
        title: 'Tổng đơn thành công',
        dataIndex: 'total_job',
        key: "number",
        width: 110
    },
    // {
    //     title: 'Tỉ lệ đánh giá',
    //     dataIndex: 'id_view',
    //     key: "code_customer",
    //     width: 110
    // },
    // {
    //     title: 'Số đơn vi phạm',
    //     dataIndex: 'id_view',
    //     key: "code_customer",
    //     width: 110
    // },
    // {
    //     title: 'Hạng',
    //     dataIndex: 'id_view',
    //     key: "code_customer",
    //     width: 110
    // },
    {
        title: 'Trạng thái',
        dataIndex: 'status_collaborator',
        key: "status_handle_collaborator",
        selectOptions: OPTIONS_SELECT_STATUS_COLLABORATOR,
        width: 110
    }
]


  let items = [
    {
      key: "0",
      label: (
        // <p
        //   className={
        //     checkElement?.includes("lock_unlock_collaborator")
        //       ? "text-click-block"
        //       : "text-click-block-hide"
        //   }
        //   onClick={() =>showModal("lock_unlock_collaborator")}
        // >
        //   {item?.is_locked
        //     ? `${i18n.t("unlock", { lng: lang })}`
        //     : `${i18n.t("lock", { lng: lang })}`}
        // </p>

            <p
            className={
              checkElement?.includes("lock_unlock_collaborator")
                ? "text-click-block"
                : "text-click-block-hide"
            }
            onClick={() =>showModal("status_collaborator")}
            >
              Cập nhật trạng thái
            </p>
        
      ),
    },
    // {
    //   key: "1",
    //   label: checkElement?.includes("xác thực") && (
    //     <p className="text-dropdown" 
    //     // onClick={toggle}
    //     >{`${i18n.t("delete", {
    //       lng: lang,
    //     })}`}</p>
    //   ),
    // },
    {
      key: "2",
      label: checkElement?.includes("delete_collaborator") && (
        <p className="text-dropdown" 
        onClick={() =>showModal("delete_collaborator")}
        >{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  items = items.filter(x => x.label !== false);



  const addActionColumn = {
    i18n_title: '',
    dataIndex: 'action',
    key: "action",
    fixed: 'right',
    width: 50,
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a>
            <UilEllipsisV />
          </a>
        </Dropdown>
      </Space>
    )
  };


  const onChangeTab = (item) => {
    setTabStatus(item.value);
    setStartPage(0);
    setDetectLoading(item)
    saveToCookie("tab-order", item?.key);
    saveToCookie("status-order", item?.value);
    saveToCookie("order_scrolly", 0);
    saveToCookie("start_order", 0);
    saveToCookie("page_order", 1);
  };


  const onChangePage = (value) => {
    setStartPage(value)
  }


  const onChangePropsValue = async (props) => {
    if(props.dataIndex === "status_collaborator") {
      setModal("status_collaborator");
    }
  }


  const processHandle = async (dataChange) => {

    if(modal === "delete_collaborator") {
      await deleteCollaborator(dataChange._id)
      getListCollaborator();
    } else {
      switch (dataChange.status_collaborator) {
        case "contacted": {
          changeContactedCollaborator(dataChange._id);
          break;
        }
        case "online": {
          if(dataChange.is_locked === true) {
            const payload = {
              is_locked: false,
              date_lock: null
            }
            lockTimeCollaborator(dataChange._id, payload)
          } else {
            verifyCollaborator(dataChange._id)
          }
          break;
        }
        case "lock": {
          const payload = {
            is_locked: true,
            date_lock: dataChange.date_lock
          }
          lockTimeCollaborator(dataChange._id, payload)
          break;
        }
        default: break;
      }
    }
    setModal("");
  }


  const changeStatusOrder = (value: string) => {
    setSelectStatus(value)
  };

//   const processHandleReview = async (dataChange) => {
//     const payload = {
//       id_order: item._id,
//       note_admin: dataChange.note_admin,
//       status_handle_review: dataChange.status_handle_review
//     }
//     console.log(payload, 'payload');
//     await updateProcessHandleReview(payload)
//     getReviewCollaborator()
//     setModal("");
//   }

//   const onDelete = useCallback(
//     (id) => {
//       setIsLoading(true);
//       deleteCustomer(id, { is_delete: true })
//         .then((res) => {
//           fetchCustomers(lang, startPage, 50, status, idGroup, "")
//             .then((res) => {
//               setData(res?.data);
//               setTotal(res?.totalItems);
//             })
//             .catch((err) => {});
//           setModal(false);
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           errorNotify({
//             message: err,
//           });
//           setIsLoading(false);
//         });
//     },
//     [status, startPage, idGroup, lang]
//   );

//   const blockCustomer = useCallback(
//     (id, active) => {
//       setIsLoading(true);
//       activeCustomer(id, { is_active: active ? false : true })
//         .then((res) => {
//           setModalBlock(false);
//           fetchCustomers(lang, startPage, 50, status, idGroup, "")
//             .then((res) => {
//               setData(res?.data);
//               setTotal(res?.totalItems);
//             })
//             .catch((err) => {});
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           errorNotify({
//             message: err,
//           });
//           setIsLoading(false);
//         });
//     },
//     [startPage, status, idGroup, lang]
//   );




  return (
    <>
      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">{`${i18n.t("collaborator_list", { lng: lang })}`}</h4>
          </div>

          <div className="btn-action-header">
            {/* {checkElement?.includes("create_customer") && (
              <AddCustomer
                returnValueIsLoading={setDetectLoading}
                setData={setData}
                setTotal={setTotal}
                startPage={startPage}
                status={""}
                idGroup={idGroup}
              />
            )} */}
          </div>
        </div>

        <div className="div-flex-row">
          <Tabs
            itemTab={itemTabStatusCollaborator}
            onValueChangeTab={onChangeTab}
          />
        </div>


        <div className="div-flex-row">
          <div>
          {/* <Select
          mode="multiple"
          defaultValue="all"
          onChange={changeStatusOrder}
          value={selectStatus}
          options={[
            { value: 'done', label: 'Hoàn thành' },
            { value: 'doing', label: 'Đang làm' },
            { value: 'confirm', label: 'Đã nhận' },
          ]}
        /> */}



<Select
            options={cityOptions}
            style={{ width: "300px" }}
            value={city}
            onChange={onFilterCity}
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
          <div className="div-search">
            <Input
              placeholder={`${i18n.t("search", { lng: lang })}`}
              prefix={<SearchOutlined />}
              className="input-search"
              onChange={(e) => {
                handleSearch(e.target.value);
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
            detectLoading={detectLoading}
            getItemRow={setItem}
            onCurrentPageChange={onChangePage}
            onChangeValue={onChangePropsValue}
          />
        </div>




        {/* <div>
          <ModalCustom
            isOpen={modalBlock}
            title={
              item?.is_active === true
                ? `${i18n.t("lock_cutomer_account", { lng: lang })}`
                : `${i18n.t("unlock_cutomer_account", { lng: lang })}`
            }
            handleOk={() => blockCustomer(item?._id, item?.is_active)}
            textOk={
              item?.is_active === true
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            handleCancel={toggleBlock}
            body={
              <>
                {item?.is_active === true
                  ? `${i18n.t("want_lock_cutomer_account", { lng: lang })}`
                  : `${i18n.t("want_unlock_cutomer_account", { lng: lang })}`}
                <h6>{item?.full_name}</h6>
              </>
            }
          />
        </div> */}

      </div>
      <ModalNoteAdmin isShow={(modal === "status_collaborator") ? true : false} item={item} handleOk={(payload) => processHandle(payload)} handleCancel={setModal}/>


        <div>
          <ModalCustom
            isOpen={(modal === "delete_collaborator") ? true : false}
            title={`${i18n.t("customer_delete", { lng: lang })}`}
            handleOk={() => processHandle(item)}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            handleCancel={() => setModal("")}
            body={
              <>
                <p>{`${i18n.t("sure_delete_customer", { lng: lang })}`}</p>
                <p className="text-name-modal">{item?.full_name}</p>
              </>
            }
          />
        </div>

    </>

  )
}

export default ManageCollaborator;
