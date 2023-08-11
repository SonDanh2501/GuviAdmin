import { Input, List, Select } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomersApi } from "../../../../api/customer";
import {
  getExtendOptionalByOptionalServiceApi,
  getGroupServiceApi,
  getOptionalServiceByServiceApi,
  getServiceApi,
} from "../../../../api/service";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getService } from "../../../../redux/selectors/service";
import BussinessType from "../components/BussinessType";
import CleaningHourly from "../components/CleaningHourly";
import CleaningSchedule from "../components/CleaningSchedule";
import "./index.scss";
import { getLanguageState, getUser } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
import InputCustom from "../../../../components/textInputCustom";
import DeepCleaning from "../components/DeepCleaning";

const AddOrder = () => {
  const [optionalService, setOptionalService] = useState([]);
  const [extendService, setExtendService] = useState([]);
  const [bussinessType, setBussinessType] = useState([]);
  const [kindService, setKindService] = useState("");
  const [nameService, setNameService] = useState("");
  const [addService, setAddService] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [extraService, setExtraService] = useState([]);
  const [name, setName] = useState("");
  const [errorNameCustomer, setErrorNameCustomer] = useState("");
  const [id, setId] = useState("");
  const service = useSelector(getService);
  const [serviceApply, setServiceApply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const serviceSelect = [];
  const [dataGroupService, setDataGroupService] = useState([]);
  const [dataService, setDataService] = useState([]);
  const lang = useSelector(getLanguageState);
  const user = useSelector(getUser);

  useEffect(() => {
    // getGroupServiceApi(0, 20)
    //   .then((res) => {
    //     setDataGroupService(res?.data);
    //     setKindService(res?.data[0]?.kind);
    //     getServiceApi(res?.data[0]?._id)
    //       .then((res) => {
    //         setServiceApply(res?.data[0]?._id);
    //         setDataService(res?.data);

    //       })
    //       .catch((err) => {});
    //   })
    //   .catch((err) => {});
    setIsLoading(true);
    if (user?.id_service_manager?.length === 0) {
      getOptionalServiceByServiceApi(service[0]?._id)
        .then((res) => {
          setOptionalService(res?.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
      setKindService(service[0]?.kind);
      setServiceApply(service[0]?._id);
      setNameService(service[0]?.title?.[lang]);
    } else {
      getOptionalServiceByServiceApi(user?.id_service_manager[0]?._id)
        .then((res) => {
          setOptionalService(res?.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
      service?.map((item) => {
        user?.id_service_manager?.map((i, index) => {
          if (item?._id === i?._id) {
            if (index === 0) {
              setKindService(item?.kind);
            }
          }
        });
      });
      setServiceApply(user?.id_service_manager[0]?._id);
      // setKindService(user?.id_service_manager[0]?.kind);
      setNameService(user?.id_service_manager[0]?.title?.[lang]);
    }
  }, [user]);

  service?.map((item) => {
    if (user?.id_service_manager?.length === 0) {
      serviceSelect.push({
        label: item?.title?.[lang],
        value: item?._id,
        kind: item?.kind,
      });
    } else {
      user?.id_service_manager?.map((i) => {
        if (item?._id === i?._id) {
          serviceSelect.push({
            label: item?.title?.[lang],
            value: item?._id,
            kind: item?.kind,
          });
        }
      });
    }
  });

  useEffect(() => {
    setIsLoading(true);
    optionalService?.map((item) =>
      item?.type === "select_horizontal_no_thumbnail"
        ? getExtendOptionalByOptionalServiceApi(item?._id)
            .then((res) => {
              setExtendService(res?.data);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            })
        : item?.type === "multi_select_horizontal_thumbnail"
        ? getExtendOptionalByOptionalServiceApi(item?._id)
            .then((res) => {
              setAddService(res?.data);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            })
        : item?.type === "single_select_horizontal_thumbnail"
        ? getExtendOptionalByOptionalServiceApi(item?._id)
            .then((res) => {
              setBussinessType(res?.data);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            })
        : item?.type === "option_toggle_switch"
        ? getExtendOptionalByOptionalServiceApi(item?._id)
            .then((res) => {
              setExtraService(res?.data);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            })
        : null
    );
  }, [optionalService]);

  const onChangeServiceApply = (value, kind) => {
    setIsLoading(true);
    setAddService([]);
    setKindService(kind?.kind);
    setNameService(kind?.label);
    setServiceApply(value);
    getOptionalServiceByServiceApi(value)
      .then((res) => {
        setIsLoading(false);
        setOptionalService(res?.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // getServiceApi(value)
    //   .then((res) => {
    //     setDataService(res?.data);
    //     setServiceApply(res?.data[0]?._id);
    //     getOptionalServiceByServiceApi(res?.data[0]?._id)
    //       .then((res) => {
    //         setIsLoading(false);
    //         setOptionalService(res?.data);
    //       })
    //       .catch((err) => {
    //         setIsLoading(false);
    //       });
    //   })
    //   .catch((err) => {});
  };

  const valueSearch = (value) => {
    setName(value);
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomersApi(value)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
          });
      } else if (id) {
        setDataFilter([]);
      } else {
        setDataFilter([]);
      }
      setId("");
    }, 500),
    []
  );

  return (
    <div className="div-container-add-order">
      <h5>{`${i18n.t("create_order", { lng: lang })}`}</h5>
      <div className="mt-3">
        <Select
          className="select-service-order-add"
          onChange={onChangeServiceApply}
          options={serviceSelect}
          value={serviceApply}
        />
      </div>
      <div className="div-search-customer mt-4">
        <InputCustom
          title={`${i18n.t("customer", { lng: lang })}`}
          value={name}
          className="input-search-customer"
          type="text"
          onChange={(e) => {
            valueSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder={`${i18n.t("search", { lng: lang })}`}
          error={errorNameCustomer}
        />
        {dataFilter.length > 0 && (
          <List type={"unstyled"} className="list-item-customer-add-order">
            {dataFilter?.map((item, index) => {
              return (
                <div
                  key={index}
                  value={item?._id}
                  onClick={(e) => {
                    setId(item?._id);
                    setName(item?.full_name);
                    setDataFilter([]);
                    setErrorNameCustomer("");
                  }}
                >
                  <a>
                    {item?.full_name} - {item?.phone} - {item?.id_view}
                  </a>
                </div>
              );
            })}
          </List>
        )}
      </div>

      <div className="mt-3">
        {kindService === "giup_viec_theo_gio" ? (
          <CleaningHourly
            extendService={extendService}
            addService={addService}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
            idService={serviceApply}
            nameService={nameService}
          />
        ) : kindService === "giup_viec_co_dinh" ? (
          <CleaningSchedule
            extendService={extendService}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
            idService={serviceApply}
            nameService={nameService}
          />
        ) : kindService === "phuc_vu_nha_hang" ? (
          <BussinessType
            extendService={extendService}
            extraService={extraService}
            bussinessType={bussinessType}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
            idService={serviceApply}
            nameService={nameService}
          />
        ) : kindService === "tong_ve_sinh" ? (
          <DeepCleaning
            id={id}
            idService={serviceApply}
            extendService={extendService}
            setErrorNameCustomer={setErrorNameCustomer}
          />
        ) : (
          <></>
        )}
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default AddOrder;
