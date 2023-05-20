import { Button, Checkbox, Drawer, Input, Modal } from "antd";
import "./index.scss";
import { memo, useCallback, useEffect, useState } from "react";
import {
  createRoleApi,
  editRoleApi,
  getSettingAccountApi,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { getListRoleAdmin } from "../../../../../../api/createAccount";

const EditRole = (props) => {
  const { item, setIsLoading, setDataList, setTotal } = props;
  const [data, setData] = useState([]);
  const [keyApi, setKeyApi] = useState([]);
  const [nameRole, setNameRole] = useState("");

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getSettingAccountApi()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    setNameRole(item?.name_role);
    setKeyApi(item?.id_key_api);
  }, [item]);

  const onChangeRole = (check, item) => {
    if (check) {
      setKeyApi([...keyApi, item?._id]);
    } else {
      const arr = keyApi.filter((e) => e !== item?._id);
      setKeyApi(arr);
    }
  };

  const onEdit = useCallback(() => {
    setIsLoading(true);
    editRoleApi(item?._id, {
      name_role: nameRole,
      id_key_api: keyApi,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getListRoleAdmin()
          .then((res) => {
            setDataList(res.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [nameRole, keyApi, data]);

  return (
    <div>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Chỉnh sửa quyền quản trị"
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
      >
        <div className="div-input">
          <a>Tên quyền</a>
          <Input
            placeholder="Vui lòng nhập tên quyền"
            style={{ width: "50%", marginTop: 2 }}
            value={nameRole}
            onChange={(e) => setNameRole(e.target.value)}
          />
        </div>
        <div className="div-title-role">
          {data?.map((item, index) => {
            return (
              <div key={index} className="div-item-role">
                <a className="title-role">
                  {item?.permission[0]?.name_group_api}
                </a>
                {item?.permission?.map((per, i) => {
                  return (
                    <div className="div-item-per" key={i}>
                      <Checkbox
                        checked={keyApi.includes(per?._id) ? true : false}
                        onChange={(e) => onChangeRole(e.target.checked, per)}
                      />
                      <a className="text-name-per">{per?.name_api}</a>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <Button onClick={onEdit} style={{ marginTop: 50 }}>
          Sửa quyền
        </Button>
      </Drawer>
    </div>
  );
};

export default memo(EditRole);
