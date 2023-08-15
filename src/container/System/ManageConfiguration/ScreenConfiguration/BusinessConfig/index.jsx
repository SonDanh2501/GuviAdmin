import { Dropdown, Space, Switch, Table } from "antd";
import "./styles.scss";
import { useCallback, useEffect, useState } from "react";
import {
  activeBusiness,
  deleteBusiness,
  getListBusiness,
} from "../../../../../api/configuration";
import moment from "moment";
import CreateBusiness from "./CreateBusiness";
import EditBusiness from "./EditBusiness";
import ModalCustom from "../../../../../components/modalCustom";
import { errorNotify } from "../../../../../helper/toast";
import LoadingPagination from "../../../../../components/paginationLoading";

const BusinessConfig = () => {
  const [state, setState] = useState({
    data: "",
    itemEdit: "",
    isLoading: false,
  });
  const [modalActive, setModalActive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  useEffect(() => {
    getListBusiness(0, 20, "")
      .then((res) => {
        setState({ ...state, data: res?.data });
      })
      .catch((err) => {});
  }, []);

  const onActive = useCallback(
    (id, active) => {
      setState({ ...state, isLoading: true });
      activeBusiness(id, { is_active: active ? false : true })
        .then((res) => {
          getListBusiness(0, 20, "")
            .then((res) => {
              setState({ ...state, data: res?.data, isLoading: false });
              setModalActive(false);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setState({ ...state, isLoading: false });
          errorNotify({
            message: err,
          });
        });
    },
    [state]
  );

  const onDelete = useCallback((id) => {
    setState({ ...state, isLoading: true });
    deleteBusiness(id)
      .then((res) => {
        setModalDelete(false);
        getListBusiness(0, 20, "")
          .then((res) => {
            setState({ ...state, data: res?.data, isLoading: false });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setState({ ...state, isLoading: false });
        errorNotify({
          message: err,
        });
      });
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
          onClick={() => setModalActive(true)}
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
      label: <a onClick={() => setModalDelete(true)}>Xoá</a>,
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

      <ModalCustom
        isOpen={modalActive}
        title={state.itemEdit?.is_active ? "Khoá đối tác" : "Mở khoá đối tác"}
        handleOk={() =>
          onActive(state.itemEdit?._id, state.itemEdit?.is_active)
        }
        textOk={state.itemEdit?.is_active ? "Khoá" : "Mở khoá"}
        handleCancel={() => setModalActive(false)}
        body={
          <a>
            {state.itemEdit?.is_active
              ? `Bạn có chắc muốn khoá đối tác này?  ${state.itemEdit?.full_name}`
              : `Bạn có chắc muốn mở khoá đối tác này?  ${state.itemEdit?.full_name}`}
          </a>
        }
      />

      <ModalCustom
        isOpen={modalDelete}
        title={"Xoá đối tác"}
        handleOk={() => onDelete(state.itemEdit?._id)}
        textOk="Xoá"
        handleCancel={() => setModalDelete(false)}
        body={
          <a>Bạn có chắc muốn xoá đối tác này? {state.itemEdit?.full_name}</a>
        }
      />

      {state?.isLoading && <LoadingPagination />}
    </div>
  );
};

export default BusinessConfig;
