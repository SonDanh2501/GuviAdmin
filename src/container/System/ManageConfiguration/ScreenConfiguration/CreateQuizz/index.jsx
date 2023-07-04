import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Input, Pagination, Space, Table, Tabs } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  activeQuestionApi,
  deleteQuestionApi,
  getListQuestionApi,
} from "../../../../../api/configuration";
import offToggle from "../../../../../assets/images/off-button.png";
import onToggle from "../../../../../assets/images/on-button.png";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import AddQuizz from "./AddQuizz";
import EditQuizz from "./EditQuizz";
import "./index.scss";
import i18n from "../../../../../i18n";
const { TextArea } = Input;
const width = window.innerWidth;

const CreateQuizz = () => {
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
  const [tab, setTab] = useState("all");
  const [type, setType] = useState("input");
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);

  useEffect(() => {
    getListQuestionApi(startPage, 20, tab, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab, type]);

  const deleteQuestion = useCallback(
    (id) => {
      setIsLoading(true);
      deleteQuestionApi(id)
        .then((res) => {
          setModal(false);
          getListQuestionApi(startPage, 20, tab, type)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [startPage, tab, type]
  );

  const activeQuestion = useCallback(
    (id, active) => {
      setIsLoading(true);
      if (active) {
        activeQuestionApi(id, { is_active: false })
          .then((res) => {
            setModalActive(false);
            getListQuestionApi(startPage, 20, tab, type)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
                setIsLoading(false);
              })
              .catch((err) => {
                setIsLoading(false);
              });
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      } else {
        activeQuestionApi(id, { is_active: true })
          .then((res) => {
            setModalActive(false);
            getListQuestionApi(startPage, 20, tab, type)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
                setIsLoading(false);
              })
              .catch((err) => {
                setIsLoading(false);
              });
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [startPage, tab, type]
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
                onClick={() => activeQuestion(data?._id, data?.is_active)}
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
            placement="bottom"
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
          tab={tab}
          type={type}
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
    getListQuestionApi(start, 20, tab, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <>
      <a className="title-quizz">{`${i18n.t("config_question", {
        lng: lang,
      })}`}</a>

      <div className="div-tab-type-exam">
        {TAB.map((item, index) => {
          return (
            <div
              className={item?.value === type ? "div-tab-select" : "div-tab"}
              key={index}
              onClick={() => {
                setType(item?.value);
                setTab("all");
              }}
            >
              <a className="text-tab">{`${i18n.t(item?.title, {
                lng: lang,
              })}`}</a>
            </div>
          );
        })}
      </div>

      <div className="div-container-question">
        {checkElement?.includes("create_exam_test_setting") && (
          <AddQuizz
            setIsLoading={setIsLoading}
            setData={setData}
            setTotal={setTotal}
            startPage={startPage}
            tab={tab}
            type={type}
          />
        )}

        <div className="mt-3">
          <div className="div-tab-exam">
            {DATA.map((item, index) => {
              return (
                <div
                  className={item?.value === tab ? "div-tab-select" : "div-tab"}
                  key={index}
                  onClick={() => setTab(item?.value)}
                >
                  <a className="text-tab">{`${i18n.t(item?.title, {
                    lng: lang,
                  })}`}</a>
                </div>
              );
            })}
          </div>
          <Table
            dataSource={data}
            columns={columns}
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
                    x: 1000,
                  }
                : null
            }
          />

          <div className="mt-2 div-pagination p-2">
            <a>
              {`${i18n.t("total", { lng: lang })}`}: {total}
            </a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={total}
                showSizeChanger={false}
                pageSize={20}
              />
            </div>
          </div>
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
                <a>{`${i18n.t("want_delete_question", { lng: lang })}`}</a>
                <a>{itemEdit?.question}</a>
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
                  <a>Bạn có chắc muốn ẩn câu {itemEdit?.question} không?</a>
                ) : (
                  <a>Bạn có chắc muốn hiện câu {itemEdit?.question} không?</a>
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

export default CreateQuizz;

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
