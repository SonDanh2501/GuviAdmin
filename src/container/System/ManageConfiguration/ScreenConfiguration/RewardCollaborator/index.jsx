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
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import i18n from "../../../../../i18n";

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
  const lang = useSelector(getLanguageState);
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
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-date-create-reward">
            <p className="text-date">
              {moment(data?.date_create).format("DD-MM-YYYY")}
            </p>
            <p className="text-date">
              {moment(data?.date_create).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("title", { lng: lang })}`,
      render: (data) => <p className="text-reward">{data?.title?.vi}</p>,
    },
    {
      title: `${i18n.t("describe", { lng: lang })}`,
      render: (data) => <p className="text-reward">{data?.description?.vi}</p>,
    },
    {
      title: `${i18n.t("status", { lng: lang })}`,
      render: (data) => {
        return (
          <div>
            {data?.status === "upcoming" ? (
              <p className="text-upcoming-reward">{`${i18n.t("upcoming", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "doing" ? (
              <p className="text-upcoming-reward">{`${i18n.t("happenning", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "out_of_stock" ? (
              <p className="text-cance-rewardl">{`${i18n.t("out_stock", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "out_of_date" ? (
              <p className="text-cancel-reward">{`${i18n.t("out_date", {
                lng: lang,
              })}`}</p>
            ) : (
              <p className="text-cancel-reward">{`${i18n.t("closed", {
                lng: lang,
              })}`}</p>
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
          style={{ width: "auto" }}
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
            <>
              <i class="uil uil-ellipsis-v"></i>
            </>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: checkElement.includes("edit_reward_collaborator_setting") && (
        <p
          className="m-0"
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/reward_collaborator/edit",
              {
                state: { id: itemEdit?._id },
              }
            )
          }
        >
          {`${i18n.t("edit", { lng: lang })}`}
        </p>
      ),
    },
    {
      key: "2",
      label: checkElement.includes("delete_reward_collaborator_setting") && (
        <p className="m-0" onClick={() => setModal(true)}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
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
          {`${i18n.t("add_reward", { lng: lang })}`}
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
          <p>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </p>
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
              ? `${i18n.t("lock_bonus", { lng: lang })}`
              : `${i18n.t("unlock_bonus", { lng: lang })}`
          }
          isOpen={modalActive}
          handleOk={() => onActiveReward(itemEdit?._id, itemEdit?.is_active)}
          handleCancel={() => setModalActive(false)}
          textOk={
            itemEdit?.is_active
              ? `${i18n.t("lock", { lng: lang })}`
              : `${i18n.t("lock_bonus", { lng: lang })}`
          }
          body={
            <p>
              {itemEdit?.is_active
                ? `Bạn có muốn ẩn điều kiển thưởng cho CTV? "${itemEdit?.title?.vi}"`
                : `Bạn có muốn hiện điệu kiển thưởng cho CTV? "${itemEdit?.title?.vi}"`}
            </p>
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
          body={<p>Bạn có muốn xoá điều kiển thưởng "{itemEdit?.title?.vi}"</p>}
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default RewardCollaborator;
