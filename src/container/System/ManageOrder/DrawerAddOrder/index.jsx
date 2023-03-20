import { Input, List } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomers } from "../../../../api/customer";
import {
  getExtendOptionalByOptionalServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../api/service";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getService } from "../../../../redux/selectors/service";
import CleaningHourly from "../components/CleaningHourly ";
import CleaningSchedule from "../components/CleaningSchedule";
import "./index.scss";

const AddOrder = () => {
  const [optionalService, setOptionalService] = useState([]);
  const [extendService, setExtendService] = useState([]);
  const [errorExtendService, setErrorExtendService] = useState("");
  const [addService, setAddService] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [errorNameCustomer, setErrorNameCustomer] = useState("");
  const [id, setId] = useState("");
  const service = useSelector(getService);
  const [serviceApply, setServiceApply] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getOptionalServiceByServiceApi(service[0]?._id)
      .then((res) => {
        setOptionalService(res?.data);
      })
      .catch((err) => console.log(err));
    setServiceApply(service[0]?._id);
  }, [service]);

  useEffect(() => {
    optionalService?.map(
      (item) =>
        item?.type === "select_horizontal_no_thumbnail" &&
        getExtendOptionalByOptionalServiceApi(item?._id)
          .then((res) => {
            setExtendService(res?.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          })
    );

    optionalService?.map(
      (item) =>
        item?.type === "multi_select_horizontal_thumbnail" &&
        getExtendOptionalByOptionalServiceApi(item?._id)
          .then((res) => {
            setAddService(res?.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          })
    );
  }, [optionalService]);

  const onChangeServiceApply = (e) => {
    setIsLoading(true);
    setAddService([]);
    getOptionalServiceByServiceApi(e.target.value)
      .then((res) => {
        setOptionalService(res?.data);
      })
      .catch((err) => console.log(err));

    setServiceApply(e.target.value);
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
        <CustomTextInput
          className="select-type-promo"
          name="select"
          type="select"
          value={serviceApply}
          onChange={onChangeServiceApply}
          body={service.map((item, index) => {
            return (
              <option key={index} value={item?._id}>
                {item?.title?.vi}
              </option>
            );
          })}
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
        {addService.length > 0 ? (
          <CleaningHourly
            extendService={extendService}
            addService={addService}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
          />
        ) : (
          <CleaningSchedule
            extendService={extendService}
            id={id}
            name={name}
            setErrorNameCustomer={setErrorNameCustomer}
          />
        )}
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};
export default AddOrder;
