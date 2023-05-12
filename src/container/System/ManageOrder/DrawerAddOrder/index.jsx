import { Input, List, Select } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomers } from "../../../../api/customer";
import {
  getExtendOptionalByOptionalServiceApi,
  getGroupServiceApi,
  getOptionalServiceByServiceApi,
  getServiceApi,
} from "../../../../api/service";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getService } from "../../../../redux/selectors/service";
import CleaningHourly from "../components/CleaningHourly";
import CleaningSchedule from "../components/CleaningSchedule";
import "./index.scss";
import BussinessType from "../components/BussinessType";

const AddOrder = () => {
  const [optionalService, setOptionalService] = useState([]);
  const [extendService, setExtendService] = useState([]);
  const [bussinessType, setBussinessType] = useState([]);
  const [kindService, setKindService] = useState("");
  const [nameService, setNameService] = useState("");
  const [addService, setAddService] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [errorNameCustomer, setErrorNameCustomer] = useState("");
  const [id, setId] = useState("");
  const service = useSelector(getService);
  const [serviceApply, setServiceApply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const serviceSelect = [];
  const [dataGroupService, setDataGroupService] = useState([]);
  const [dataService, setDataService] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getGroupServiceApi(0, 20)
      .then((res) => {
        setDataGroupService(res?.data);
        setServiceApply(res?.data[0]?._id);
        setKindService(res?.data[0]?.kind);
        setNameService(res?.data[0]?.title?.vi);
        getServiceApi(res?.data[0]?._id)
          .then((res) => {
            setDataService(res?.data);
            getOptionalServiceByServiceApi(res?.data[0]?._id)
              .then((res) => {
                setOptionalService(res?.data);
                setIsLoading(false);
              })
              .catch((err) => {
                setIsLoading(false);
              });
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  }, []);

  dataGroupService?.map((item) => {
    serviceSelect.push({
      label: item?.title?.vi,
      value: item?._id,
      kind: item?.kind,
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
        : null
    );
  }, [optionalService]);

  const onChangeServiceApply = (value, kind) => {
    setIsLoading(true);
    setAddService([]);
    setKindService(kind?.kind);
    setNameService(kind?.label);
    getServiceApi(value)
      .then((res) => {
        setDataService(res?.data);
        setServiceApply(res?.data[0]?._id);
        getOptionalServiceByServiceApi(res?.data[0]?._id)
          .then((res) => {
            setIsLoading(false);
            setOptionalService(res?.data);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {});
  };

  const valueSearch = (value) => {
    setName(value);
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomers(0, 10, "", value)
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
    <>
      <h5>Tạo công việc</h5>
      <div className="mt-3">
        <Select
          style={{ width: 230 }}
          value={nameService}
          onChange={onChangeServiceApply}
          options={serviceSelect}
        />
      </div>
      <div className="div-search-customer mt-4">
        <a className="label-customer">
          Khách hàng <a style={{ color: "red" }}>(*)</a>
        </a>
        <Input
          placeholder="Tìm kiếm theo tên hoặc số điện thoại số điện thoại"
          value={name}
          type="text"
          onChange={(e) => {
            valueSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          className="input-search"
        />
        <a className="text-error">{errorNameCustomer}</a>
      </div>
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

      <div className="mt-3">
        {kindService === "giup_viec_theo_gio" ? (
          <CleaningHourly
            extendService={extendService}
            addService={addService}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
            idService={serviceApply}
          />
        ) : kindService === "giup_viec_co_dinh" ? (
          <CleaningSchedule
            extendService={extendService}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
            idService={serviceApply}
          />
        ) : kindService === "phuc_vu_nha_hang" ? (
          <BussinessType
            extendService={extendService}
            addService={addService}
            bussinessType={bussinessType}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
            idService={serviceApply}
          />
        ) : (
          <></>
        )}
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};
export default AddOrder;
