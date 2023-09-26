import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getElementState,
    getLanguageState,
    getUser,
} from "../../../redux/selectors/auth";
import i18n from "../../../i18n";
import { Link } from "react-router-dom";
import {
    Button,
    DatePicker,
    Dropdown,
    FloatButton,
    Input,
    Select,
    Space,
    Pagination,
    Cascader
} from "antd";
import { getProvince, getService } from "../../../redux/selectors/service";
import "./index.scss";


const FilterSelect = (props) => {
    const {
        data,
    } = props;
    const [isShowFilter, setIsShowFilter] = useState(false)
    const service = useSelector(getService);
    const province = useSelector(getProvince);
    const user = useSelector(getUser);
    const lang = useSelector(getLanguageState);
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [name, setName] = useState("");

    const fakeData = [
        {
            header: "title 1",
            data: [
                {
                    label: "haha 1",
                    value: 1
                },
                {
                    label: "haha 2",
                    value: 2
                }
            ],
            setForField: "status",
            type: "select_data_single"
        },
        {
            header: "title 2",
            data: [
                {
                    label: "hehe 1",
                    value: 3
                },
                {
                    label: "hehe 2",
                    value: 4
                }
            ],
            setForField: "service",
            type: "select_data_multiple"
        },
        {
            data: [],
            setForField: ["city", "district"],
            type: "area"
        },
        // {
        //     data: [],
        //     setForField: "date",
        //     type: "range_date"
        // }
    ]


    const cityOptions = [];
    const districtOption = [];
    const optionsService = [];
  
    service.forEach((item) => {
      if (user?.id_service_manager?.length === 0) {
        optionsService.push({
          value: item?._id,
          label: item?.title?.[lang],
        });
        return;
      } else {
        user?.id_service_manager?.forEach((i) => {
          if (item?._id === i?._id) {
            optionsService.push({
              value: item?._id,
              label: item?.title?.[lang],
            });
            return;
          }
        });
      }
    });
  
    province?.forEach((item) => {
      const itemDistrict = [];
      for (const item2 of item.districts) {
        itemDistrict.push({
          value: item2.code,
          label: item2.name
        })
      }
  
      if (user?.area_manager_lv_1?.length === 0) {
        cityOptions.push({
          value: item?.code,
          label: item?.name,
          district: item?.districts,
          children: itemDistrict
        });
        return;
      } else if (user?.area_manager_lv_1?.includes(item?.code)) {
        cityOptions.push({
          value: item?.code,
          label: item?.name,
          district: item?.districts,
          children: itemDistrict
        });
        return;
      }
    });
  
    dataDistrict?.forEach((item) => {
      if (user?.area_manager_lv_2?.length === 0) {
        districtOption.push({
          value: item?.code,
          label: item?.name,
        });
        return;
      } else if (user?.area_manager_lv_2?.includes(item?.code)) {
        districtOption.push({
          value: item?.code,
          label: item?.name,
        });
        return;
      }
    });








    const resultData = {}
    for (const item of data) {
        resultData[item.setForField] = null;
    }
    console.log(resultData, 'resultData');

    const onChangeArea = (value: string[][]) => {
        console.log(value, "onChangeArea");
    }




    return (
        <React.Fragment>
            <div className="div-filter">
                <div className="button-is-show-filter">
                    <Button
                        type="primary"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                        }}
                        onClick={() => setIsShowFilter(!isShowFilter)}
                    >
                        Bộ lọc
                    </Button>
                </div>

                {isShowFilter && (
                    <div className="container-filter">





                        <div className="header">

                        </div>

                        <div className="container">
                            {data.map((item, index) => {
                                if (item.type === "select_data_single") {
                                    return (
                                        <div className="item-select">
                                            <p>{item.header}</p>
                                            <Select
                                            style={{ width: "100%", marginRight: 10 }}
                                            options={item.data}
                                            onChange={(e, itemSelect) => {
                                                resultData[item.setForField] = itemSelect.value
                                                console.log(resultData, 'resultData');
                                            }}
                                        />
                                        </div>
                                    )
                                }
                                if (item.type === "select_data_multiple") {
                                    return (
                                        <div className="item-select">
                                            <p>{item.header}</p>
                                            <Select
                                            style={{ width: "100%", marginRight: 10 }}
                                            options={item.data}
                                            onChange={(e, itemSelect) => {
                                                resultData[item.setForField] = itemSelect.value
                                                // console.log(resultData, 'resultData');
                                            }}
                                        />
                                        </div>
                                    )
                                }
                                if(item.type === "city") {
                                    return (
                                        <>
                                        <p>{item.header}</p>
                                        <Select
                                        style={{ width: "100%", marginRight: 10 }}
                                        options={cityOptions}
                                        value={city}
                                        onChange={(e, item) => {
                                          setCity(e);
                                          setDataDistrict(item?.district);
                                          setName(item?.label);
                                        }}
                                        showSearch
                                        filterOption={(input, option) =>
                                          (option?.label ?? "").includes(input)
                                        }
                                        filterSort={(optionA, optionB) =>
                                          (optionA?.label ?? "")
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? "").toLowerCase())
                                        }
                                      />
                                        </>

                                    )
                                }
                                if(item.type === "district") {
                                    return (
                                        <>
                                        <p>{item.header}</p>
                                        <Select
                                        style={{ width: "100%", marginRight: 10, marginTop: 10 }}
                                        mode="multiple"
                                        options={districtOption}
                                        value={district}
                                        onChange={(e, item) => {
                                          setDistrict(e);
                                        }}
                                        showSearch
                                        filterOption={(input, option) =>
                                          (option?.label ?? "").includes(input)
                                        }
                                      />
                                      </>
                                    )
                                }
                                // if(item.type === "area") {
                                //     return (
                                //         <div className="item-select">
                                //         <p>{item.header}</p>
                                //         <Cascader
                                //     style={{ width: '100%' }}
                                //     options={cityOptions}
                                //     // children={(value) =>  console.log(value, 'value')}
                                    
                                //     onChange={onChangeArea}
                                //     maxTagCount="responsive"
                                //   />
                                //     </div>
                                //     )
                                // }
                            })}
                        </div>

                        <div className="action">
                            <Button
                                type="primary"
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                }}
                                onClick={() => props.onValueChange(resultData)}
                            >
                                Lọc kết quả
                            </Button>
                        </div>


                    </div>
                )}
            </div>


        </React.Fragment>
    )
}

export default FilterSelect