import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getListRoleAdmin } from "../../../../../api/createAccount";
import i18n from "../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";

const RoleAccount = () => {
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();

  useEffect(() => {
    getListRoleAdmin()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {});
  }, []);

  const items = [
    {
      key: 1,
      label: checkElement?.includes("edit_role_permission_setting") && (
        <p
          className="m-0"
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
        </p>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("name", { lng: lang })} ${i18n.t("permissions", {
        lng: lang,
      })}`,
      render: (data) => <p className="m-0">{data?.name_role}</p>,
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
                  <MoreOutlined className="icon-more" />
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
    </div>
  );
};

export default RoleAccount;
