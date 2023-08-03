import { Button, Checkbox, Input, Radio, Select, Space } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  editRoleApi,
  getSettingAccountApi,
} from "../../../../../../api/configuration";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../../helper/toast";
import "./index.scss";
import { getProvince } from "../../../../../../redux/selectors/service";
import { useSelector } from "react-redux";

const EditRole = (props) => {
  const { state } = useLocation();
  const { item } = state || {};
  const [stateRole, setStateRole] = useState({
    address: [],
    isAreaManager: false,
    ratioCheckArea: 1,
  });
  const [data, setData] = useState([]);
  const [keyApi, setKeyApi] = useState([]);
  const [nameRole, setNameRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const naivigate = useNavigate();
  const cityOptions = [];
  const province = useSelector(getProvince);

  province?.map((item) => {
    cityOptions?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  useEffect(() => {
    getSettingAccountApi()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});

    setNameRole(item?.name_role);
    setKeyApi(item?.id_key_api);
    setStateRole({
      ...stateRole,
      ratioCheckArea: item?.is_area_manager ? 2 : 1,
      address: item?.area_manager_level_1,
    });
  }, []);

  const onChangeRole = (check, item, role) => {
    // if (check) {
    //   setKeyApi([...keyApi, item?._id]);
    // } else {
    //   const arr = keyApi.filter((e) => e !== item?._id);
    //   setKeyApi(arr);
    // }
    if (check) {
      for (var i = 0; i < role.permission.length; i++) {
        const newArr = [...keyApi];
        if (role?.permission[i]?.key_api_parent?.includes(item?._id)) {
          keyApi.push(role.permission[i]?._id);
          setKeyApi(newArr);
        } else if (item?.key_api_parent?.includes(role?.permission[i]?._id)) {
          keyApi.push(role.permission[i]?._id);
          setKeyApi(newArr);
        }
      }

      for (var i = 0; i < data?.length; i++) {
        for (var j = 0; j < data[i]?.permission?.length; j++) {
          const newArr = [...keyApi];
          if (item?.key_api_parent?.includes(data[i]?.permission[j]?._id)) {
            keyApi.push(data[i]?.permission[j]?._id);
            setKeyApi(newArr);
          }
        }
      }

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
      is_area_manager: stateRole.ratioCheckArea === 2 ? true : false,
      area_manager_level_1:
        stateRole.ratioCheckArea === 2 ? stateRole.address : [],
    })
      .then((res) => {
        setIsLoading(false);
        naivigate(-1);
        // window.location.reload();
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [nameRole, keyApi, data, stateRole]);

  return (
    <div>
      {/* <a onClick={showDrawer}>Chỉnh sửa</a> */}
      {/* <Drawer
        title="Chỉnh sửa quyền quản trị"
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
      > */}
      <div className="div-input">
        <a className="label">Tên quyền</a>
        <Input
          placeholder="Vui lòng nhập tên quyền"
          style={{ width: "50%" }}
          value={nameRole}
          onChange={(e) => setNameRole(e.target.value)}
        />
      </div>
      <div className="div-input mt-2">
        <Radio.Group
          onChange={(e) =>
            setStateRole({ ...stateRole, ratioCheckArea: e.target.value })
          }
          value={stateRole?.ratioCheckArea}
        >
          <Space direction="vertical">
            <Radio value={1}>Toàn quốc</Radio>
            <Radio value={2}>Theo khu vực</Radio>
          </Space>
        </Radio.Group>

        {stateRole.ratioCheckArea === 2 && (
          <Select
            options={cityOptions}
            style={{ width: "50%", marginTop: 2 }}
            onChange={(e) => {
              setStateRole({ ...stateRole, address: e });
            }}
            mode="multiple"
            value={stateRole?.address}
          />
        )}
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
                      checked={keyApi?.includes(per?._id) ? true : false}
                      onChange={(e) =>
                        onChangeRole(e.target.checked, per, item)
                      }
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
      {/* </Drawer> */}

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default memo(EditRole);
