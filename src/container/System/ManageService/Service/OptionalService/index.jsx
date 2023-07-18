import { Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  activeOptionServiceApi,
  deleteOptionServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../../api/service";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import "./styles.scss";

const OptionalService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  useEffect(() => {
    getOptionalServiceByServiceApi(id)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, [id]);

  const onDelete = useCallback(
    (idOption) => {
      setIsLoading(true);
      deleteOptionServiceApi(idOption)
        .then((res) => {
          setModal(false);
          getOptionalServiceByServiceApi(id)
            .then((res) => {
              setData(res?.data);
              setIsLoading(false);
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
    [id]
  );

  const onActive = useCallback(
    (idActive, active) => {
      setIsLoading(true);
      if (active === true) {
        activeOptionServiceApi(idActive, {
          is_active: false,
        })
          .then((res) => {
            setIsLoading(false);
            setModalBlock(false);
            getOptionalServiceByServiceApi(id)
              .then((res) => {
                setData(res?.data);
              })
              .catch((err) => {});
          })
          .then((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      } else {
        activeOptionServiceApi(idActive, {
          is_active: true,
        })
          .then((res) => {
            setIsLoading(false);
            setModalBlock(false);
            getOptionalServiceByServiceApi(id)
              .then((res) => {
                setData(res?.data);
              })
              .catch((err) => {});
          })
          .then((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [id]
  );

  const columns = [
    {
      title: "Tiêu đề",
      render: (data) => (
        <a
          onClick={() =>
            navigate(
              `/services/manage-group-service/service/optional-service/extend-optional`,
              { state: { id: data?._id } }
            )
          }
        >
          {data?.title?.vi}
        </a>
      ),
      width: "40%",
    },
    {
      title: "Mô tả",
      render: (data) => <a>{data?.description?.vi}</a>,
    },
  ];

  return (
    <div>
      <h3>Optional Service</h3>

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
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default OptionalService;
