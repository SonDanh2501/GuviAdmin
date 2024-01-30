import { List, Select } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { searchCustomersApi } from "../../../../api/customer";
import {
  getExtendOptionalByOptionalServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../api/service";
import LoadingPagination from "../../../../components/paginationLoading";
import InputCustom from "../../../../components/textInputCustom";
import InputCustomize from "../../../../components/inputCustomize";
import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import { getLanguageState, getUser } from "../../../../redux/selectors/auth";
import { getService } from "../../../../redux/selectors/service";
import BussinessType from "../components/BussinessType";
import CleaningAC from "../components/CleaningAC";
import CleaningHourly from "../components/CleaningHourly";
import CleaningSchedule from "../components/CleaningSchedule";
import DeepCleaning from "../components/DeepCleaning";
import {
  getPlaceDetailApi,
  googlePlaceAutocomplete,
} from "../../../../api/location";
import "./index.scss";

// const AddOrder = () => {
//   const [optionalService, setOptionalService] = useState([]);
//   const [idOptional, setIdOptional] = useState("");
//   const [extendService, setExtendService] = useState([]);
//   const [bussinessType, setBussinessType] = useState([]);
//   const [kindService, setKindService] = useState("");
//   const [nameService, setNameService] = useState("");
//   const [addService, setAddService] = useState([]);
//   const [dataFilter, setDataFilter] = useState([]);
//   const [extraService, setExtraService] = useState([]);
//   const [name, setName] = useState("");
//   const [errorNameCustomer, setErrorNameCustomer] = useState("");
//   const [id, setId] = useState("");
//   const service = useSelector(getService);
//   const [serviceApply, setServiceApply] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   // const serviceSelect = [];
//   const optionalSelect = [];
//   const lang = useSelector(getLanguageState);
//   const user = useSelector(getUser);
//   const [serviceSelect, setServiceSelect] = useState([]);
//   const [dataCustomer, setDataCustomer] = useState([]);
//   const [valueCustomer, setValueCustomer] = useState(null);
//   const [address, setAddress] = useState("");
//   const [places, setPlaces] = useState([]);

//   useEffect(() => {
//     console.log(service, 's');
//     console.log(user, 'user');
//     const tempService = [];
//     if (user?.id_service_manager?.length === 0) {
//       for(const item of user.id_service_manager) {
//         tempService.push({
//           label: item?.title?.[lang],
//           value: item?._id,
//           kind: item?.kind
//         })
//       }
//     } else {
//       for(const item of service) {
//         tempService.push({
//           label: item?.title?.[lang],
//           value: item?._id,
//           kind: item?.kind
//         })
//       }
//     }
//     setServiceSelect(tempService)
//     setServiceApply(tempService[0])
//     console.log(serviceSelect, 'serviceSelect');
//     // if(user?.id_service_manager?.length === 0)
//   }, [service])

//     const onChangeServiceApply = (value, item) => {
//       console.log(value, 'value');
//       console.log(item, 'item');
//       setServiceApply(item)
//   };

//   useEffect(() => {
//       getOptionalServiceByServiceApi(service[0]?._id)
//         .then((res) => {
//           setOptionalService(res?.data);
//           setIdOptional(res?.data[0]?._id);
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           setIsLoading(false);
//         });
//   }, [serviceApply])

//   const onChangeOptionalService = (value) => {
//     setIdOptional(value);
//     getExtendOptionalByOptionalServiceApi(value)
//       .then((res) => {
//         setExtendService(res?.data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//       });
//   };

//   const handleSearchCustomer = useCallback(
//     _debounce((value) => {
//       // setName(value);
//       console.log(value, 'valuevalue');
//       if (value) {
//         searchCustomersApi(value)
//           .then((res) => {
//             const temp = [];
//             console.log(res, 'res');
//             for(const item of res.data) {
//               temp.push({
//                 label: `${item.full_name} - ${item.phone} - ${item.id_view}`,
//                 value: item._id
//               })
//             }
//       console.log(temp, 'temp');

//             setDataCustomer(temp);
//           })
//           .catch((err) => {
//             console.log(err,'err');
//             // errorNotify({
//             //     message: err?.message,
//             // });
//           });
//       } else if (id) {
//         // setDataCustomer([]);
//       } else {
//         // setDataCustomer([]);
//       }
//     }, 500),
//     [dataCustomer]
//   );

//   useEffect(() => {
//     searchCustomersApi("")
//     .then((res) => {
//       const temp = [];
//       for(const item of res.data.length) {
//         temp.push({
//           label: `${item.full_name} - ${item.phone} - ${item.id_view}`,
//           value: item._id
//         })
//       }
//       console.log(temp, 'temp');
//       setDataCustomer(temp);
//     })
//     .catch((err) => {
//       errorNotify({
//           message: err?.message,
//       });
//     });
// }, [])

// const onChangeCustomer = (item) => {
//   console.log(item, 'item');
//   setValueCustomer(item);
// }

//   // const searchCustomersApi = () => {

//   // }

//   const handleSearchLocation = useCallback(
//     _debounce((value) => {
//       setAddress(value);
//       setIsLoading(true);
//       googlePlaceAutocomplete(value)
//         .then((res) => {
//           if (res.predictions) {
//             setPlaces(res.predictions);
//           } else {
//             setPlaces([]);
//           }
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           setIsLoading(false);
//           setPlaces([]);
//         });
//     }, 1500),
//     []
//   );

//   return (
//     <React.Fragment>

//       <div className="div-container-content">
//         <div className="div-flex-row">
//         <div className="div-header-container">
//           <h4>{`${i18n.t("create_order", { lng: lang })}`}</h4>
//         </div>
//         </div>
//         <div className="div-flex-row">
//         <div className="info-service div-flex-column">
//           <div className="select-service">
//           <Select
//             className="select-service-order-add"
//             onChange={onChangeServiceApply}
//             options={serviceSelect}
//             value={serviceApply}
//           />
//           </div>
//           <div className="div-search-address">
//           <InputCustom
//             title={`${i18n.t("address", { lng: lang })}`}
//             placeholder={`${i18n.t("enter_address", { lng: lang })}`}
//             className="input-search-address"
//             value={address}
//             type="text"
//             onChange={(e) => {
//               setAddress(e.target.value);
//               handleSearchLocation(e.target.value);
//             }}
//           />
//         </div>

//       <div className="mt-3 service">
//         {serviceApply?.kind === "giup_viec_theo_gio" ? (
//           <CleaningHourly
//             extendService={extendService}
//             addService={addService}
//             id={id}
//             name={name}
//             setErrorNameCustomer={setErrorNameCustomer}
//             idService={serviceApply}
//             nameService={nameService}
//           />
//         ) : serviceApply?.kind === "giup_viec_co_dinh" ? (
//           <CleaningSchedule
//             extendService={extendService}
//             id={id}
//             name={name}
//             setErrorNameCustomer={setErrorNameCustomer}
//             idService={serviceApply}
//             nameService={nameService}
//           />
//         ) : serviceApply?.kind === "phuc_vu_nha_hang" ? (
//           <></>
//           // <BussinessType
//           //   extendService={extendService}
//           //   extraService={extraService}
//           //   bussinessType={bussinessType}
//           //   id={id}
//           //   name={name}
//           //   setErrorNameCustomer={setErrorNameCustomer}
//           //   idService={serviceApply}
//           //   nameService={nameService}
//           // />
//         ) : serviceApply?.kind === "tong_ve_sinh" ? (
//           <></>
//           // <DeepCleaning
//           //   id={id}
//           //   idService={serviceApply}
//           //   extendService={extendService}
//           //   setErrorNameCustomer={setErrorNameCustomer}
//           // />
//         ) : serviceApply?.kind === "ve_sinh_may_lanh" ? (
//           <></>
//           // <CleaningAC
//           //   id={id}
//           //   idService={serviceApply}
//           //   extendService={extendService}
//           //   optionalService={optionalService}
//           //   setErrorNameCustomer={setErrorNameCustomer}
//           // />
//         ) : (
//           <></>
//         )}
//         </div>

//         </div>

//         <div className="info-customer div-flex-column">
//           <div className="input-customer">
//           <p className="title-input-custom">{i18n.t("customer", { lng: lang })}</p>
//         <Select
//         className="input-select"
//         options={dataCustomer}
//         value={valueCustomer}
//         onChange={onChangeCustomer}
//         onSearch={handleSearchCustomer}
//         disabled={false}
//         notFoundContent={null}
//         defaultActiveFirstOption={false}
//         suffixIcon={null}
//         showSearch
//         filterOption={false}
//         />
//           </div>

//         </div>

//         </div>

//         <div className="div-flex-row">

//         </div>

//       </div>

//     </React.Fragment>
//   )
// }

// export default AddOrder;

const AddOrder = () => {
  const [optionalService, setOptionalService] = useState([]);
  const [idOptional, setIdOptional] = useState("");
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
  const optionalSelect = [];
  const lang = useSelector(getLanguageState);
  const user = useSelector(getUser);

  useEffect(() => {
    setIsLoading(true);
    if (user?.id_service_manager?.length === 0) {
      getOptionalServiceByServiceApi(service[0]?._id)
        .then((res) => {
          setOptionalService(res?.data);
          setIdOptional(res?.data[0]?._id);
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
          setIdOptional(res?.data[0]?._id);
        })
        .catch((err) => {
          setIsLoading(false);
        });
      service?.forEach((item) => {
        user?.id_service_manager?.forEach((i, index) => {
          if (item?._id === i?._id) {
            if (index === 0) {
              setKindService(item?.kind);
            }
          }
        });
        return;
      });
      setServiceApply(user?.id_service_manager[0]?._id);
      // setKindService(user?.id_service_manager[0]?.kind);
      setNameService(user?.id_service_manager[0]?.title?.[lang]);
    }
  }, [user]);

  service?.forEach((item) => {
    if (user?.id_service_manager?.length === 0) {
      serviceSelect.push({
        label: item?.title?.[lang],
        value: item?._id,
        kind: item?.kind,
      });
      return;
    } else {
      user?.id_service_manager?.forEach((i) => {
        if (item?._id === i?._id) {
          serviceSelect.push({
            label: item?.title?.[lang],
            value: item?._id,
            kind: item?.kind,
          });
        }
        return;
      });
    }
  });

  optionalService?.map((item) => {
    return optionalSelect.push({
      value: item?._id,
      label: item?.title[lang],
    });
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
        : item?.type === "multi_select_count_ac"
        ? getExtendOptionalByOptionalServiceApi(item?._id)
            .then((res) => {
              setExtendService(res?.data);
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
        setIdOptional(res?.data[0]?._id);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onChangeOptionalService = (value) => {
    setIdOptional(value);
    getExtendOptionalByOptionalServiceApi(value)
      .then((res) => {
        setExtendService(res?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
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
              message: err?.message,
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

  useEffect(() => {});

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
            setName(e.target.value);
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
                  <p className="m-0">
                    {item?.full_name} - {item?.phone} - {item?.id_view}
                  </p>
                </div>
              );
            })}
          </List>
        )}
      </div>

      {kindService === "ve_sinh_may_lanh" && (
        <InputCustom
          title="Loại máy lạnh"
          select={true}
          options={optionalSelect}
          style={{ width: "50%" }}
          value={idOptional}
          onChange={onChangeOptionalService}
        />
      )}

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
        ) : kindService === "ve_sinh_may_lanh" ? (
          <CleaningAC
            id={id}
            idService={serviceApply}
            extendService={extendService}
            optionalService={optionalService}
            setErrorNameCustomer={setErrorNameCustomer}
          />
        ) : (
          <></>
        )}
      </div>

      {/* <div className="div-flex-column content-left">

</div> */}

      {/* <div className="div-flex-column content-right">
dsgfsaifsdiofsoi
</div> */}

      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default AddOrder;
