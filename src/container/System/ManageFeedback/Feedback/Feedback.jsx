import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Table, Tooltip } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { deleteFeedbackApi, searchFeedbackApi } from "../../../../api/feedback";
import ModalCustom from "../../../../components/modalCustom";
import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import { getFeedback } from "../../../../redux/actions/feedback";
import { loadingAction } from "../../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import {
  getFeedbacks,
  getFeedbackTotal,
} from "../../../../redux/selectors/feedback";
import "./Feedback.scss";
import useWindowDimensions from "../../../../helper/useWindowDimensions";

const Feedback = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemEdit, setItemEdit] = useState([]);
  const dispatch = useDispatch();
  const listFeedback = useSelector(getFeedbacks);
  const feedbackTotal = useSelector(getFeedbackTotal);
  const [modal, setModal] = useState(false);
  const lang = useSelector(getLanguageState);
  const toggle = () => setModal(!modal);
  const checkElement = useSelector(getElementState);
  const { width } = useWindowDimensions();

  useEffect(() => {
    dispatch(getFeedback.getFeedbackRequest({ start: 0, length: 20 }));
  }, [dispatch]);

  const onDelete = (id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteFeedbackApi(id)
      .then((res) => {
        dispatch(getFeedback.getFeedbackRequest({ start: 0, length: 20 }));
        dispatch(loadingAction.loadingRequest(false));
        setModal(false);
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err,
        });
      });
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      searchFeedbackApi(value)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = listFeedback?.length < 20 ? 20 : listFeedback?.length;
    const start = page * dataLength - dataLength;
    dispatch(
      getFeedback.getFeedbackRequest({
        start: start > 0 ? start : 0,
        length: 20,
      })
    );
  };

  const columns = [
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("type_feedback", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => <p className="text-type">{data?.type?.name?.[lang]}</p>,
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => <p className="text-content">{data?.body}</p>,
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("feedback_sender", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <Link to={`/profile-customer/${data?.id_customer}`}>
            <p className="text-type">{data?.full_name}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("phone_feedback_sender", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => <p className="text-content">{data?.phone}</p>,
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => (
        <p className="text-content">
          {moment(new Date(data?.date_create)).format("DD/MM/yyy - HH:mm")}
        </p>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (data) =>
        checkElement?.includes("delete_feedback_support_customer") && (
          <Tooltip
            placement="bottom"
            title={`${i18n.t("delete_feedback", { lng: lang })}`}
          >
            <button className="btn-delete" onClick={toggle}>
              <i className="uil uil-trash"></i>
            </button>
          </Tooltip>
        ),
    },
  ];

  return (
    <>
      <div>
        <Input
          placeholder={`${i18n.t("search", { lng: lang })}`}
          type="text"
          className="input-search"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : listFeedback}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItemEdit(record);
                },
              };
            }}
            scroll={{
              x: width <= 490 ? 1400 : 0,
            }}
          />
        </div>
        <div className="div-pagination p-2">
          <p>
            {`${i18n.t("total", { lng: lang })}`}:{" "}
            {dataFilter.length > 0 ? totalFilter : feedbackTotal}
          </p>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={dataFilter.length > 0 ? totalFilter : feedbackTotal}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("delete_feedback", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <p className="m-0">{`${i18n.t("want_delete_feedback", {
                  lng: lang,
                })}`}</p>
                <p className="text-name-modal m-0">{itemEdit?.full_name}</p>
              </>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Feedback;
