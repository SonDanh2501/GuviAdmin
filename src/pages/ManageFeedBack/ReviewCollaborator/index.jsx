import React, { useCallback, useEffect, useState } from "react";
import {
  Dropdown,
  Space,
  Input,
} from "antd";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import DataTable from "../../../components/tables/dataTable"
import RangeDatePicker from "../../../components/datePicker/RangeDatePicker"
import { getDataReviewCollaborator, updateProcessHandleReview } from "../../../api/feedback"
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import ModalNoteAdmin from "./components/NoteAdminModal"
import i18n from "../../../i18n";
import { OPTIONS_SELECT_STATUS_HANDLE_REVIEW } from "../../../@core/constant/constant"

import "./index.scss";
import DeleteModal from "./components/DeleteModal";

const ReviewCollaborator = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(25);
  const [valueSearch, setValueSearch] = useState("");
  const [detectLoading, setDetectLoading] = useState(null)
  const [totalItem, setTotalItem] = useState(0)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  // const toggle = () => setModal(!modal);
  const [modal, setModal] = useState("");
  const [inputModal, setInputModal] = useState(null);
  const [item, setItem] = useState(null);


  useEffect(() => {
    if (startDate !== "") {
      getReviewCollaborator();
    }
  }, [valueSearch, startPage, startDate]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setDetectLoading(value)
      setValueSearch(value);
    }, 500),
    []
  );

  const getReviewCollaborator = async () => {
    const res = await getDataReviewCollaborator(startPage, lengthPage, startDate, endDate);
    const clearData = [];
    for (let i = 0; i < res.data.length; i++) {
      res.data[i]["service_title"] = (res.data[i].service._id._id === "654dd5598b3f1a21b7011e3f") ? "Rèm - Thảm - Sofa" : res.data[i].service._id.title.vi;

      // res.data[i]["service_title"] = res.data[i].service._id.title.vi


      res.data[i]["short_review"] = res.data[i].short_review.toString();
      res.data[i]["full_name_user_system_handle_review"] = (res.data[i].id_user_system_handle_review) ? res.data[i].id_user_system_handle_review.full_name : "";

      // res.data[i]["name_service"] = res.data[i].service._id.title.vi
    }
    console.log(res?.data, 'res?.data');
    setData(res?.data);
    setTotalItem(res?.totalItem);
  }

  const onChangePage = (value) => {
    setStartPage(value)
  }

  const onChangePropsValue = async (props) => {
    if(props.dataIndex === "status_handle_review") {
      setModal("update_handle_review");
    }
  }

  const processHandleReview = async (dataChange) => {
    const payload = {
      id_order: item._id,
      note_admin: dataChange.note_admin,
      status_handle_review: dataChange.status_handle_review
    }
    console.log(payload, 'payload');
    await updateProcessHandleReview(payload)
    getReviewCollaborator()
    setModal("");
  }






  const columns = [
    {
      // i18n_title: 'date_create',
      title: 'Ngày',
      dataIndex: 'date_create_review',
      key: "date_time",
      width: 100,
      fontSize: "text-size-M"
    },
    {
      title: "Đơn hàng",
      dataIndex: 'id_view',
      key: "code_order_name_service",
      width: 140,
      fontSize: "text-size-M"
    },
    {
      i18n_title: 'customer',
      dataIndex: 'id_customer',
      key: "customer-name-phone",
      width: 120,
      fontSize: "text-size-M"
    },
    {
      title: 'Đánh giá sao',
      dataIndex: 'service_title',
      key: "id_view_name_service",
      width: 140,
      maxLength: 20,
      fontSize: "text-size-M"
    },
    {
      // i18n_title: 'customer',
      title: 'Cộng tác viên',
      dataIndex: 'id_collaborator',
      key: "collaborator_no_star",
      width: 150,
      fontSize: "text-size-M"
    },
    {
      // i18n_title: 'address',
      title: "Đánh giá nhanh",
      dataIndex: 'short_review',
      key: "text",
      width: 140,
      maxLength: 35,
      fontSize: "text-size-M"
    },
    {
      title: 'Chi tiết đánh giá',
      dataIndex: 'review',
      key: "text",
      width: 220,
      maxLength: 90,
      fontSize: "text-size-M"
    },
    {
      i18n_title: 'status',
      dataIndex: 'status_handle_review',
      key: "status_handle_review",
      selectOptions: OPTIONS_SELECT_STATUS_HANDLE_REVIEW,
      width: 185,
      fontSize: "text-size-M"
    },
    {
      title: 'NV liên hệ',
      dataIndex: "full_name_user_system_handle_review",
      key: "other",
      width: 110,
      fontSize: "text-size-M"
    },
    {
      i18n_title: 'note',
      dataIndex: 'note_admin',
      key: "text",
      maxLength: 90,
      width: 220,
      fontSize: "text-size-M"
    },
  ]

  const showModal = (key) => {
    setModal(key);
    console.log(modal, "modal");
  } 

  let items = [
    // {
    //   key: "0",
    //   label: checkElement?.includes("delete_request_service") &&
    //     (<p className="m-0" onClick={()=>showModal("delete")}>{`${i18n.t("delete", { lng: lang })}`}</p>)
    // },
    {
      key: "0",
      label: checkElement?.includes("delete_request_service") &&
        (<p className="m-0" onClick={() =>showModal("update_handle_review")}>Cập nhật ghi chú</p>)
    }
  ]

  items = items.filter(x => x.label !== false);

  const addActionColumn = {
    i18n_title: '',
    dataIndex: 'action',
    key: "action",
    fixed: 'right',
    width: 40,
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






  return (
    <React.Fragment>

      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">Đánh giá CTV</h4>
          </div>
          <div className="btn-action-header">
          </div>
        </div>

        <div className="div-flex-row">
          {/* <Tabs
            itemTab={itemTab}
            onValueChangeTab={onChangeTab}
          /> */}
        </div>

        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
              defaults={"thirty_last"}
            />
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ này: {moment(startDate).format("DD/MM/YYYY")}-
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="div-flex-row">
          <div className="div-filter">
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
        <div >
          <DataTable
            columns={columns}
            data={data}
            actionColumn={addActionColumn}
            start={startPage}
            pageSize={lengthPage}
            totalItem={totalItem}
            onCurrentPageChange={onChangePage}
            detectLoading={detectLoading}
            onChangeValue={onChangePropsValue}
            // onShowModal={onShowModal}
            getItemRow={setItem}
          />
        </div>
      </div>

<ModalNoteAdmin isShow={(modal === "update_handle_review") ? true : false} item={item} handleOk={(payload) => processHandleReview(payload)} handleCancel={setModal}/>
{/* <DeleteModal isShow={(modal === "delete") ? true : false} item={item} handleOk={(payload) => processHandleReview(payload)} handleCancel={setModal}/> */}

    </React.Fragment>
  );
};

export default ReviewCollaborator;
