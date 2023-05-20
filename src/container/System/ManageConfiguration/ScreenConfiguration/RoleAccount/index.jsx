import { useEffect, useState } from "react";
import CreateRole from "./CreateRole";
import { getListRoleAdmin } from "../../../../../api/createAccount";
import { Dropdown, Space, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import EditRole from "./EditRole";
import LoadingPagination from "../../../../../components/paginationLoading";

const RoleAccount = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getListRoleAdmin()
      .then((res) => {
        setData(res.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const items = [
    {
      key: 1,
      label: (
        <EditRole
          item={itemEdit}
          setDataList={setData}
          setTotal={setTotal}
          setIsLoading={setIsLoading}
        />
      ),
    },
  ];

  const columns = [
    {
      title: "Tên quyền",
      render: (data) => <a>{data?.name_role}</a>,
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
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
        );
      },
    },
  ];
  return (
    <div>
      <CreateRole
        setDataList={setData}
        setTotal={setTotal}
        setIsLoading={setIsLoading}
      />

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

export default RoleAccount;
