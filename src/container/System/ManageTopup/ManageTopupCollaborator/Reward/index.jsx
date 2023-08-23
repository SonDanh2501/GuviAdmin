import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Pagination, Space, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  cancelRewardApi,
  deleteRewardApi,
  getListInfoRewardApi,
  noteRewardApi,
  verifyRewardApi,
} from "../../../../../api/topup";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import InputCustom from "../../../../../components/textInputCustom";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import "./styles.scss";
const RewardCollaborator = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modal, setModal] = useState(false);
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getListInfoRewardApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onVerifyReward = (id) => {
    setIsLoading(true);
    verifyRewardApi(id)
      .then((res) => {
        if (note !== "") {
          setIsLoading(false);
          setModalVerify(false);
          noteRewardApi(id, { note_admin: note })
            .then((res) => {
              getListInfoRewardApi(startPage, 20)
                .then((res) => {
                  setNote("");
                  setData(res?.data);
                  setTotal(res?.totalItem);
                })
                .catch((err) => {});
            })
            .catch((err) => {});
        } else {
          setIsLoading(false);
          setModalVerify(false);
          getListInfoRewardApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };

  const onCancelReward = (id) => {
    setIsLoading(true);
    cancelRewardApi(id, { note_admin: note })
      .then((res) => {
        setIsLoading(false);
        setModalCancel(false);
        getListInfoRewardApi(startPage, 20)
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

  const onDeleteReward = (id) => {
    setIsLoading(true);
    deleteRewardApi(id)
      .then((res) => {
        setIsLoading(false);
        setModal(false);
        getListInfoRewardApi(startPage, 20)
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
    getListInfoRewardApi(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };
  const columns = [
    {
      title: () => (
        <p className="title-column">
          {`${i18n.t("date_create", { lng: lang })}`}
        </p>
      ),
      render: (data) => {
        return (
          <div className="div-create-info-reward">
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
      title: () => (
        <p className="title-column">
          {`${i18n.t("collaborator", { lng: lang })}`}
        </p>
      ),
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-name-ctv-reward"
          >
            <p className="text-name">{data?.id_collaborator?.full_name}</p>
            <p className="text-name">{data?.id_collaborator?.phone}</p>
          </Link>
        );
      },
    },
    {
      title: () => (
        <p className="title-column">
          {`${i18n.t("total_order", { lng: lang })}`}
        </p>
      ),
      render: (data) => <p className="text-total">{data?.total_order}</p>,
      align: "center",
    },
    {
      title: () => (
        <p className="title-column">
          {`${i18n.t("total_hour", { lng: lang })}`}
        </p>
      ),
      render: (data) => <p className="text-total">{data?.total_job_hour}</p>,
      align: "center",
    },
    {
      title: () => (
        <p className="title-column">{`${i18n.t("money", { lng: lang })}`}</p>
      ),
      render: (data) => (
        <p className="text-total">{formatMoney(data?.money)}</p>
      ),
      align: "right",
    },
    {
      title: () => (
        <p className="title-column">{`${i18n.t("status", { lng: lang })}`}</p>
      ),
      render: (data) => (
        <p
          className={
            data?.status === "pending"
              ? "text-pending-reward-info"
              : data?.status === "done"
              ? "text-done-reward-info"
              : "text-cancel-reward-info"
          }
        >
          {data?.status === "pending"
            ? `${i18n.t("waiting", { lng: lang })}`
            : data?.status === "done"
            ? `${i18n.t("complete", { lng: lang })}`
            : `${i18n.t("cancel", { lng: lang })}`}
        </p>
      ),
      align: "center",
    },
    {
      title: () => (
        <p className="title-column">
          {`${i18n.t("approved_by", { lng: lang })}`}
        </p>
      ),
      render: (date) => (
        <p style={{ margin: 0 }}>{data?.id_admin_verify?.full_name}</p>
      ),
    },
    {
      title: () => (
        <p className="title-column">{`${i18n.t("note", { lng: lang })}`}</p>
      ),
      render: (data) => <p className="text-note">{data?.note_admin}</p>,
    },
    {
      key: "action",
      render: (data) => {
        return (
          <div className="div-action">
            {checkElement?.includes("verify_reward_cash_book_collaborator") && (
              <div
                onClick={() => setModalVerify(true)}
                className={
                  data?.is_verify || data?.status === "cancel"
                    ? "btn-verify-reward-hide"
                    : "btn-verify-reward"
                }
              >
                <p className="text-btn">{`${i18n.t("approvals", {
                  lng: lang,
                })}`}</p>
              </div>
            )}

            <div className="div-cancel-delete">
              {checkElement?.includes(
                "cancel_reward_cash_book_collaborator"
              ) && (
                <>
                  {data?.status === "pending" && (
                    <p
                      onClick={() => setModalCancel(true)}
                      className="text-cancel-reward"
                    >
                      {`${i18n.t("cancel_modal", { lng: lang })}`}
                    </p>
                  )}
                </>
              )}

              {checkElement?.includes(
                "delete_reward_cash_book_collaborator"
              ) && (
                <div onClick={() => setModal(true)}>
                  <i class="uil uil-trash-alt"></i>
                </div>
              )}
            </div>
          </div>
        );
      },
      align: "right",
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
            placement="bottomRight"
            trigger={["click"]}
          >
            <MoreOutlined className="icon-more" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <Link
          to={`/topup/manage-topup/details-reward-collaborator/${itemEdit?._id}`}
        >
          <p style={{ margin: 0 }}>{`${i18n.t("see_more", { lng: lang })}`}</p>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div>
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
          scroll={{ x: width < 900 ? 1200 : 0 }}
        />

        <div className="div-pagination p-2">
          <p>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </p>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              showSizeChanger={false}
              total={total}
              pageSize={20}
            />
          </div>
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalVerify}
          title={`${i18n.t("approve_money_collaborators", { lng: lang })}`}
          handleOk={() => onVerifyReward(itemEdit?._id)}
          handleCancel={() => setModalVerify(false)}
          textOk={`${i18n.t("approvals", { lng: lang })}`}
          body={
            <div>
              <p style={{ margin: 0 }}>
                {`${i18n.t("want_approve_money_collaborators", { lng: lang })}`}{" "}
                {itemEdit?.id_collaborator?.full_name}
              </p>
              <InputCustom
                title={`${i18n.t("note", { lng: lang })}`}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          }
        />
        <ModalCustom
          isOpen={modalCancel}
          title={`${i18n.t("canceling_bonus_order", { lng: lang })}`}
          handleOk={() => onCancelReward(itemEdit?._id)}
          handleCancel={() => setModalCancel(false)}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          body={
            <div>
              <p style={{ margin: 0 }}>
                {`${i18n.t("want_canceling_bonus_order", { lng: lang })}`}{" "}
                {itemEdit?.id_collaborator?.full_name}
              </p>
              <InputCustom
                title={`${i18n.t("note", { lng: lang })}`}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          }
        />

        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("remove_bonus_order", { lng: lang })}`}
          handleOk={() => onDeleteReward(itemEdit?._id)}
          handleCancel={() => setModal(false)}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          body={
            <div>
              <p style={{ margin: 0 }}>
                {`${i18n.t("want_remove_bonus_order", { lng: lang })}`}{" "}
                {itemEdit?.id_collaborator?.full_name}
              </p>
            </div>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default RewardCollaborator;
