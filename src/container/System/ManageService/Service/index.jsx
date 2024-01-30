import { useEffect, useState } from "react";
import {
  activeServiceApi,
  getGroupServiceApi,
  getListService,
} from "../../../../api/service";
import { Button, Switch, Table } from "antd";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getElementState } from "../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Service = () => {
  const [data, setData] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleActive = () => setModalActive(!modalActive);
  const checkElement = useSelector(getElementState);
  const navigate = useNavigate();

  useEffect(() => {
    getListService()
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});

    getGroupServiceApi(0, 20)
      .then((res) => {
        setDataGroup(res?.data);
      })
      .catch((err) => {});
  }, []);

  const handleActive = (_id, active) => {
    setIsLoading(true);
    activeServiceApi(_id, { is_active: active ? false : true })
      .then((res) => {
        setIsLoading(false);
        setModalActive(false);
        getListService()
          .then((res) => {
            setData(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
        });
      });
  };

  const columns = [
    {
      title: "Tên dịch vụ",
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate(
                "/services/manage-group-service/service/optional-service",
                { state: { id: data?._id } }
              )
            }
          >
            <p style={{ margin: 0 }}>{data?.title?.vi}</p>
          </div>
        );
      },
    },
    {
      title: "Thuộc nhóm dịch vụ",
      render: (data) => {
        return (
          <div>
            {dataGroup?.map((item, index) => {
              return (
                <p style={{ margin: 0 }}>
                  {item?._id === data?.id_group_service ? item?.title?.vi : ""}
                </p>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "action",
      render: (data) => {
        return (
          <div>
            {checkElement?.includes("active_service") && (
              <Switch
                style={{ width: "auto" }}
                checkedChildren="Hiện"
                unCheckedChildren="Ẩn"
                checked={data?.is_active}
                onChange={(e) => {
                  toggleActive();
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
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
        />
      </div>

      <div>
        <Modal isOpen={modalActive} toggle={toggleActive}>
          <ModalHeader toggle={toggleActive}>
            {itemEdit?.is_active === true ? "Ẩn dịch vụ" : "Hiện dịch vụ"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn ẩn dịch vụ " + itemEdit?.title?.vi
              : "Bạn có muốn hiện dịch vụ" + itemEdit?.title?.vi}
            <h3>{itemEdit?.full_name}</h3>
          </ModalBody>
          <ModalFooter>
            <Button
              type="primary"
              onClick={() => handleActive(itemEdit?._id, itemEdit?.is_active)}
            >
              Có
            </Button>
            <Button onClick={toggleActive}>Không</Button>
          </ModalFooter>
        </Modal>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default Service;
