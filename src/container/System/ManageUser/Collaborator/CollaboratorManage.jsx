import { LockOutlined } from "@ant-design/icons";
import { Dropdown, Empty, Pagination, Skeleton, Space, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  activeCollaborator,
  deleteCollaborator,
  lockTimeCollaborator,
  searchCollaborators,
  verifyCollaborator,
} from "../../../../api/collaborator.jsx";
import AddCollaborator from "../../../../components/addCollaborator/addCollaborator.js";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.jsx";
import EditCollaborator from "../../../../components/editCollaborator/editCollaborator.js";
import { errorNotify } from "../../../../helper/toast";
import { getCollaborators } from "../../../../redux/actions/collaborator";
import { loadingAction } from "../../../../redux/actions/loading.js";
import {
  getCollaborator,
  getCollaboratorTotal,
} from "../../../../redux/selectors/collaborator";
import "./CollaboratorManage.scss";
import unlock from "../../../../assets/images/unlocked.png";
import lock from "../../../../assets/images/lock.png";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";
import watch from "../../../../assets/images/watch.png";
import stopWatch from "../../../../assets/images/stop-watch.png";

import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function CollaboratorManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalVerify, setModalVerify] = React.useState(false);
  const [modalLockTime, setModalLockTime] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState("");
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const toggleVerify = () => setModalVerify(!modalVerify);
  const toggleLockTime = () => setModalLockTime(!modalLockTime);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collaborator = useSelector(getCollaborator);
  const collaboratorTotal = useSelector(getCollaboratorTotal);

  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(
      getCollaborators.getCollaboratorsRequest({ start: 0, length: 10 })
    );
  }, [dispatch]);

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * collaborator.length - collaborator.length;
    dataFilter.length > 0
      ? searchCollaborators(valueFilter, start, 10)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getCollaborators.getCollaboratorsRequest({
            start: start > 0 ? start : 0,
            length: 10,
          })
        );
  };

  const handleSearch = useCallback((value) => {
    setValueFilter(value);
    searchCollaborators(value, 0, 10)
      .then((res) => {
        setDataFilter(res.data);
        setTotalFilter(res.totalItem);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  }, []);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteCollaborator(id, { is_delete: true })
      .then((res) => window.location.reload())
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err,
        });
      });
  }, []);

  const blockCollaborator = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeCollaborator(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          errorNotify({
            message: err,
          });
        });
    } else {
      activeCollaborator(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          errorNotify({
            message: err,
          });
        });
    }
  }, []);

  const onLockTimeCollaborator = useCallback(
    (id, is_lock_time) => {
      dispatch(loadingAction.loadingRequest(true));
      if (is_lock_time === true) {
        lockTimeCollaborator(id, { is_lock_time: false })
          .then((res) => {
            setModalLockTime(!modalLockTime);
            dispatch(loadingAction.loadingRequest(false));
            window.location.reload();
          })
          .catch((err) => {
            dispatch(loadingAction.loadingRequest(false));
            errorNotify({
              message: err,
            });
          });
      } else {
        lockTimeCollaborator(id, {
          is_lock_time: true,
          lock_time: moment(new Date(timeValue)).toISOString(),
        })
          .then((res) => {
            setModalLockTime(!modalLockTime);
            dispatch(loadingAction.loadingRequest(false));
            window.location.reload();
          })
          .catch((err) => {
            dispatch(loadingAction.loadingRequest(false));
            errorNotify({
              message: err,
            });
          });
      }
    },
    [timeValue, dispatch]
  );
  const onVerifyCollaborator = useCallback((id, is_verify) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_verify === true) {
      verifyCollaborator(id)
        .then((res) => {
          setModalVerify(!modalVerify);
          dispatch(loadingAction.loadingRequest(false));
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          errorNotify({
            message: err,
          });
        });
    } else {
      verifyCollaborator(id)
        .then((res) => {
          setModalVerify(!modalVerify);
          dispatch(loadingAction.loadingRequest(false));
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          errorNotify({
            message: err,
          });
        });
    }
  }, []);

  const items = [
    // {
    //   key: "1",
    //   label: (
    //     <a
    //       onClick={() => {
    //         setModalEdit(!modalEdit);
    //       }}
    //     >
    //       Chỉnh sửa
    //     </a>
    //   ),
    // },
    {
      key: "2",
      label: <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Tên cộng tác viên",
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/system/collaborator-manage/details-collaborator", {
                state: { id: data?._id },
              })
            }
          >
            <img className="img_customer" src={data?.avatar} />
            <a>{data?.full_name}</a>
          </div>
        );
      },
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Tình trạng",
      align: "center",
      render: (data) => {
        return (
          <>
            {data?.is_verify ? (
              <div>
                <i class="uil uil-circle icon-verify"></i>
                <a className="text-verify">Đã xác thực</a>
              </div>
            ) : (
              <div>
                <i class="uil uil-circle icon-nonverify"></i>
                <a className="text-nonverify">Chưa xác thực</a>
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <div>
            {data?.is_active ? (
              <img className="img-unlock" src={unlock} onClick={toggleBlock} />
            ) : (
              <img className="img-unlock" src={lock} onClick={toggleBlock} />
            )}
          </div>
          <div>
            {!data?.is_lock_time ? (
              <img src={watch} className="img-watch" onClick={toggleLockTime} />
            ) : (
              <img
                src={stopWatch}
                className="img-watch"
                onClick={toggleLockTime}
              />
            )}
          </div>
          <div>
            {data?.is_verify ? (
              <img
                src={onToggle}
                className="img-toggle"
                onClick={toggleVerify}
              />
            ) : (
              <img
                src={offToggle}
                className="img-toggle"
                onClick={toggleVerify}
              />
            )}
          </div>
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
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddCollaborator />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader>
          {/* <Table
            className="align-items-center table-flush"
            responsive={true}
            hover={true}
          >
            <thead>
              <tr>
                <th>Tên cộng tác viên</th>
                <th>SĐT</th>
                <th>Tình trạng</th>
              
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageCollaborator data={e} />)
                : collaborator &&
                  collaborator.map((e) => <TableManageCollaborator data={e} />)}
            </tbody>
          </Table> */}
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : collaborator}
            pagination={false}
            rowKey={(record) => record._id}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItemEdit(record);
                },
              };
            }}
            locale={{
              emptyText:
                collaborator.length > 0 ? (
                  <Empty />
                ) : (
                  <Skeleton active={true} />
                ),
            }}
          />
          <div className="div-pagination p-2">
            <a>
              Tổng: {dataFilter.length > 0 ? totalFilter : collaboratorTotal}
            </a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={dataFilter.length > 0 ? totalFilter : collaboratorTotal}
                showSizeChanger={false}
              />
            </div>
          </div>
        </Card>
        <div>
          <Modal isOpen={modalLockTime} toggle={toggleLockTime}>
            <ModalHeader toggle={toggleLockTime}>
              {" "}
              {itemEdit?.is_lock_time === false
                ? "Khóa tài khoản cộng tác viên"
                : "Mở tài khoản cộng tác viên"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_lock_time === false
                ? "Bạn có muốn khóa tài khoản cộng tác viên"
                : "Bạn có muốn kích hoạt tài khoản cộng tác viên"}
              <h3>{itemEdit?.full_name}</h3>
              {itemEdit?.is_lock_time === false && (
                <CustomTextInput
                  label={"*Thời gian khoá (hh:mm)"}
                  type="datetime-local"
                  name="time"
                  className="text-input"
                  onChange={(e) => setTimeValue(e.target.value)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  onLockTimeCollaborator(itemEdit?._id, itemEdit?.is_lock_time)
                }
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleLockTime}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div>
          <Modal isOpen={modalVerify} toggle={toggleVerify}>
            <ModalHeader toggle={toggleVerify}>
              {" "}
              {itemEdit?.is_verify === true
                ? "Bỏ xác thực tài khoản cộng tác viên"
                : "Xác thực tài khoản cộng tác viên"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_verify === true
                ? "Bạn có muốn bỏ xác thực tài khoản cộng tác viên"
                : "Bạn có muốn xác thực tài khoản cộng tác viên"}
              <h3>{itemEdit?.full_name}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  onVerifyCollaborator(itemEdit?._id, itemEdit?.is_verify)
                }
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleVerify}>
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
                ? "Khóa tài khoản cộng tác viên"
                : "Mở tài khoản cộng tác viên"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa tài khoản cộng tác viên"
                : "Bạn có muốn kích hoạt tài khoản cộng tác viên"}
              <h3>{itemEdit?.full_name}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  blockCollaborator(itemEdit?._id, itemEdit?.is_active)
                }
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa cộng tác viên</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa cộng tác viên
                <a className="text-name-modal">{itemEdit?.full_name}</a> này
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
          <EditCollaborator
            state={modalEdit}
            setState={() => setModalEdit(!modalEdit)}
            data={itemEdit}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
