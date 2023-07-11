import { useEffect, useRef, useState } from "react";
import { getListTrainningLessonApi } from "../../../../../api/configuration";
import { Table } from "antd";
import offToggle from "../../../../../assets/images/off-button.png";
import onToggle from "../../../../../assets/images/on-button.png";
import { useSelector } from "react-redux";
import { getElementState } from "../../../../../redux/selectors/auth";

const CreateQuizz = () => {
  const checkElement = useSelector(getElementState);
  const [type, setType] = useState("input");
  const [data, setData] = useState([1]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getListTrainningLessonApi(0, 20, "")
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [type]);

  const column = [
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Tiêu đề</a>;
      },
      render: (data) => {
        return <a>{data?.title}</a>;
      },
    },
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Video</a>;
      },
      render: (data) => {
        return <a>{data?.link_video}</a>;
      },
    },
    {
      title: () => {
        return <a style={{ fontSize: 12 }}>Loại</a>;
      },
      render: (data) => {},
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
              />
            )}
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <h5>Danh sách bài học</h5>
      <div>
        <Table
          dataSource={data}
          columns={column}
          pagination={{
            total: total,
            pageSize: 20,
            onChange: () => {},
          }}
        />
      </div>
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
