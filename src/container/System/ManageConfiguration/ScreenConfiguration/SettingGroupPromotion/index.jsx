import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import {
  activeGroupPromotion,
  deleteGroupPromotion,
  getGroupPromotion,
} from "../../../../../api/configuration";
import _debounce from "lodash/debounce";
import { Dropdown, Input, Space, Switch, Table } from "antd";
import i18n from "../../../../../i18n";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import AddGroupPromotion from "./AddGroupPromotion";
import EditGroupPromotion from "./EditGroupPromotion";
import ModalCustom from "../../../../../components/modalCustom";
import { errorNotify } from "../../../../../helper/toast";
import LoadingPagination from "../../../../../components/paginationLoading";

const SettingGroupPromotion = () => {
  const lang = useSelector(getLanguageState);
  const [state, setState] = useState({
    data: [],
    totalData: 0,
    currenPage: 1,
    startPage: 0,
    valueSearch: "",
    itemEdit: [],
    isLoading: false,
  });
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  useEffect(() => {
    getGroupPromotion(0, 20, "")
      .then((res) => {
        setState({
          ...state,
          data: res?.data,
          totalData: res?.totalItem,
        });
      })
      .catch((err) => {});
  }, []);

  const getList = () => {
    getGroupPromotion(state.startPage, 20, state.valueSearch)
      .then((res) => {
        setState({
          ...state,
          data: res?.data,
          totalData: res?.totalItem,
          isLoading: false,
        });
      })
      .catch((err) => {});
  };

  const onDeleteGroupPromotion = (id) => {
    setState({ ...state, isLoading: true });
    deleteGroupPromotion(id)
      .then((res) => {
        setModalDelete(false);
        getList();
      })
      .catch((err) => {
        setState({ ...state, isLoading: false });
        errorNotify({
          message: err,
        });
      });
  };

  const onEditGroupPromotion = (id, active) => {
    setState({ ...state, isLoading: true });
    if (active) {
      activeGroupPromotion(id, { is_active: false })
        .then(() => {
          setModalEdit(false);
          getList();
        })
        .catch((err) => {
          setState({ ...state, isLoading: false });
          errorNotify({
            message: err,
          });
        });
    } else {
      activeGroupPromotion(id, { is_active: true })
        .then(() => {
          setModalEdit(false);
          getList();
        })
        .catch((err) => {
          setState({ ...state, isLoading: false });
          errorNotify({
            message: err,
          });
        });
    }
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setState({ ...state, valueSearch: value, isLoading: true });
      getGroupPromotion(state.startPage, 20, value)
        .then((res) => {
          setState({
            ...state,
            data: res?.data,
            totalData: res?.totalItem,
            isLoading: false,
          });
        })
        .catch((err) => {
          setState({ ...state, isLoading: false });
        });
    }, 1000),
    [state]
  );

  const columns = [
    {
      title: () => <a className="title-column">Ngày tạo</a>,
      render: (data) => (
        <a className="text-create-group-promo">
          {moment(data?.date_create).format("DD/MM/YYYY - HH:mm")}
        </a>
      ),
    },
    {
      title: () => <a className="title-column">Tiêu đề</a>,
      render: (data) => (
        <a className="text-create-group-promo">{data?.name?.[lang]}</a>
      ),
    },
    {
      title: () => <a className="title-column">Mô tả</a>,
      render: (data) => (
        <a className="text-create-group-promo">{data?.description?.[lang]}</a>
      ),
    },
    {
      key: "action",
      render: (data) => (
        <Switch
          size="small"
          checked={data?.is_active}
          style={{ backgroundColor: data?.is_active ? "#16a249" : "" }}
          onClick={() => setModalEdit(true)}
        />
      ),
      align: "center",
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
        <EditGroupPromotion
          item={state.itemEdit}
          setData={setState}
          data={state}
        />
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={() => {
            setModalDelete(true);
          }}
        >
          Xoá
        </a>
      ),
    },
  ];

  return (
    <>
      <a className="title-page">Cấu hình nhóm khuyến mãi</a>
      <div className="div-filter-group-promotion">
        <Input
          placeholder={`${i18n.t("search", { lng: lang })}`}
          type="text"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
            setState({ ...state, valueSearch: e.target.value });
          }}
          className="input-search-group-promotion"
        />
        <AddGroupPromotion setData={setState} data={state} />
      </div>

      <Table
        dataSource={state?.data}
        columns={columns}
        pagination={{
          current: state?.currenPage,
          total: state.totalData,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setState({ ...state, itemEdit: record });
            },
          };
        }}
      />

      <ModalCustom
        title="Xoá nhóm khuyến mãi"
        isOpen={modalDelete}
        textOk="Xoá"
        handleOk={() => onDeleteGroupPromotion(state.itemEdit?._id)}
        handleCancel={() => setModalDelete(false)}
        body={
          <a>
            Bạn có chắc muốn xoá nhóm khuyến mãi? {state.itemEdit?.name?.[lang]}
          </a>
        }
      />

      <ModalCustom
        title={modalEdit ? "Ẩn nhóm khuyến mãi" : "Hiện nhóm khuyến mãi"}
        isOpen={modalEdit}
        textOk={modalEdit ? "Ẩn" : "Hiện"}
        handleOk={() =>
          onEditGroupPromotion(state.itemEdit?._id, state?.is_active)
        }
        handleCancel={() => setModalEdit(false)}
        body={
          <a>
            {modalEdit
              ? `Bạn có chắc muốn ẩn nhóm khuyến mãi? ${state.itemEdit?.name?.[lang]}`
              : `Bạn có chắc muốn hiện thị nhóm khuyến mãi? ${state.itemEdit?.name?.[lang]}`}
          </a>
        }
      />

      {state.isLoading && <LoadingPagination />}
    </>
  );
};

export default SettingGroupPromotion;
