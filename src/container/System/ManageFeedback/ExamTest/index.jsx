import { useEffect, useState } from "react";
import "./styles.scss";
import { getListTestCollaboratorApi } from "../../../../api/feedback";
import { Dropdown, Pagination, Space, Table } from "antd";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";
import DetailsExam from "./DetailsExam";

const ExamTest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);

  useEffect(() => {
    getListTestCollaboratorApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: "Cộng tác viên",
      render: (data) => {
        return (
          <div className="div-collaborator-test">
            <a>{data?.id_collaborator?.name}</a>
            <a>{data?.id_collaborator?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Ngày làm",
      render: (data) => {
        return (
          <div className="div-create-exam">
            <a className="text-create-ctv">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create-ctv">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Số câu",
      render: (data) => <a>{data?.total_answers}</a>,
      align: "center",
    },
    {
      title: "Câu đúng",
      render: (data) => <a>{data?.correct_answers}</a>,
      align: "center",
    },
    {
      title: "Câu sai",
      render: (data) => <a>{data?.total_answers - data?.correct_answers}</a>,
      align: "center",
    },
    {
      title: "Điểm",
      render: (data) => <a>{data?.score}</a>,
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
      key: 1,
      label: <DetailsExam id={itemEdit?._id} />,
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    getListTestCollaboratorApi(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <div>
      <div>
        <Table
          dataSource={data}
          pagination={false}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
        />
      </div>
      <div className="mt-1 div-pagination p-2">
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
  );
};

export default ExamTest;
