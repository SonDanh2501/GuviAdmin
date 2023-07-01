import { useEffect, useState } from "react";
import CreateRole from "./CreateRole";
import { getListRoleAdmin } from "../../../../../api/createAccount";
import { Button, Dropdown, Space, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import EditRole from "./EditRole";
import LoadingPagination from "../../../../../components/paginationLoading";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import { useNavigate } from "react-router-dom";
import i18n from "../../../../../i18n";

const RoleAccount = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();

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
      label: checkElement?.includes("edit_role_permission_setting") && (
        <a
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/setting_role/edit_role",
              {
                state: { item: itemEdit },
              }
            )
          }
        >
          {`${i18n.t("edit", { lng: lang })}`}
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("name", { lng: lang })} ${i18n.t("permissions", {
        lng: lang,
      })}`,
      render: (data) => <a>{data?.name_role}</a>,
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <>
            {checkElement?.includes("edit_role_permission_setting") && (
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
            )}
          </>
        );
      },
    },
  ];
  return (
    <div>
      {checkElement?.includes("create_role_permission_setting") && (
        // <CreateRole
        //   setDataList={setData}
        //   setTotal={setTotal}
        //   setIsLoading={setIsLoading}
        // />
        <Button
          type="primary"
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/setting_role/create_role"
            )
          }
        >
          {`${i18n.t("add", { lng: lang })} ${i18n.t("permissions", {
            lng: lang,
          })}`}
        </Button>
      )}

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
