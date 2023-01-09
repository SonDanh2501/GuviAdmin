import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";
import { searchCollaborators } from "../../../../api/collaborator";
import { errorNotify } from "../../../../helper/toast";
import { addCollaboratorToOrderApi } from "../../../../api/order";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
const EditOrder = ({ idOrder }) => {
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

  const handleSearch = useCallback((value) => {
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
  }, []);

  const addCollaboratorToOrder = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    addCollaboratorToOrderApi(id, { idOrder: idOrder })
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
        Chỉnh sửa
      </a>
      <Drawer
        title="Chỉnh sửa"
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
              onChange={(e) => handleSearch(e.target.value)}
              className="input"
            />
            {/* {errorName && <a className="error">{errorName}</a>} */}
            {dataFilter.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {dataFilter?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item?._id}
                      onClick={(e) => {
                        setId(e.target.value);
                        setName(item?.full_name);
                        setDataFilter([]);
                      }}
                    >
                      {item?.full_name}
                    </option>
                  );
                })}
              </List>
            )}
          </div>

          <Button className="btn-add" onClick={addCollaboratorToOrder}>
            Chỉnh sửa
          </Button>
        </div>
      </Drawer>
    </>
  );
};
export default EditOrder;
