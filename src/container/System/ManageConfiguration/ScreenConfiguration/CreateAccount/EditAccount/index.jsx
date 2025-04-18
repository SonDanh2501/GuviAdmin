import { Button, Drawer, Input, Radio, Select, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccountAdmin,
  editAccountAdmin,
  getDetailsAccount,
  getListAccount,
  getListRoleAdmin,
} from "../../../../../../api/createAccount";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { errorNotify } from "../../../../../../helper/toast";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import InputCustom from "../../../../../../components/textInputCustom";
import {
  getProvince,
  getService,
} from "../../../../../../redux/selectors/service";

const EditAccount = ({ id, setData, setTotal, startPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRole, setIdRole] = useState("");
  const [dataRole, setDataRole] = useState([]);
  const [ratioProvince, setRatioProvince] = useState(1);
  const [city, setCity] = useState();
  const [dataDistrict, setDataDistrict] = useState([]);
  const [idService, setIdService] = useState([]);
  const [district, setDistrict] = useState([]);
  const roleAdmin = [];
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);
  const service = useSelector(getService);

  const cityOption = [];
  const districtOption = [];
  const serviceOption = [
    {
      value: "",
      label: "Tất cả",
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getListRoleAdmin()
      .then((res) => {
        setDataRole(res?.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    getDetailsAccount(id)
      .then((res) => {
        setFullName(res?.full_name);
        setEmail(res?.email);
        setIdRole(res?.id_role_admin?._id);
        setRatioProvince(res?.area_manager_lv_1.length > 0 ? 2 : 1);
        setCity(res?.area_manager_lv_1);
        setDistrict(res?.area_manager_lv_2);
        // setIdService(res?.id_service_manager);
        res?.id_service_manager?.map((item) => {
          idService.push(item?._id);
        });
      })
      .catch((err) => {});
  }, [id]);

  dataRole.map((item) => {
    roleAdmin.push({
      label: item?.name_role,
      value: item?._id,
    });
  });

  city?.map((item) => {
    province?.map((itemProvince) => {
      if (item == itemProvince?.code) {
        itemProvince?.districts?.map((district) => {
          districtOption?.push({
            value: district?.code,
            label: district?.name,
          });
        });
      }
    });
  });

  province?.map((item) => {
    cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    item?.district?.map((i) => {
      districtOption?.push({
        value: i?.code,
        label: i?.name,
      });
    });
  });

  service?.map((item) => {
    serviceOption?.push({
      value: item?._id,
      label: item?.title?.vi,
    });
  });

  const onChangeCity = (value, item) => {
    setCity(value);
    setDataDistrict(item?.district);
  };

  const onEditAccount = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    editAccountAdmin(id, {
      full_name: fullName,
      id_role_admin: idRole,
      is_permission: true,
      area_manager_lv_0: "viet_nam",
      area_manager_lv_1: ratioProvince === 2 ? (!city ? [] : city) : [],
      area_manager_lv_2:
        ratioProvince === 2 ? (district.length > 0 ? district : []) : [],
      id_service_manager: idService.length > 0 ? idService : [],
    })
      .then((res) => {
        setOpen(false);
        dispatch(loadingAction.loadingRequest(false));
        getListAccount(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    fullName,
    email,
    password,
    idRole,
    city,
    district,
    idService,
    startPage,
    ratioProvince,
  ]);

  return (
    <div>
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <InputCustom
          title={`${i18n.t("display_name", { lng: lang })}`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <InputCustom
          title={`${i18n.t("email_login", { lng: lang })}`}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div style={{ display: "flex", flexDirection: "column", marginTop: 5 }}>
          <a>Theo khu vực</a>
          <Radio.Group
            value={ratioProvince}
            onChange={(e) => setRatioProvince(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value={1}>Tất cả</Radio>
              <Radio value={2}>Theo Tỉnh/Thành Phố</Radio>
            </Space>
          </Radio.Group>
          {ratioProvince === 2 && (
            <div className=" div-form-role">
              <InputCustom
                placeholder="Vui lòng chọn tỉnh/thành phố"
                onChange={(e, item) => onChangeCity(e, item)}
                options={cityOption}
                style={{ width: "100%" }}
                select={true}
                showSearch
                value={city}
                mode="multiple"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
              />
              {districtOption.length > 1 && (
                <InputCustom
                  title="Quận/huyện"
                  placeholder="Vui lòng chọn quận/huyện"
                  onChange={(e) => {
                    setDistrict(e);
                  }}
                  options={districtOption}
                  style={{ width: "100%" }}
                  select={true}
                  value={district}
                  mode="multiple"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                />
              )}
            </div>
          )}
        </div>

        <div className=" div-form-role">
          <InputCustom
            title="Loại dịch vụ"
            placeholder="Vui lòng chọn loại dịch vụ"
            onChange={(e) => {
              setIdService(e);
            }}
            options={serviceOption}
            value={idService}
            style={{ width: "100%" }}
            select={true}
            mode="multiple"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
          />
        </div>

        <div className=" div-form-role">
          <InputCustom
            title={`${i18n.t("permissions", { lng: lang })}`}
            onChange={(e) => setIdRole(e)}
            options={roleAdmin}
            style={{ width: "100%" }}
            select={true}
            value={idRole}
          />
        </div>

        <button className="btn-edit-account" onClick={onEditAccount}>
          {`${i18n.t("edit", { lng: lang })}`}
        </button>
      </Drawer>
    </div>
  );
};

export default EditAccount;
