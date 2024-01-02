import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, Space, Input } from "antd";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { SearchOutlined } from "@ant-design/icons";
import {
  getFeedbacks,
  getFeedbackTotal,
} from "../../../redux/selectors/feedback";
import {
  getFeedback,
  deleteFeedbackApi,
  updateProcessHandleFeedback,
} from "../../../api/feedback";
import "./index.scss";
import _debounce from "lodash/debounce";
import DataTable from "../../../components/tables/dataTable";
import ModalCustom from "../../../components/modalCustom";
import ModalNoteAdmin from "./components/NoteAdminModal";
import { OPTIONS_SELECT_STATUS_HANDLE_FEEDBACK } from "../../../@core/constant/constant";

import i18n from "../../../i18n";

const Feedback = () => {
  const lang = useSelector(getLanguageState);
  const checkElement = useSelector(getElementState);

  const [data, setData] = useState([]);
  const [start, setStart] = useState(0);
  const [lengthPage, setLengthPage] = useState(50);
  const [valueSearch, setValueSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [detectLoading, setDetectLoading] = useState(null);
  const [modal, setModal] = useState("");
  const [item, setItem] = useState(null);

  useEffect(() => {
    getDataFeedback();
  }, [valueSearch, start]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setDetectLoading(value);
      setValueSearch(value);
    }, 500),
    []
  );

  const getDataFeedback = async () => {
    const res = await getFeedback(valueSearch, start, lengthPage);

    for (let i = 0; i < res.data.length; i++) {
      res.data[i]["type_name_feedback"] = res.data[i].type.name
        ? res.data[i].type.name[lang]
        : "";
      res.data[i]["full_name_user_system_handle"] = res.data[i]
        .id_user_system_handle
        ? res.data[i].id_user_system_handle.full_name
        : "";
    }

    setData(res?.data);
    setTotalItem(res?.totalItem);
  };

  const processHandleFeedback = async (dataChange) => {
    const payload = {
      note_handle_admin: dataChange.note_handle_admin,
      status_handle: dataChange.status_handle,
    };
    await updateProcessHandleFeedback(item._id, payload);
    getDataFeedback();
    setModal("");
  };

  const onChangePage = (value) => {
    setStart(value);
  };

  const columns = [
    {
      title: "Ngày tạo",
      dataIndex: "date_create",
      key: "date_create",
      width: 120,
    },
    {
      title: "Loại phản hồi",
      dataIndex: "type_name_feedback",
      key: "text",
      width: 120,
    },
    {
      i18n_title: "customer",
      dataIndex: "customer",
      key: "customer-name-phone",
      width: 130,
    },
    {
      title: "Nội dung",
      dataIndex: "body",
      key: "text",
      maxLength: 85,
      width: 250,
    },
    {
      i18n_title: "status",
      dataIndex: "status_handle",
      key: "status_handle_review",
      selectOptions: OPTIONS_SELECT_STATUS_HANDLE_FEEDBACK,
      width: 150,
    },
    {
      title: "NV liên hệ",
      dataIndex: "full_name_user_system_handle",
      key: "text",
      width: 110,
    },
    {
      i18n_title: "note",
      dataIndex: "note_handle_admin",
      key: "text",
      maxLength: 85,
      width: 250,
    },
  ];

  const showModal = (key) => {
    setModal(key);
    // console.log(modal, "modal");
  };

  let items = [
    {
      key: "0",
      label: checkElement?.includes("delete_request_service") && (
        <p className="m-0" onClick={() => showModal("update_handle_feedback")}>
          Cập nhật ghi chú
        </p>
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

  const deleteFeedBack = async (idFeedBack) => {
    await deleteFeedbackApi(idFeedBack);
    getDataFeedback();
    showModal("");
  };

  const onChangePropsValue = async (props) => {
    if (props.dataIndex === "status_handle") {
      setModal("update_handle_feedback");
    }
  };

  return (
    <React.Fragment>
      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">Phản hồi</h4>
          </div>
          <div className="btn-action-header"></div>
        </div>

        <div className="div-flex-row">
          {/* <Tabs
            itemTab={itemTab}
            onValueChangeTab={onChangeTab}
          /> */}
        </div>

        {/* <div className="div-flex-row-flex-start">
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
        </div> */}

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
            start={start}
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

      <ModalCustom
        isOpen={modal === "delete"}
        title={`${i18n.t("delete_feedback", { lng: lang })}`}
        handleOk={() => deleteFeedBack(item?._id)}
        handleCancel={() => showModal("")}
        textOk={`${i18n.t("delete", { lng: lang })}`}
        body={
          <>
            <p className="m-0">{`${i18n.t("want_delete_feedback", {
              lng: lang,
            })}`}</p>
            <p className="text-name-modal m-0">{item?.id_customer.full_name}</p>
          </>
        }
      />

      <ModalNoteAdmin
        isShow={modal === "update_handle_feedback" ? true : false}
        item={item}
        handleOk={(payload) => processHandleFeedback(payload)}
        handleCancel={setModal}
      />
    </React.Fragment>
  );
};

export default Feedback;
