import { useCallback, useEffect, useRef, useState } from "react";
import {
  activeLessonApi,
  deleteLessonApi,
  getListTrainningLessonApi,
} from "../../../../../api/configuration";
import { Dropdown, Select, Space, Table } from "antd";
import offToggle from "../../../../../assets/images/off-button.png";
import onToggle from "../../../../../assets/images/on-button.png";
import { useSelector } from "react-redux";
import { getElementState } from "../../../../../redux/selectors/auth";
import AddLesson from "./AddLesson";
import "./index.scss";
import { MoreOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../components/modalCustom";
import { errorNotify } from "../../../../../helper/toast";
import LoadingPagination from "../../../../../components/paginationLoading";
import EditLesson from "./EditLesson";
import { Link } from "react-router-dom";

const CreateQuizz = () => {
  const checkElement = useSelector(getElementState);
  const [type, setType] = useState("");
  const [data, setData] = useState([1]);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);

  useEffect(() => {
    getListTrainningLessonApi(0, 20, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const deleteLesson = useCallback(
    (id) => {
      setIsLoading(true);
      deleteLessonApi(id)
        .then((res) => {
          setModalDelete(false);
          setIsLoading(false);
          getListTrainningLessonApi(startPage, 20, "")
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .then((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [startPage]
  );

  const activeLesson = useCallback(
    (id, active) => {
      setIsLoading(true);
      if (active) {
        activeLessonApi(id, { is_active: false })
          .then((res) => {
            setIsLoading(false);
            setModalActive(false);
            getListTrainningLessonApi(startPage, 20, "")
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      } else {
        activeLessonApi(id, { is_active: true })
          .then((res) => {
            setIsLoading(false);
            setModalActive(false);
            getListTrainningLessonApi(startPage, 20, "")
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [startPage]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data?.length < 20 ? 20 : data?.length;
    const start = page * dataLength - dataLength;
    setStartPage(start);
    getListTrainningLessonApi(start, 20, "")
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeType = (e) => {
    setType(e);
    getListTrainningLessonApi(0, 20, e)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const column = [
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Tiêu đề</a>;
      },
      render: (data) => {
        return (
          <Link
            to={`/adminManage/manage-configuration/lesson/details-lesson/${data?._id}`}
          >
            <a className="title-lesson">{data?.title?.vi}</a>
          </Link>
        );
      },
    },
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Video</a>;
      },
      render: (data) => {
        return <a className="title-lesson">{data?.link_video}</a>;
      },
    },
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Loại</a>;
      },
      render: (data) => {
        return (
          <a className="title-lesson">
            {data?.type_training_lesson === "input"
              ? "Đầu vào"
              : data?.type_training_lesson === "theory_input"
              ? "Lý thuyết"
              : data?.type_training_lesson === "periodic"
              ? "Định kì"
              : data?.type_training_lesson === "training"
              ? "Đào tạo"
              : "Nâng cao"}
          </a>
        );
      },
    },
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Lần nộp bài</a>;
      },
      render: (data) => {
        return <a className="title-lesson">{data?.times_submit}</a>;
      },
      align: "center",
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
                onClick={() => setModalActive(true)}
              />
            )}
          </a>
        );
      },
      align: "center",
    },
    {
      key: "action",
      render: (data) => {
        return (
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
        );
      },
      align: "center",
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <Link
          to={`/adminManage/manage-configuration/lesson/details-lesson/${item?._id}`}
        >
          <a>Chi tiết câu hỏi</a>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <EditLesson
          setData={setData}
          setTotal={setTotal}
          setIsLoading={setIsLoading}
          data={item}
        />
      ),
    },
    {
      key: "3",
      label: <a onClick={() => setModalDelete(true)}>Xoá</a>,
    },
  ];

  return (
    <div>
      <h5>Danh sách bài học</h5>
      <div className="div-select-add-lesson">
        <Select
          onChange={onChangeType}
          style={{ width: "auto" }}
          value={type}
          options={[
            { value: "", label: "Lọc theo loại bài" },
            { value: "input", label: "Đầu vào" },
            { value: "theory_input", label: "Lý thuyết" },
            { value: "periodic", label: "Định kì" },
            { value: "training", label: "Đào tạo" },
            { value: "premium", label: "Nâng cao" },
          ]}
        />
        <AddLesson
          setData={setData}
          setTotal={setTotal}
          setIsLoading={setIsLoading}
        />
      </div>
      <div className="mt-3">
        <Table
          dataSource={data}
          columns={column}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItem(record);
              },
            };
          }}
          pagination={{
            total: total,
            pageSize: 20,
            onChange: onChange,
            current: currentPage,
          }}
        />
      </div>

      <ModalCustom
        title="Xoá bài học"
        isOpen={modalDelete}
        handleOk={() => deleteLesson(item?._id)}
        textOk="Xoá"
        handleCancel={() => setModalDelete(false)}
        body={<a>Bạn có muốn xoá bài học {item?.title?.vi}</a>}
      />

      <ModalCustom
        title={item?.is_active ? "Khoá bài học" : "Mở khoá bài học"}
        isOpen={modalActive}
        handleOk={() => activeLesson(item?._id, item?.is_active)}
        textOk={item?.is_active ? "Khoá" : "Mở khoá"}
        handleCancel={() => setModalActive(false)}
        body={
          <div>
            <a>
              {item?.is_active
                ? "Bạn có muốn khoá bài học này không? "
                : "Bạn có muốn mở khoá bài học này không? "}
            </a>
            <a>{item?.title?.vi}</a>
          </div>
        }
      />

      {isLoading && <LoadingPagination />}
    </div>
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
