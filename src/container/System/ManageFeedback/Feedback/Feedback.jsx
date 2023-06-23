import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Table, Tooltip } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import {
  getFeedbacks,
  getFeedbackTotal,
} from "../../../../redux/selectors/feedback";
import "./Feedback.scss";
import { getFeedback } from "../../../../redux/actions/feedback";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../../redux/selectors/auth";
import { loadingAction } from "../../../../redux/actions/loading";
import { deleteFeedbackApi, searchFeedbackApi } from "../../../../api/feedback";
import { errorNotify } from "../../../../helper/toast";
import ModalCustom from "../../../../components/modalCustom";
import i18n from "../../../../i18n";
const width = window.innerWidth;

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
      title: `${i18n.t("type_feedback", { lng: lang })}`,
      render: (data) => <a className="text-type">{data?.type?.name?.[lang]}</a>,
    },
    {
      title: `${i18n.t("content", { lng: lang })}`,
      render: (data) => <a className="text-content">{data?.body}</a>,
    },
    {
      title: `${i18n.t("feedback_sender", { lng: lang })}`,
      render: (data) => {
        return (
          <Link to={`/profile-customer/${data?.id_customer}`}>
            <a className="text-type">{data?.full_name}</a>
          </Link>
        );
      },
    },
    {
      title: `${i18n.t("phone_feedback_sender", { lng: lang })}`,
      render: (data) => <a className="text-content">{data?.phone}</a>,
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => (
        <a className="text-content">
          {moment(new Date(data?.date_create)).format("DD/MM/yyy - HH:mm")}
        </a>
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
            scroll={
              width <= 490
                ? {
                    x: 1600,
                  }
                : null
            }
          />
        </div>
        <div className="div-pagination p-2">
          <a>
            {`${i18n.t("total", { lng: lang })}`}:{" "}
            {dataFilter.length > 0 ? totalFilter : feedbackTotal}
          </a>
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
                <a>{`${i18n.t("want_delete_feedback", { lng: lang })}`}</a>
                <a className="text-name-modal">{itemEdit?.full_name}</a>
              </>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Feedback;
