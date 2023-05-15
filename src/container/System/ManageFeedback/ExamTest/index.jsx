import { useEffect, useState } from "react";
import "./styles.scss";
import { getListTestCollaboratorApi } from "../../../../api/feedback";
import { Table } from "antd";
import moment from "moment";

const ExamTest = () => {
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
      title: "Điểm",
      render: (data) => <a>{data?.score}</a>,
    },
  ];

  return (
    <div>
      <a></a>
      <div>
        <Table dataSource={data} pagination={false} columns={columns} />
      </div>
    </div>
  );
};

export default ExamTest;
