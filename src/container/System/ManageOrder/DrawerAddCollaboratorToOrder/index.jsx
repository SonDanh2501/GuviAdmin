import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import { searchCollaborators } from "../../../../api/collaborator";
import { errorNotify } from "../../../../helper/toast";
import { addCollaboratorToOrderApi } from "../../../../api/order";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import _debounce from "lodash/debounce";
const AddCollaboratorOrder = ({ idOrder }) => {
  const [open, setOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const valueSearch = (value) => {
    setName(value);
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCollaborators(0, 10, "all", value)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
          });
      } else {
        setDataFilter([]);
      }

      setId("");
    }, 500),
    []
  );

  const addCollaboratorToOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    addCollaboratorToOrderApi(idOrder, { id_collaborator: id })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, idOrder]);

  return (
    <>
      <a className="text-add" onClick={showDrawer}>
        Thêm CTV
      </a>
      <Drawer
        title="Thêm Cộng tác viên"
        placement="right"
        onClose={onClose}
        width={500}
        open={open}
      >
        <div>
          <div>
            <a className="label">Cộng tác viên</a>
            <Input
              placeholder="Tìm kiếm theo tên hoặc số điện thoại số điện thoại"
              value={name}
              type="text"
              onChange={(e) => {
                handleSearch(e.target.value);
                valueSearch(e.target.value);
              }}
              className="input"
            />
            {/* {errorName && <a className="error">{errorName}</a>} */}
            {dataFilter.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {dataFilter?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        setId(item?._id);
                        setName(item?.full_name);
                        setDataFilter([]);
                      }}
                    >
                      <a>
                        {" "}
                        {item?.full_name} - {item?.phone} - {item?.id_view}
                      </a>
                    </div>
                  );
                })}
              </List>
            )}
          </div>

          {id && (
            <Button
              className="btn-add-collaborator-order"
              onClick={addCollaboratorToOrder}
            >
              Thêm cộng tác viên
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
};
export default AddCollaboratorOrder;
