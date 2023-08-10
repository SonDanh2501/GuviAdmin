import { Dropdown, Space, Switch, Table } from "antd";
import "./styles.scss";
import { useEffect, useState } from "react";
import { getListBusiness } from "../../../../../api/configuration";
import moment from "moment";
import CreateBusiness from "./CreateBusiness";
import EditBusiness from "./EditBusiness";

const BusinessConfig = () => {
  const [state, setState] = useState({
    data: "",
    itemEdit: "",
  });

  useEffect(() => {
    getListBusiness(0, 20, "")
      .then((res) => {
        setState({ ...state, data: res?.data });
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: () => <a className="title-column">Ngày tạo</a>,
      render: (data) => (
        <a>{moment(data?.date_create).format("DD/MM/YYYY - HH:mm")}</a>
      ),
    },
    {
      title: () => <a className="title-column">Tên đối tác</a>,
      render: (data) => <a>{data?.full_name}</a>,
    },
    {
      title: () => <a className="title-column">Mã số thuế</a>,
      render: (data) => <a>{data?.tax_code}</a>,
    },
    {
      key: "action",
      render: (data) => (
        <Switch
          checked={data?.is_active}
          style={{ backgroundColor: data?.is_active ? "#00cf3a" : "" }}
          size="small"
        />
      ),
    },
    {
      key: "action",
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
              <i class="uil uil-ellipsis-v" style={{ color: "#000" }}></i>
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <EditBusiness
          id={state.itemEdit?._id}
          setData={setState}
          data={state}
        />
      ),
    },
    {
      key: "2",
    },
  ];

  return (
    <div>
      <a className="title-business">Cấu hình đối tác kinh doanh</a>
      <div className="div-head">
        <CreateBusiness setData={setState} data={state} />
      </div>
      <div className="mt-5">
        <Table
          dataSource={state.data}
          columns={columns}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setState({ ...state, itemEdit: record });
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default BusinessConfig;
