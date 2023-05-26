import { useEffect, useState } from "react";
import "./styles.scss";
import { getListTestCollaboratorApi } from "../../../../api/feedback";
import { Pagination, Table } from "antd";
import moment from "moment";

const ExamTest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
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
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getListTestCollaboratorApi(start, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <div>
      <a></a>
      <div>
        <Table dataSource={data} pagination={false} columns={columns} />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamTest;
