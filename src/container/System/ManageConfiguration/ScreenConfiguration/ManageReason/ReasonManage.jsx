import { Dropdown, Pagination, Space, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./ReasonManage.scss";

import {
  activeReason,
  deleteReason,
  fetchReasons,
} from "../../../../../api/reasons";
import AddReason from "../../../../../components/addReason/addReason";
import EditReason from "../../../../../components/editReason/editReason";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import i18n from "../../../../../i18n";
import { loadingAction } from "../../../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";

const ReasonManage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchReasons(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteReason(id, { is_delete: true })
        .then((res) => {
          setIsLoading(false);
          setModal(false);
          fetchReasons(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);

          errorNotify({
            message: err?.message,
          });
        });
    },
    [startPage]
  );

  const blockReason = useCallback(
    (id, is_active) => {
      dispatch(loadingAction.loadingRequest(true));

      activeReason(id, { is_active: is_active ? false : true })
        .then((res) => {
          setModalBlock(false);
          dispatch(loadingAction.loadingRequest(false));
          fetchReasons(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          errorNotify({
            message: err?.message,
          });
        });
    },
    [startPage]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    setStartPage(start);
    fetchReasons(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const items = [
    {
      key: "1",
      label: checkElement?.includes("edit_reason_cancel_setting") && (
        <EditReason
          data={itemEdit}
          setIsLoading={setIsLoading}
          setData={setData}
          setTotal={setTotal}
          startPage={startPage}
        />
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_reason_cancel_setting") && (
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("reason", { lng: lang })}`,
      render: (data) => <p className="m-0">{data?.title?.[lang]}</p>,
      width: "20%",
    },
    {
      title: `${i18n.t("describe", { lng: lang })}`,
      render: (data) => <p className="m-0">{data?.description?.[lang]}</p>,
      width: "20%",
    },
    {
      title: `${i18n.t("applicable_object", { lng: lang })}`,
      render: (data) => (
        <p className="m-0">
          {data?.apply_user === "admin"
            ? "Admin"
            : data?.apply_user === "customer"
            ? `${i18n.t("customer", { lng: lang })}`
            : data?.apply_user === "collaborator"
            ? `${i18n.t("collaborator", { lng: lang })}`
            : `${i18n.t("system", { lng: lang })}`}
        </p>
      ),
      width: "20%",
    },
    {
      title: `${i18n.t("note", { lng: lang })}`,
      dataIndex: "note",
      width: "30%",
    },
    // {
    //   key: "action",
    //   render: (data) => {
    //     return (
    //       <div>
    //         {data?.is_active ? (
    //           <img
    //             className="img-unlock-reason"
    //             src={onToggle}
    //             onClick={toggleBlock}
    //           />
    //         ) : (
    //           <img
    //             className="img-unlock-reason"
    //             src={offToggle}
    //             onClick={toggleBlock}
    //           />
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "",
      key: "action",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
          >
            <>
              <i className="uil uil-ellipsis-v"></i>
            </>
          </Dropdown>
        </Space>
      ),
      width: "5%",
    },
  ];

  return (
    <React.Fragment>
      <h5>{`${i18n.t("config_cancel_reason", { lng: lang })}`}</h5>
      <div className="p-3">
        {checkElement?.includes("create_reason_cancel_setting") && (
          <AddReason
            setIsLoading={setIsLoading}
            setData={setData}
            setTotal={setTotal}
            startPage={startPage}
          />
        )}

        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItemEdit(record);
                },
              };
            }}
            scroll={{
              x: width <= 490 ? 1000 : 0,
            }}
          />
        </div>
        <div className="mt-2 div-pagination p-2">
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

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa lí do huỷ việc</ModalHeader>
            <ModalBody>
              <p className="m-0">Bạn có chắc muốn xóa lí do này không?</p>
              <p className="text-name-modal"> {itemEdit?.title?.vi} </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => onDelete(itemEdit?._id)}>
                Có
              </Button>
              <Button color="#ddd" onClick={toggle}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div>
          <Modal isOpen={modalBlock} toggle={toggleBlock}>
            <ModalHeader toggle={toggleBlock}>
              {" "}
              {itemEdit?.is_active === true
                ? "Khóa lí do huỷ việc"
                : "Mở lí do huỷ việc"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa lí do huỷ việc này"
                : "Bạn có muốn kích hoạt lí do huỷ việc này"}
              <h3>{itemEdit?.title?.vi}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => blockReason(itemEdit?._id, itemEdit?.is_active)}
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
};

export default ReasonManage;
