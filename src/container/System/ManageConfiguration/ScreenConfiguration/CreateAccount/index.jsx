import { useCallback, useEffect, useState } from "react";
import {
  deleteAccountAdmin,
  getListAccount,
} from "../../../../../api/createAccount";
import { getElementState } from "../../../../../redux/selectors/auth";
import { Pagination, Table, Space, Dropdown, Modal } from "antd";
import { useSelector } from "react-redux";
import { MoreOutlined } from "@ant-design/icons";
import AddAccount from "./AddAccount";
import "./index.scss";
import EditAccount from "./EditAccount";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import offToggle from "../../../../../assets/images/off-button.png";
import onToggle from "../../../../../assets/images/on-button.png";
import { activeAccountAdmin } from "../../../../../api/createAccount";
const width = window.innerWidth;

const CreateAccount = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const checkElement = useSelector(getElementState);

  useEffect(() => {
    getListAccount(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteAccountAdmin(id)
        .then((res) => {
          setIsLoading(false);
          setModalDelete(false);
          getListAccount(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [startPage]
  );

  const onActive = useCallback(
    (_id, active) => {
      setIsLoading(true);
      if (active) {
        activeAccountAdmin(_id, { is_active: false })
          .then((res) => {
            setIsLoading(false);
            setModalActive(false);
            getListAccount(startPage, 20)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      } else {
        activeAccountAdmin(_id, { is_active: true })
          .then((res) => {
            setIsLoading(false);
            setModalActive(false);
            getListAccount(startPage, 20)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [startPage]
  );

  const columns = [
    {
      title: "Email đăng nhập",
      render: (data) => <a>{data?.email}</a>,
    },
    {
      title: "Tên hiện thị",
      render: (data) => <a>{data?.full_name}</a>,
    },
    {
      title: "Quyền",
      render: (data) => <a>{data?.id_role_admin?.name_role}</a>,
    },
    {
      key: "action",
      render: (data) => (
        <img
          src={data?.is_active ? onToggle : offToggle}
          className="img-toggle"
          onClick={() =>
            checkElement?.includes("active_user_system") && setModalActive(true)
          }
        />
      ),
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

  const items = [
    {
      key: 1,
      label: checkElement?.includes("edit_user_system") && (
        <EditAccount id={itemEdit?._id} setData={setData} setTotal={setTotal} />
      ),
    },
    {
      key: 2,
      label: checkElement?.includes("delete_user_system") && (
        <a onClick={() => setModalDelete(true)}> Xoá</a>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getListAccount(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <div>
      <div>
        {checkElement?.includes("create_user_system") && (
          <AddAccount setData={setData} setTotal={setTotal} />
        )}
      </div>
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
          scroll={
            width <= 490
              ? {
                  x: 1000,
                }
              : null
          }
        />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <Modal
          title="Xoá tài khoản"
          open={modalDelete}
          onOk={() => onDelete(itemEdit?._id)}
          okText="Xoá"
          onCancel={() => setModalDelete(false)}
          cancelText="Huỷ"
        >
          Bạn có muốn xoá tài khoản {itemEdit?.full_name}
        </Modal>
      </div>

      <div>
        <Modal
          title={itemEdit?.is_active ? "Chặn tài khoản" : "mở tài khoản"}
          open={modalActive}
          onOk={() => onActive(itemEdit?._id, itemEdit?.is_active)}
          okText={itemEdit?.is_active ? "Chặn" : "Mở"}
          onCancel={() => setModalActive(false)}
          cancelText="Huỷ"
        >
          {itemEdit?.is_active
            ? "Bạn có muốn chặn tài khoản " + itemEdit?.full_name
            : "Bạn có muốn mở tài khoản " + itemEdit?.full_name}
        </Modal>
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default CreateAccount;
