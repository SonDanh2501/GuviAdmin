import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Input, Pagination, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  activeQuestionApi,
  deleteQuestionApi,
  getExamByLessonApi,
  getListQuestionApi,
} from "../../../../../../api/configuration";
import offToggle from "../../../../../../assets/images/off-button.png";
import onToggle from "../../../../../../assets/images/on-button.png";
import ModalCustom from "../../../../../../components/modalCustom";
import LoadingPagination from "../../../../../../components/paginationLoading";

import i18n from "../../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../../redux/selectors/auth";
import AddQuizz from "../AddQuizz";
import "./styles.scss";
import EditQuizz from "../EditQuizz";
import { useParams } from "react-router-dom";
import { errorNotify } from "../../../../../../helper/toast";
const { TextArea } = Input;
const width = window.innerWidth;

const DetailLesson = () => {
  const params = useParams();
  const id = params?.id;
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [itemEdit, setItemEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);

  useEffect(() => {
    getExamByLessonApi(id, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [id]);

  const deleteQuestion = useCallback(
    (_id) => {
      setIsLoading(true);
      deleteQuestionApi(_id)
        .then((res) => {
          setModal(false);
          setIsLoading(false);
          getExamByLessonApi(id, 0, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
          });
        });
    },
    [startPage, id]
  );

  const activeQuestion = useCallback(
    (_id, active) => {
      setIsLoading(true);
      if (active) {
        activeQuestionApi(_id, { is_active: false })
          .then((res) => {
            setModalActive(false);
            setIsLoading(false);
            getExamByLessonApi(id, 0, 20)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err?.message,
            });
          });
      } else {
        activeQuestionApi(_id, { is_active: true })
          .then((res) => {
            setModalActive(false);
            setIsLoading(false);
            getExamByLessonApi(id, 0, 20)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err?.message,
            });
          });
      }
    },
    [startPage, id]
  );

  const columns = [
    {
      title: `${i18n.t("number_sentences", { lng: lang })}`,
      render: (data) => {
        return <a className="title-question">{data?.question}</a>;
      },
      align: "center",
    },
    {
      title: `${i18n.t("question", { lng: lang })}`,
      render: (data) => {
        return <a className="title-question">{data?.title}</a>;
      },
    },
    {
      title: `${i18n.t("answer", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-answer">
            {data?.choose?.map((item, index) => {
              return (
                <a
                  className={
                    item?.isCorrect ? "title-answer-correct" : "title-answer"
                  }
                >
                  {item?.answer}
                </a>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "action",
      render: (data) => {
        return (
          <a>
            {checkElement?.includes("active_exam_test_setting") && (
              <img
                className="img-unlock-banner"
                src={data?.is_active ? onToggle : offToggle}
                onClick={toggleActive}
              />
            )}
          </a>
        );
      },
    },
    {
      key: "action",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <a>
              <MoreOutlined className="icon-more" />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: checkElement?.includes("edit_exam_test_setting") && (
        <EditQuizz
          id={itemEdit?._id}
          setIsLoading={setIsLoading}
          setData={setData}
          setTotal={setTotal}
          startPage={startPage}
          idLesson={id}
        />
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_exam_test_setting") && (
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const lenghtData = data?.length < 20 ? 20 : data.length;
    const start = page * lenghtData - lenghtData;
    setStartPage(start);
    getExamByLessonApi(id, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <>
      <a className="title-quizz">Chi tiết câu hỏi bài học</a>

      <div className="div-container-question">
        {checkElement?.includes("create_exam_test_setting") && (
          <AddQuizz
            setIsLoading={setIsLoading}
            setData={setData}
            setTotal={setTotal}
            startPage={startPage}
            id={id}
          />
        )}

        <div className="mt-3">
          <Table
            dataSource={data}
            columns={columns}
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
                    x: 1000,
                  }
                : null
            }
            pagination={{
              current: currentPage,
              onChange: onChange,
              total: total,
              pageSize: 20,
            }}
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("delete_question", { lng: lang })}`}
            handleOk={() => deleteQuestion(itemEdit?._id)}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            handleCancel={toggle}
            body={
              <>
                <a>{`${i18n.t("want_delete_question", { lng: lang })}`} </a>
                <a>{itemEdit?.title}</a>
              </>
            }
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modalActive}
            title={itemEdit?.is_active ? "Ẩn câu hỏi" : "Hiện thị câu hỏi"}
            handleOk={() => activeQuestion(itemEdit?._id, itemEdit?.is_active)}
            textOk={itemEdit?.is_active ? "Ẩn" : "Hiện"}
            handleCancel={toggleActive}
            body={
              <>
                {itemEdit?.is_active ? (
                  <a>Bạn có chắc muốn ẩn câu số {itemEdit?.question} không?</a>
                ) : (
                  <a>
                    Bạn có chắc muốn hiện câu số {itemEdit?.question} không?
                  </a>
                )}
              </>
            }
          />
        </div>

        {isLoading && <LoadingPagination />}
      </div>
    </>
  );
};

export default DetailLesson;

const DATA = [
  { title: "all", value: "all" },
  {
    title: "active",
    value: "active",
  },
];

const TAB = [
  { title: "input", value: "input" },
  { title: "periodic", value: "periodic" },
  { title: "theory_input", value: "theory_input" },
];
