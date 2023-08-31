import { Dropdown, Space, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteReasonPunish,
  getReasonPunishApi,
} from "../../../../../api/reasons";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import i18n from "../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import CreateReasonPubnish from "./component/CreateResonPunish";
import EditReasonPubnish from "./component/EditResonPunish";
import "./styles.scss";
const width = window.innerWidth;

const ReasonPunish = () => {
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  const toggle = () => setModal(!modal);
  useEffect(() => {
    getReasonPunishApi(0, 20)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, []);

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    deleteReasonPunish(id)
      .then((res) => {
        setIsLoading(false);
        setModal(false);
        getReasonPunishApi(0, 20)
          .then((res) => {
            setData(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, []);

  // const activePunish = useCallback((id, is_active) => {
  //   setIsLoading(true);
  //   if (is_active === true) {
  //     activeReasonPunish(id, { is_active: false })
  //       .then((res) => {
  //         setIsLoading(false);
  //         getReasonPunishApi(0, 20)
  //           .then((res) => {
  //             setData(res?.data);
  //           })
  //           .catch((err) => {});
  //       })
  //       .catch((err) => {
  //         setIsLoading(false);
  //         errorNotify({
  //           message: err,
  //         });
  //       });
  //   } else {
  //     activeReasonPunish(id, { is_active: true })
  //       .then((res) => {
  //         setIsLoading(false);
  //         getReasonPunishApi(0, 20)
  //           .then((res) => {
  //             setData(res?.data);
  //           })
  //           .catch((err) => {});
  //       })
  //       .catch((err) => {
  //         setIsLoading(false);
  //         errorNotify({
  //           message: err,
  //         });
  //       });
  //   }
  // }, []);

  const columns = [
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-date-create-punish">
            <p className="text-time">
              {moment(new Date(data?.date_create)).format("DD/MM/yyy")}
            </p>
            <p className="text-time">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("name", { lng: lang })}`,
      render: (data) => <p className="m-0">{data?.title?.[lang]}</p>,
    },
    {
      title: `${i18n.t("describe", { lng: lang })}`,
      render: (data) => <p className="m-0">{data?.description?.[lang]}</p>,
    },
    {
      title: `${i18n.t("apply", { lng: lang })}`,
      render: (data) => (
        <p className="m-0">
          {data?.apply_user === "collaborator"
            ? `${i18n.t("collaborator", { lng: lang })}`
            : ""}
        </p>
      ),
    },
    // {
    //   key: "action",
    //   render: (data) => {
    //     return (
    //       <div>
    //         {data?.is_active ? (
    //           <img src={onToggle} className="img-toggle" />
    //         ) : (
    //           <img
    //             src={offToggle}
    //             className="img-toggle"
    //             onClick={toggleBlock}
    //           />
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      key: "action",
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
              <i class="uil uil-ellipsis-v"></i>
            </>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 1,
      label: checkElement?.includes("edit_reason_punish_setting") && (
        <EditReasonPubnish
          setIsLoading={setIsLoading}
          setData={setData}
          id={itemEdit?._id}
        />
      ),
    },
    {
      key: 2,
      label: checkElement?.includes("delete_reason_punish_setting") && (
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];
  return (
    <>
      <h3>{`${i18n.t("config_punish_reason", { lng: lang })}`}</h3>
      <div>
        {checkElement?.includes("create_reason_punish_setting") && (
          <CreateReasonPubnish setIsLoading={setIsLoading} setData={setData} />
        )}
      </div>
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
          scroll={
            width <= 490
              ? {
                  x: 1000,
                }
              : null
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("remove_punish", { lng: lang })}`}
          handleOk={() => onDelete(itemEdit?._id)}
          handleCancel={toggle}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          body={
            <>
              <p>{`${i18n.t("want_remove_punish", { lng: lang })}`}</p>
              <p className="text-name-modal">{itemEdit?.title?.[lang]}</p>
            </>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ReasonPunish;
