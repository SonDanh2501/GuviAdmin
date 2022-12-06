import moment from "moment";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import {
  activeCollaborator,
  deleteCollaborator,
  lockTimeCollaborator,
  verifyCollaborator,
} from "../../../../api/collaborator";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import EditCollaborator from "../../../../components/editCollaborator/editCollaborator";
import { loadingAction } from "../../../../redux/actions/loading";
import "./TableManageCollaborator.scss";

export default function TableManageCollaborator({ data }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalVerify, setModalVerify] = React.useState(false);
  const [modalLockTime, setModalLockTime] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [timeValue, setTimeValue] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const toggleVerify = () => setModalVerify(!modalVerify);
  const toggleLockTime = () => setModalLockTime(!modalLockTime);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteCollaborator(id, { is_delete: true })
      .then((res) => window.location.reload())
      .catch((err) => console.log(err));
  }, []);

  const blockCollaborator = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeCollaborator(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeCollaborator(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const onVerifyCollaborator = useCallback((id, is_verify) => {
    if (is_verify === true) {
      verifyCollaborator(id)
        .then((res) => {
          setModalVerify(!modalVerify);
          dispatch(loadingAction.loadingRequest(false));

          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      verifyCollaborator(id)
        .then((res) => {
          setModalVerify(!modalVerify);
          dispatch(loadingAction.loadingRequest(false));

          window.location.reload();
        })
        .catch((err) => console.log(err));
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
          .catch((err) => console.log(err));
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
          .catch((err) => console.log(err));
      }
    },
    [timeValue, dispatch]
  );

  return (
    <>
      <tr>
        <th
          scope="row"
          onClick={() =>
            navigate("/system/collaborator-manage/details-collaborator", {
              state: { data: data },
            })
          }
        >
          <Media className="align-items-center">
            <img alt="..." src={data?.avatar} className="img_customer" />
            <Media>
              <span className="mb-0 text-sm">{data?.name}</span>
            </Media>
          </Media>
        </th>
        <td>
          <a>{data?.phone}</a>
        </td>
        <td>
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
        </td>

        <td className="text-right">
          <UncontrolledDropdown>
            {!data?.is_lock_time ? (
              <button className="btn-delete" onClick={toggleLockTime}>
                <i className="uil uil-stopwatch icon-time-on"></i>
              </button>
            ) : (
              <button className="btn-delete" onClick={toggleLockTime}>
                <i className="uil uil-stopwatch-slash icon-time-off"></i>
              </button>
            )}
            {data?.is_verify ? (
              <button
                className="btn-delete"
                disabled={true}
                onClick={toggleVerify}
              >
                <i className="uil-toggle-on icon-on-toggle"></i>
              </button>
            ) : (
              <button className="btn-delete" onClick={toggleVerify}>
                <i className="uil-toggle-off icon-off-toggle"></i>
              </button>
            )}
            <DropdownToggle href="#pablo" role="button" size="sm">
              <i class="uil uil-ellipsis-v"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow">
              <DropdownItem
                onClick={() => {
                  setItemEdit(data);
                  setModalEdit(!modalEdit);
                }}
              >
                Chỉnh sửa
              </DropdownItem>
              <DropdownItem onClick={toggle}>Xóa</DropdownItem>
              <DropdownItem onClick={toggleBlock}>
                {data?.is_active ? " Chặn" : " Kích hoạt"}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <div>
            <Modal isOpen={modalVerify} toggle={toggleVerify}>
              <ModalHeader toggle={toggleVerify}>
                {" "}
                {data?.is_verify === true
                  ? "Bỏ xác thực tài khoản cộng tác viên"
                  : "Xác thực tài khoản cộng tác viên"}
              </ModalHeader>
              <ModalBody>
                {data?.is_verify === true
                  ? "Bạn có muốn bỏ xác thực tài khoản cộng tác viên"
                  : "Bạn có muốn xác thực tài khoản cộng tác viên"}
                <h3>{data?.name}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    onVerifyCollaborator(data?._id, data?.is_verify)
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
                {data?.is_active === true
                  ? "Khóa tài khoản cộng tác viên"
                  : "Mở tài khoản cộng tác viên"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa tài khoản cộng tác viên"
                  : "Bạn có muốn kích hoạt tài khoản cộng tác viên"}
                <h3>{data?.name}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => blockCollaborator(data?._id, data?.is_active)}
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
            <Modal isOpen={modalLockTime} toggle={toggleLockTime}>
              <ModalHeader toggle={toggleLockTime}>
                {" "}
                {data?.is_lock_time === false
                  ? "Khóa tài khoản cộng tác viên"
                  : "Mở tài khoản cộng tác viên"}
              </ModalHeader>
              <ModalBody>
                {data?.is_lock_time === false
                  ? "Bạn có muốn khóa tài khoản cộng tác viên"
                  : "Bạn có muốn kích hoạt tài khoản cộng tác viên"}
                <h3>{data?.name}</h3>
                {data?.is_lock_time === false && (
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
                    onLockTimeCollaborator(data?._id, data?.is_lock_time)
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
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Xóa cộng tác viên</ModalHeader>
              <ModalBody>
                <a>
                  Bạn có chắc muốn xóa cộng tác viên
                  <a className="text-name-modal">{data?.name}</a> này không?
                </a>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => onDelete(data?._id)}>
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
        </td>
      </tr>
    </>
  );
}
