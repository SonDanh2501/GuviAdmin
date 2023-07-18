import { Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getExtendByOptionalApi } from "../../../../../api/service";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";

const ExtendOptionalService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getExtendByOptionalApi(id)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }
  }, [id]);

  const columns = [
    {
      title: "Title",
      render: (data) => (
        <a
          onClick={() =>
            navigate(
              `/services/manage-group-service/service/optional-service/extend-optional/edit-price`,
              { state: { id: data?._id, data_price: data?.price_option_area } }
            )
          }
        >
          {data?.title?.vi}
        </a>
      ),
    },
    {
      title: "Mô tả",
      render: (data) => <a>{data?.description?.vi}</a>,
    },
    {
      title: "Giá",
      render: (data) => <a>{formatMoney(data?.price)}</a>,
    },
    {
      title: "Phí dịch vụ",
      render: (data) => <a>{data?.platform_fee}</a>,
      align: "center",
    },
  ];
  return (
    <div>
      <h3>Extend Optional</h3>
      <div className="mt-3">
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

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ExtendOptionalService;
