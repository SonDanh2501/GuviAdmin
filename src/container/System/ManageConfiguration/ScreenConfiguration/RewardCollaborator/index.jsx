import { Button, Dropdown, Pagination, Space, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  activeRewardCollaboratorApi,
  deleteRewardCollaboratorApi,
  getListRewardCollaborator,
} from "../../../../../api/configuration";
import moment from "moment";
import "./styles.scss";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import { getElementState } from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";

const RewardCollaborator = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);
  const navigate = useNavigate();

  useEffect(() => {
    getListRewardCollaborator(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onActiveReward = (id, active) => {
    setIsLoading(true);
    if (active) {
      activeRewardCollaboratorApi(id, { is_active: false })
        .then((res) => {
          setModalActive(false);
          getListRewardCollaborator(startPage, 20)
            .then((res) => {
              setIsLoading(false);
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
      activeRewardCollaboratorApi(id, { is_active: true })
        .then((res) => {
          setModalActive(false);
          getListRewardCollaborator(startPage, 20)
            .then((res) => {
              setIsLoading(false);
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
  };

  const onDeleteReward = (_id) => {
    setIsLoading(true);
    deleteRewardCollaboratorApi(_id)
      .then((res) => {
        setIsLoading(false);
        setModal(false);
        getListRewardCollaborator(startPage, 20)
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
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getListRewardCollaborator(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-date-create-reward">
            <a className="text-date">
              {moment(data?.date_create).format("DD-MM-YYYY")}
            </a>
            <a className="text-date">
              {moment(data?.date_create).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Tiêu đề",
      render: (data) => <a className="text-reward">{data?.title?.vi}</a>,
    },
    {
      title: "Mô tả",
      render: (data) => <a className="text-reward">{data?.description?.vi}</a>,
    },
    {
      title: "Trạng thái",
      render: (data) => {
        return (
          <div>
            {data?.status === "upcoming" ? (
              <a className="text-upcoming-reward">Sắp diễn ra</a>
            ) : data?.status === "doing" ? (
              <a className="text-upcoming-reward">Đang diễn ra</a>
            ) : data?.status === "out_of_stock" ? (
              <a className="text-cance-rewardl">Hết số lượng</a>
            ) : data?.status === "out_of_date" ? (
              <a className="text-cancel-reward">Hết hạn</a>
            ) : (
              <a className="text-cancel-reward">Kết thúc</a>
            )}
          </div>
        );
      },
    },
    {
      key: "action",
      render: (data) => (
        <Switch
          checkedChildren="On"
          unCheckedChildren="Off"
          checked={data?.is_active}
          onChange={() =>
            checkElement.includes("active_reward_collaborator_setting ") &&
            setModalActive(true)
          }
        />
      ),
    },
    {
      key: "action",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            placement="bottom"
          >
            <a style={{ color: "black" }}>
              <i class="uil uil-ellipsis-v"></i>
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: checkElement.includes("edit_reward_collaborator_setting") && (
        <a
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/reward_collaborator/edit",
              {
                state: { id: itemEdit?._id },
              }
            )
          }
        >
          Chỉnh sửa
        </a>
      ),
    },
    {
      key: "2",
      label: checkElement.includes("delete_reward_collaborator_setting") && (
        <a onClick={() => setModal(true)}>Xoá</a>
      ),
    },
  ];

  return (
    <div>
      {checkElement.includes("create_reward_collaborator_setting") && (
        <Button
          type="primary"
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/reward_collaborator/create"
            )
          }
        >
          Thêm thưởng
        </Button>
      )}

      <div className="mt-3">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
        />

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
      </div>

      <div>
        <ModalCustom
          title={
            itemEdit?.is_active
              ? "Ẩn điều kiện thưởng"
              : "Hiện điều kiện thưởng"
          }
          isOpen={modalActive}
          handleOk={() => onActiveReward(itemEdit?._id, itemEdit?.is_active)}
          handleCancel={() => setModalActive(false)}
          textOk={itemEdit?.is_active ? "Ẩn" : "Hiện"}
          body={
            <a>
              {itemEdit?.is_active
                ? `Bạn có muốn ẩn điều kiển thưởng "${itemEdit?.title?.vi}" cho CTV?`
                : `Bạn có muốn hiện điệu kiển thưởng "${itemEdit?.title?.vi}" cho CTV?`}
            </a>
          }
        />
      </div>

      <div>
        <ModalCustom
          title="Xoá điều kiện thưởng"
          isOpen={modal}
          handleOk={() => onDeleteReward(itemEdit?._id)}
          handleCancel={() => setModal(false)}
          textOk="Xoá"
          body={<a>Bạn có muốn xoá điều kiển thưởng "{itemEdit?.title?.vi}"</a>}
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default RewardCollaborator;
