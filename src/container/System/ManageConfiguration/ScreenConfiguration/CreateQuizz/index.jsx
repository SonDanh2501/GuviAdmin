import { useCallback, useEffect, useState } from "react";
import "./index.scss";
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Dropdown,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import CustomTextEditor from "../../../../../components/customTextEdittor";
import {
  activeQuestionApi,
  addQuestionApi,
  deleteQuestionApi,
  editQuestionApi,
  getDetailsQuestionApi,
  getListQuestionApi,
} from "../../../../../api/configuration";
import { errorNotify } from "../../../../../helper/toast";
import { MoreOutlined } from "@ant-design/icons";
import LoadingPagination from "../../../../../components/paginationLoading";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import onToggle from "../../../../../assets/images/on-button.png";
import offToggle from "../../../../../assets/images/off-button.png";
import { useSelector } from "react-redux";
import { getElementState } from "../../../../../redux/selectors/auth";
import ModalCustom from "../../../../../components/modalCustom";
import AddQuizz from "./AddQuizz";
import EditQuizz from "./EditQuizz";
const { TextArea } = Input;
const width = window.innerWidth;

const CreateQuizz = () => {
  const checkElement = useSelector(getElementState);
  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
      description: "",
      question: "",
      choose: [
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
      ],
    },
  ]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [edit, setEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);

  useEffect(() => {
    getListQuestionApi(startPage, 20, tab)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab]);

  // const openEditQuestion = () => {
  //   setEdit(true);
  //   setIsLoading(true);
  //   showDrawer();
  //   getDetailsQuestionApi(itemEdit?._id)
  //     .then((res) => {
  //       const arr = [...dataQuestion];
  //       dataQuestion[0].title = res?.title;
  //       dataQuestion[0].description = res?.description;
  //       dataQuestion[0].question = res?.question;
  //       dataQuestion[0].choose = res?.choose;

  //       setDataQuestion(arr);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //     });
  // };

  const editQuestion = useCallback(() => {
    setIsLoading(true);
    editQuestionApi(itemEdit?._id, dataQuestion[0])
      .then((res) => {
        setOpen(false);
        getListQuestionApi(startPage, 20, tab)
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
  }, [itemEdit, startPage, dataQuestion, tab]);

  const deleteQuestion = useCallback(
    (id) => {
      setIsLoading(true);
      deleteQuestionApi(id)
        .then((res) => {
          setModal(false);
          getListQuestionApi(startPage, 20, tab)
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
    [startPage, tab]
  );

  const activeQuestion = useCallback(
    (id, active) => {
      setIsLoading(true);
      if (active) {
        activeQuestionApi(id, { is_active: false })
          .then((res) => {
            setModalActive(false);
            getListQuestionApi(startPage, 20, tab)
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
            getListQuestionApi(startPage, 20, tab)
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
    [startPage, tab]
  );

  const columns = [
    {
      title: "Số câu",
      render: (data) => {
        return <a className="title-question">{data?.question}</a>;
      },
      align: "center",
    },
    {
      title: "Câu hỏi",
      render: (data) => {
        return <a className="title-question">{data?.title}</a>;
      },
    },
    {
      title: "Câu trả lời",
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
        />
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_exam_test_setting") && (
        <a onClick={toggle}>Xoá</a>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const lenghtData = data?.length < 20 ? 20 : data.length;
    const start = page * lenghtData - lenghtData;
    setStartPage(start);
    getListQuestionApi(start, 20, tab)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <div className="div-container-question">
      <div className="div-header-question">
        <a className="title-quizz">Tạo câu hỏi</a>
        {checkElement?.includes("create_exam_test_setting") && (
          <AddQuizz
            setIsLoading={setIsLoading}
            setData={setData}
            setTotal={setTotal}
            startPage={startPage}
            tab={tab}
          />
        )}
      </div>
      <div className="mt-3">
        <div className="div-tab-exam">
          {DATA.map((item, index) => {
            return (
              <div
                className={item?.value === tab ? "div-tab-select" : "div-tab"}
                key={index}
                onClick={() => setTab(item?.value)}
              >
                <a className="text-tab">{item?.title}</a>
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
          <a>Tổng: {total}</a>
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
          title="Xóa câu hỏi"
          handleOk={() => deleteQuestion(itemEdit?._id)}
          textOk="Xoá"
          handleCancel={toggle}
          body={<a>Bạn có chắc muốn xóa câu {itemEdit?.question} không?</a>}
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
  );
};

export default CreateQuizz;

const DATA = [
  { title: "Tất cả", value: "all" },
  {
    title: "Đang hoạt động",
    value: "active",
  },
];
