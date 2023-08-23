import { useEffect, useState } from "react";
import { getGroupServiceApi } from "../../../../api/service";
import { Dropdown, Image, Space, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const EditPriceService = () => {
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getGroupServiceApi(0, 20)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            navigate("/services/manage-group-service/manage-price-service", {
              state: { id: itemEdit?._id },
            });
          }}
        >
          Xem giá
        </p>
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
            <Image
              style={{ width: 50, height: 50, borderRadius: 4 }}
              src={data?.thumbnail}
            />
          </div>
        );
      },
    },
    {
      title: "Tiêu đề",
      render: (data) => {
        return <p className="text-title m-0">{data?.title.vi}</p>;
      },
      width: "35%",
    },
    {
      title: "Loại dịch vụ",
      render: (data) => <p className="text-service m-0">{data?.type}</p>,
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
            placement="bottomRight"
            trigger={["click"]}
          >
            <MoreOutlined className="icon-more" />
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

export default EditPriceService;
