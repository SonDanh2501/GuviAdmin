import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import {
  activeGroupPromotion,
  deleteGroupPromotion,
  getGroupPromotion,
} from "../../../../../api/configuration";
import _debounce from "lodash/debounce";
import { Dropdown, Image, Input, Space, Switch, Table } from "antd";
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

  const onDeleteGroupPromotion = (id) => {
    setState({ ...state, isLoading: true });
    deleteGroupPromotion(id)
      .then((res) => {
        setModalDelete(false);
        getGroupPromotion(0, 20, "")
          .then((res) => {
            setState({
              ...state,
              data: res?.data,
              totalData: res?.totalItem,
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setState({ ...state, isLoading: false });
        errorNotify({
            message: err?.message,
        });
      });
  };

  const onEditGroupPromotion = (id, active) => {
    setState({ ...state, isLoading: true });

    activeGroupPromotion(id, { is_active: active ? false : true })
      .then(() => {
        setModalEdit(false);
        getGroupPromotion(0, 20, "")
          .then((res) => {
            setState({
              ...state,
              data: res?.data,
              totalData: res?.totalItem,
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setState({ ...state, isLoading: false });
        errorNotify({
            message: err?.message,
        });
      });
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
      title: () => <p className="title-column">Ngày tạo</p>,
      render: (data) => (
        <p className="text-create-group-promo">
          {moment(data?.date_create).format("DD/MM/YYYY - HH:mm")}
        </p>
      ),
    },
    {
      title: () => <p className="title-column">Ảnh</p>,
      render: (data) => (
        <Image
          src={data?.thumbnail}
          style={{ width: 50, height: 50, borderRadius: 4 }}
        />
      ),
    },
    {
      title: () => <p className="title-column">Tiêu đề</p>,
      render: (data) => (
        <p className="text-create-group-promo">{data?.name?.[lang]}</p>
      ),
    },
    {
      title: () => <p className="title-column">Mô tả</p>,
      render: (data) => (
        <p className="text-create-group-promo">{data?.description?.[lang]}</p>
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
            <>
              <i className="uil uil-ellipsis-v" style={{ color: "#000" }}></i>
            </>
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
        <p
          className="m-0"
          onClick={() => {
            setModalDelete(true);
          }}
        >
          Xoá
        </p>
      ),
    },
  ];

  return (
    <>
      <p className="title-page">Cấu hình nhóm khuyến mãi</p>
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
          <p>
            Bạn có chắc muốn xoá nhóm khuyến mãi? {state.itemEdit?.name?.[lang]}
          </p>
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
          <p className="m-0">
            {modalEdit
              ? `Bạn có chắc muốn ẩn nhóm khuyến mãi? ${state.itemEdit?.name?.[lang]}`
              : `Bạn có chắc muốn hiện thị nhóm khuyến mãi? ${state.itemEdit?.name?.[lang]}`}
          </p>
        }
      />

      {state.isLoading && <LoadingPagination />}
    </>
  );
};

export default SettingGroupPromotion;
