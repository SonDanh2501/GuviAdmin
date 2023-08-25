import { Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getExtendByOptionalApi } from "../../../../../api/service";
import { formatMoney } from "../../../../../helper/formatMoney";

const ExtendOptionalService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getExtendByOptionalApi(id)
        .then((res) => {
          setData(res?.data);
        })
        .catch((err) => {});
    }
  }, [id]);

  const columns = [
    {
      title: "Title",
      render: (data) => (
        <p
          style={{ margin: 0 }}
          onClick={() =>
            navigate(
              `/services/manage-group-service/service/optional-service/extend-optional/edit-price`,
              { state: { id: data?._id, data_price: data?.area_fee } }
            )
          }
        >
          {data?.title?.vi}
        </p>
      ),
    },
    {
      title: "Mô tả",
      render: (data) => <p style={{ margin: 0 }}>{data?.description?.vi}</p>,
    },
    {
      title: "Giá",
      render: (data) => <p style={{ margin: 0 }}>{formatMoney(data?.price)}</p>,
    },
    {
      title: "Phí dịch vụ",
      render: (data) => <p style={{ margin: 0 }}>{data?.platform_fee}</p>,
      align: "center",
    },
  ];
  return (
    <div>
      <h3>Extend Optional</h3>
      <div className="mt-3">
        <Table dataSource={data} pagination={false} columns={columns} />
      </div>
    </div>
  );
};

export default ExtendOptionalService;
