import { useEffect, useState } from "react";
import { getGroupServiceApi } from "../../../../api/service";
import { Dropdown, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";

const GroupService = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getGroupServiceApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            navigate("/services/manage-group-service/manage-price-service", {
              state: { id: itemEdit?._id },
            });
          }}
        >
          Xem giá
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Hình ảnh",
      width: "30%",
      render: (data) => {
        return (
          <div>
            <img className="img-customer-service" src={data?.thumbnail} />
          </div>
        );
      },
    },
    {
      title: "Tiêu đề",
      render: (data) => {
        return <a className="text-title">{data?.title.vi}</a>;
      },
      width: "35%",
    },
    {
      title: "Loại dịch vụ",
      render: (data) => <a className="text-service">{data?.type}</a>,
      width: "30%",
    },
    {
      key: "action",
      width: "10%",
      align: "center",
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

  return (
    <div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default GroupService;
