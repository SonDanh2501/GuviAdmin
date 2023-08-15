import { Button, Drawer, Input, Radio, Select, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccountAdmin,
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

const AddAccount = ({ setData, setTotal }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRole, setIdRole] = useState("");
  const [dataRole, setDataRole] = useState([]);
  const [ratioProvince, setRatioProvince] = useState(1);
  const [city, setCity] = useState([]);
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
  const districtOption = [
    {
      value: "",
      label: "Tất cả",
    },
  ];
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

  dataRole.map((item) => {
    roleAdmin.push({
      label: item?.name_role,
      value: item?._id,
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
    districtOption?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  service?.map((item) => {
    serviceOption?.push({
      value: item?._id,
      label: item?.title?.vi,
    });
  });

  const onCreateAccount = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createAccountAdmin({
      full_name: fullName,
      email: email,
      role: "admin",
      password: password,
      id_role_admin: idRole,
      area_manager_lv_0: "viet_nam",
      area_manager_lv_1:
        ratioProvince === 2 ? (city.length > 0 ? city : []) : [],
      area_manager_lv_2: district.length > 0 ? district : [],
      id_service_manager: idService.length > 0 ? idService : [],
    })
      .then((res) => {
        setOpen(false);
        dispatch(loadingAction.loadingRequest(false));
        getListAccount(0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [fullName, email, password, idRole, idService, city, district]);

  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        {`${i18n.t("add_account", { lng: lang })}`}
      </Button>
      <Drawer
        title={`${i18n.t("add_account", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <InputCustom
          title={`${i18n.t("display_name", { lng: lang })}`}
          onChange={(e) => setFullName(e.target.value)}
        />

        <InputCustom
          title={`${i18n.t("email_login", { lng: lang })}`}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputCustom
          title={`${i18n.t("password", { lng: lang })}`}
          onChange={(e) => setPassword(e.target.value)}
          password={true}
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
                onChange={(e, item) => {
                  setCity(e);
                  setDataDistrict(item?.district);
                }}
                options={cityOption}
                style={{ width: "100%" }}
                select={true}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
              />

              {dataDistrict.length > 0 && (
                <InputCustom
                  title="Quận/huyện"
                  placeholder="Vui lòng chọn quận/huyện"
                  onChange={(e) => {
                    setDistrict(e);
                  }}
                  options={districtOption}
                  style={{ width: "100%" }}
                  select={true}
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
          />
        </div>

        <button className="btn-create-account" onClick={onCreateAccount}>
          {`${i18n.t("add_account", { lng: lang })}`}
        </button>
      </Drawer>
    </div>
  );
};

export default AddAccount;
