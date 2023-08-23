import { Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOptionalServiceByServiceApi } from "../../../../../api/service";
import "./styles.scss";

const OptionalService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getOptionalServiceByServiceApi(id)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, [id]);

  const columns = [
    {
      title: "Tiêu đề",
      render: (data) => (
        <p
          style={{ margin: 0 }}
          onClick={() =>
            navigate(
              `/services/manage-group-service/service/optional-service/extend-optional`,
              { state: { id: data?._id } }
            )
          }
        >
          {data?.title?.vi}
        </p>
      ),
      width: "40%",
    },
    {
      title: "Mô tả",
      render: (data) => <p style={{ margin: 0 }}>{data?.description?.vi}</p>,
    },
  ];

  return (
    <div>
      <h3>Optional Service</h3>

      <div className="mt-3">
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
    </div>
  );
};

export default OptionalService;
