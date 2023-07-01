import { Dropdown, Pagination, Space, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
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
import { loadingAction } from "../../../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import { getReasonTotal } from "../../../../../redux/selectors/reason";
import i18n from "../../../../../i18n";
const width = window.innerWidth;

const ReasonManage = () => {
  const dispatch = useDispatch();
  const totalReason = useSelector(getReasonTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

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
            message: err,
          });
        });
    },
    [startPage]
  );

  const blockReason = useCallback(
    (id, is_active) => {
      dispatch(loadingAction.loadingRequest(true));
      if (is_active === true) {
        activeReason(id, { is_active: false })
          .then((res) => {
            setModalBlock(false);
            fetchReasons(startPage, 20)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => console.log(err));
      } else {
        activeReason(id, { is_active: true })
          .then((res) => {
            setModalBlock(false);
            fetchReasons(startPage, 20)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
          })
          .catch((err) => console.log(err));
      }
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
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("reason", { lng: lang })}`,
      render: (data) => <a>{data?.title?.[lang]}</a>,
      width: "20%",
    },
    {
      title: `${i18n.t("describe", { lng: lang })}`,
      render: (data) => <a>{data?.description?.[lang]}</a>,
      width: "20%",
    },
    {
      title: `${i18n.t("applicable_object", { lng: lang })}`,
      render: (data) => (
        <a>
          {data?.apply_user === "admin"
            ? "Admin"
            : data?.apply_user === "customer"
            ? `${i18n.t("customer", { lng: lang })}`
            : data?.apply_user === "collaborator"
            ? `${i18n.t("collaborator", { lng: lang })}`
            : `${i18n.t("system", { lng: lang })}`}
        </a>
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
            <a>
              <i class="uil uil-ellipsis-v"></i>
            </a>
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
            scroll={
              width <= 490
                ? {
                    x: 1000,
                  }
                : null
            }
          />
        </div>
        <div className="mt-2 div-pagination p-2">
          <a>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </a>
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
              <a>
                Bạn có chắc muốn xóa lí do{" "}
                <a className="text-name-modal"> {itemEdit?.title?.vi} </a>này
                không?
              </a>
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
