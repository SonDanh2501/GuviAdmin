import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Image,
  Popover,
  Select,
} from "antd";
// import { IoAccessibility, IoCaretDownOutline, IoClose } from "react-icons/io5";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import moment from "moment";
import { getProvince } from "../../redux/selectors/service";
import { useSelector } from "react-redux";
import { moveElement } from "../../utils/contant";
import icons from "../../utils/icons";

const {
  IoCheckmarkCircleSharp,
  IoChevronDownOutline,
  IoSearchCircle,
  IoCaretDownOutline,
  IoSearch,
} = icons;

const InputTextCustom = (props) => {
  const {
    disable,
    placeHolder,
    type,
    value, // Giá trị value truyền vào chỉ nên có các phần tử có hai trường giá trị là label và code (or value)
    onChange,
    options,
    setValueSelectedProps,
    setValueSelectedPropsSupport,
    setValueArrayProps,
    province,
    district,
    multiSelectOptions,
    birthday,
    setBirthday,
    multiple,
    previewImage,
    imgIdentifyFronsite,
    required,
    number,
    minLength,
    maxLength,
  } = props;

  // Lấy district (quận/huyện) từ giá trị province có được
  const tempDistrictArray = province?.find(
    (el) => el?.code === value
  )?.districts;
  const refContainer = useRef(); // Lấy giá trị width của component để truyền xuống cho dropdown content
  const [matchedItems, setMatchedItems] = useState([]);
  const [multiSelectDataArray, setMultiSelectDataArray] = useState([]);
  const [districtSelect, setDistrictSelect] = useState([]);
  const [search, setSearch] = useState("");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [open, setOpen] = useState(false);

  // ~~~ Support Handle fucntion ~~~
  // 1. Hàm đóng Popover
  const handleClose = () => {
    setOpen(false);
  };
  // 2. Hàm mở Popover
  const handleOpen = (newOpen) => {
    setOpen(newOpen);
  };

  // ~~~ Handle fucntion ~~~
  // 1. Hàm xử lí khi type === "select"
  const handldeSelected = (valueSelect) => {
    // options.map((el) => {
    //   if (el.value === valueSelect) setSelectValue(el.label);
    // });
    setValueSelectedProps(valueSelect);
    handleClose();
  };
  // 2. Hàm xử lí khi type === "calendar"
  const handleChangeCalendar = (valueSelect) => {
    setValueSelectedProps(moment(valueSelect).format("YYYY-MM-DD"));
    handleClose();
  };
  // 3. Hàm xử lí khi type === "province"
  const handleSelectProvince = (valueSelect) => {
    // 1. Lấy data district (quận/huyện) sau khi chọn được province (tỉnh/thành phố)
    const tempDistrictArray = province?.find(
      (el) => el?.code === valueSelect.code
    ).districts;
    // 2. Gắn giá trị mới cho input

    setValueSelectedProps(valueSelect);
    // 1. Check nếu select province mới thì phải reset lại giá trị district
    // 1.1 nếu selected province = province current thì ko reset

    // setValueSelectedPropsSupport("");

    setValueArrayProps(tempDistrictArray);
    // Close
    handleClose();
  };
  // 4. Hàm xử lí khi type === "district"
  const handleSelectDistrict = (valueSelect) => {
    setValueSelectedProps(valueSelect);
    handleClose();
  };
  // 5. Hàm xử lí khi type === "service"
  const handleSelectService = (valueSelect) => {
    // valueSelect : {name, code}
    if (value?.length === 0) {
      setValueSelectedProps([valueSelect.code]);
    } else {
      // Kiểm tra trong mảng truyền vào (value)
      // có giá trị nào giống giá trị được chọn hiện tại
      const found = value.find((el) => el === valueSelect?.code);
      if (found) {
        // Nếu có thì bỏ chọn
        const result = value.filter((el) => el !== found);
        setValueSelectedProps(result);
      } else {
        // Nếu không có thì thêm vào giá trị value
        setValueSelectedProps([...value, valueSelect.code]);
      }
    }
    // handleClose();
  };
  // 6. Hàm xử lí khi type === "multiDistrict"
  const handleSelectMultiDistric = (valueSelect) => {
    let found = [];
    if (value?.length === 0) {
      setValueSelectedProps([valueSelect]);
    } else {
      // Kiểm tra trong mảng truyền vào (value)
      // có giá trị nào giống giá trị được chọn hiện tại
      found = value.find((el) => el === valueSelect?.code);
      // console.log("CHECK FOUND ", found);
      if (found) {
        // Nếu có thì bỏ chọn
        const result = value.filter((el) => el !== found);
        setValueSelectedProps(result);
      } else {
        // Nếu không có thì thêm vào giá trị value
        setValueSelectedProps([...value, valueSelect.code]);
      }
    }
    // handleClose();
  };

  // ~~~ Content for input !=== "text" ~~~
  // 1. Content khi type === "select"
  const content = (
    <div className="flex flex-col">
      {options &&
        options.length > 0 &&
        options?.map((item, index) => (
          <div
            onClick={() => {
              handldeSelected(item.value);
            }}
            style={{ borderRadius: "6px" }}
            className={`${
              item?.value === value && "bg-violet-500 font-bold text-white"
            } hover:bg-violet-500 hover:text-white cursor-pointer p-2 my-0.5 font-normal duration-300 flex items-center justify-between`}
          >
            <span className="text-sm font-normal" key={index}>
              {item.label}
            </span>
            {item?.value === value && <IoCheckmarkCircleSharp size={"22px"} />}
          </div>
        ))}
    </div>
  );
  // 2. Content khi type === "calendar"
  const contentCaler = (
    <Calendar value={value} onChange={handleChangeCalendar} />
  );
  // 3. Content khi type === "province"
  const contentProvince = (
    <div className="flex flex-col">
      {/* search field */}
      <div
        className="w-full"
        style={{ position: "relative", paddingBottom: "2px" }}
      >
        <input
          // type="search"
          // autoFocus
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{
            border: "2px solid #eee",
            borderRadius: "4px",
            outline: "none",
          }}
          className="py-2 pr-[20px] pl-[28px] mb-0.5 duration-300 flex items-center justify-between w-full"
        />
        <IoSearch style={{ position: "absolute", top: 14, left: 8 }} />
      </div>
      {province &&
        province.length > 0 &&
        moveElement(province, 2, (obj) => obj.code === 48)?.map(
          (province, index) => (
            <div
              onClick={() => {
                handleSelectProvince({
                  name: province?.name,
                  code: province?.code,
                });
              }}
              style={{ borderRadius: "6px" }}
              className={`${
                (province?.code === value?.code || province?.code === value) &&
                "bg-violet-500 text-white"
              } hover:bg-violet-500 hover:text-white cursor-pointer p-2 mb-0.5 duration-300 flex items-center justify-between`}
            >
              <span className="text-sm font-normal" key={index}>
                {province?.name}
              </span>
              {(province?.code === value?.code || province?.code === value) && (
                <IoCheckmarkCircleSharp size={"22px"} />
              )}
            </div>
          )
        )}
    </div>
  );
  // 4. Content khi type === "district"
  const contentDistrict = (
    <div className="flex flex-col">
      {district?.map((item, index) => (
        <div
          onClick={() => {
            handleSelectDistrict({ name: item?.name, code: item?.code });
          }}
          style={{ borderRadius: "6px" }}
          className={`${
            item?.code === value?.code && "bg-violet-500 font-bold text-white"
          } hover:bg-violet-500 hover:text-white cursor-pointer p-2 mb-0.5 duration-300 flex items-center justify-between`}
        >
          <span className="text-sm font-normal" key={index}>
            {item?.name}
          </span>
          {item?.code === value?.code && (
            <IoCheckmarkCircleSharp size={"22px"} />
          )}
        </div>
      ))}
    </div>
  );
  // 5. Content khi type === "service"
  const contentService = (
    <div className="flex flex-col">
      {multiSelectDataArray?.map((item, index) => (
        <div
          onClick={() => {
            handleSelectService({ name: item?.title?.vi, code: item?._id });
          }}
          style={{ borderRadius: "6px" }}
          className={`${
            item?.is_select === true && "bg-violet-500 text-white font-bold"
          } hover:bg-violet-500 hover:text-white duration-300 p-2 my-0.5 cursor-pointer font-normal flex items-center justify-between`}
          // className={`${value.forEach((element) => {
          //   element.code === item._id ? "bg-black" : "bg-yellow-500";
          // })}`}
        >
          <span className="text-sm font-normal" key={index}>
            {item?.title?.vi}
          </span>
          {item?.is_select === true && <IoCheckmarkCircleSharp size={"22px"} />}
        </div>
      ))}
    </div>
  );
  // 6. Content khi type === "multiDistrict"
  const contentDistrictMultiSelect = (
    <div className="flex flex-col">
      {multiSelectDataArray?.map((item, index) => (
        <div
          onClick={() => {
            handleSelectMultiDistric({ name: item?.name, code: item?.code });
          }}
          style={{ borderRadius: "6px" }}
          className={`${
            item?.is_select === true && "bg-violet-500 text-white font-bold"
          } hover:bg-violet-500 hover:text-white duration-300 p-2 my-0.5 cursor-pointer font-normal flex items-center justify-between`}
          // className={`${value.forEach((element) => {
          //   element.code === item._id ? "bg-black" : "bg-yellow-500";
          // })}`}
        >
          <span className="text-sm font-normal" key={index}>
            {item?.name}
          </span>
          {item?.is_select === true && <IoCheckmarkCircleSharp size={"22px"} />}
        </div>
      ))}
    </div>
  );

  // ~~~ useEffect ~~~
  // 1. Lấy giá trị width cho component theo container cha
  useEffect(() => {
    if (type !== "text") {
      if (refContainer?.current) {
        setDimensions({
          width: refContainer?.current?.offsetWidth,
          height: refContainer?.current?.offsetHeight,
        });
      }
    }
  }, [refContainer?.current?.offsetWidth]);
  // 2. Lấy giá trị service từ component cha hiển thị trên component con
  useEffect(() => {
    if (type === "service" || type === "multiDistrict") {
      // Lọc ra những phần tử (item) trong multiSelectOptions mà có _id tồn tại trong value
      // Hàm này có tác dụng là tạo ra một chỗ string gồm tất cả các label của các giá trị được chọn gộp lại với nhau và ngăn cách bởi dấu phẩy
      let matchedItemsTemp =
        multiSelectOptions && type === "service"
          ? multiSelectOptions?.filter((item) => value.includes(item._id))
          : type === "multiDistrict"
          ? multiSelectOptions?.filter((item) => value.includes(item.code))
          : "";
      setMatchedItems(matchedItemsTemp);
      // Array to display when using multi select
      // Hàm viết ở đây chỉ đúng cho trường hợp là đã chọn giá trị (value) rồi
      // Hàm này sẽ tạo ra hàm mới gồm những giá trị chưa chọn và giá trị đã chọn rồi display
      const multiSelecDataOptions = multiSelectOptions?.map((serviceItem) => {
        if (value && value?.length >= 0) {
          if (type === "service") {
            const isSelected = value?.some(
              (valueItem) => valueItem === serviceItem._id
            );
            return { ...serviceItem, is_select: isSelected };
          }
          if (type === "multiDistrict") {
            const isSelected = value?.some(
              (valueItem) => valueItem === serviceItem.code
            );
            return { ...serviceItem, is_select: isSelected };
          }
        }
      });
      setMultiSelectDataArray(multiSelecDataOptions);
    }
  }, [multiSelectOptions, value]);
  // 3. Lấy giá trị cho district array nếu province có giá trị default
  useEffect(() => {
    if (type === "province") {
      setValueArrayProps(tempDistrictArray);
    }
  }, [tempDistrictArray]);

  // useEffect(() => {
  //   if (type === "province") {
  //     console.log("checkking searching value >>>", search);
  //   }
  // },[search])
  if (type === "province") {
    console.log("checkking searching value >>>", search);
  }
  return (
    <div className="form-field" ref={refContainer}>
      {/* Input Field  */}
      {type === "text" && (
        <>
          <input
            disabled={disable}
            // type={`${number ? "number" : "text"}`}
            // pattern="[0-9]"
            minLength={minLength ? minLength : "0"}
            maxLength={maxLength ? maxLength : "100"}
            className="form-input"
            placeholder=" "
            value={value}
            onChange={onChange}
          />
          <label htmlFor=" " className="form-label">
            {placeHolder} {required && <span className="text-red-500">*</span>}
          </label>
        </>
      )}
      {/* File Field  */}
      {type === "file" && (
        <>
          <input
            multiple={multiple}
            disabled={disable}
            type="file"
            className="form-input"
            placeholder=" "
          />
          <label htmlFor=" " className="form-label">
            {placeHolder}
          </label>
          <div className="absolute inset-y-0 end-0 flex items-center px-[18.5px] bg-slate-100 mt-[1.5px] mb-[1.5px] mr-[1.5px] border-l-2 border-[#eee] rounded-r-sm cursor-pointer">
            <IoChevronDownOutline color="#999" />
          </div>
        </>
      )}
      {/* Select Field */}
      {type === "select" && (
        <ConfigProvider
          theme={{
            components: {
              Popover: {
                titleMinWidth: dimensions?.width && dimensions?.width - 25,
              },
            },
          }}
        >
          <Popover
            // className=" w-full"
            trigger="click"
            placement="bottom"
            title={" "}
            open={open}
            content={content}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <input
              // style={{ pointerEvents: "none" }}
              type="text"
              className="form-input cursor-pointer"
              placeholder=" "
              value={
                options?.find((el) => el.value === value)?.name
                  ? options?.find((el) => el.value === value)?.name
                  : options?.find((el) => el.value === value)?.label
              }
              // onChange={(el) => printData(el)}
              readOnly
            />
            <label htmlFor=" " className="form-label">
              {placeHolder}
            </label>
            <div className="absolute inset-y-0 end-0 flex items-center pr-[15px]">
              <IoCaretDownOutline color="#999" />
            </div>
          </Popover>
        </ConfigProvider>
      )}
      {/* Date Picker */}
      {type === "date" && (
        <ConfigProvider
          theme={{
            components: {
              Popover: {
                titleMinWidth: dimensions?.width && dimensions?.width - 25,
              },
            },
          }}
        >
          <Popover
            // className=" w-full"
            trigger="click"
            placement="bottom"
            title={" "}
            open={open}
            content={contentCaler}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <input
              // style={{ pointerEvents: "none" }}
              type="text"
              className="form-input cursor-pointer"
              placeholder=" "
              value={moment(value).format("DD/MM/YYYY")}
              // onChange={(el) => printData(el)}
              readOnly
            />
            <label htmlFor=" " className="form-label">
              {placeHolder}
            </label>
          </Popover>
        </ConfigProvider>
      )}
      {/* Select Province */}
      {type === "province" && (
        <ConfigProvider
          theme={{
            components: {
              Popover: {
                titleMinWidth: dimensions?.width && dimensions?.width - 35,
              },
            },
          }}
        >
          <Popover
            trigger="click"
            placement="bottom"
            title={" "}
            open={open}
            content={contentProvince}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <input
              type="text"
              className="form-input cursor-pointer"
              placeholder=" "
              // value={province.find((el))}
              value={
                value?.code
                  ? province.find((el) => el.code === value?.code)?.name
                  : province.find((el) => el.code === value)?.name
              }
              readOnly
            />
            <label htmlFor=" " className="form-label">
              {placeHolder}
            </label>
            <div className="absolute inset-y-0 end-0 flex items-center pr-[15px]">
              <IoCaretDownOutline color="#999" />
            </div>
          </Popover>
        </ConfigProvider>
      )}
      {/* Select District  */}
      {type === "district" && (
        <ConfigProvider
          theme={{
            components: {
              Popover: {
                titleMinWidth: dimensions?.width && dimensions?.width - 35,
              },
            },
          }}
        >
          <Popover
            // className=" w-full"
            trigger="click"
            placement="bottom"
            title={" "}
            open={open}
            content={contentDistrict}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <input
              disabled={disable}
              type="text"
              className="form-input cursor-pointer"
              placeholder=" "
              // disabled={selectProvince?.code ? false : true}
              value={value?.name ? value?.name : ""}
              // onChange={(el) => printData(el)}
              readOnly
            />
            <label htmlFor=" " className="form-label">
              {placeHolder}
            </label>
            <div className="absolute inset-y-0 end-0 flex items-center pr-[15px]">
              <IoCaretDownOutline color="#999" />
            </div>
          </Popover>
        </ConfigProvider>
      )}
      {/* Service Select Field */}
      {type === "service" && (
        <ConfigProvider
          theme={{
            components: {
              Popover: {
                titleMinWidth: dimensions?.width && dimensions?.width - 35,
              },
            },
          }}
        >
          <Popover
            trigger="click"
            placement="bottom"
            title={" "}
            open={open}
            content={contentService}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <input
              // style={{ pointerEvents: "none" }}
              type="text"
              className="form-input cursor-pointer"
              placeholder=" "
              value={
                matchedItems &&
                matchedItems?.length >= 0 &&
                matchedItems?.length <= 4
                  ? matchedItems
                      ?.slice(0, 4)
                      ?.map((item) => item?.title?.vi)
                      ?.join(", ")
                  : matchedItems
                      ?.slice(0, 4)
                      ?.map((item) => item?.title?.vi)
                      ?.join(", ") + " ..."
              }
              // onChange={(el) => printData(el)}
              readOnly
            />
            <label htmlFor=" " className="form-label">
              {placeHolder}
            </label>
            <div className="absolute inset-y-0 end-0 flex items-center pr-[15px]">
              <IoCaretDownOutline color="#999" />
            </div>
          </Popover>
        </ConfigProvider>
      )}
      {/* District Multi Select Field */}
      {type === "multiDistrict" && (
        <ConfigProvider
          theme={{
            components: {
              Popover: {
                titleMinWidth: dimensions?.width && dimensions?.width - 35,
              },
            },
          }}
        >
          <Popover
            trigger="click"
            placement="bottom"
            title={" "}
            open={open}
            content={contentDistrictMultiSelect}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <input
              // style={{ pointerEvents: "none" }}
              disabled={disable}
              type="text"
              className="form-input cursor-pointer"
              placeholder=" "
              value={
                // ""
                matchedItems &&
                matchedItems?.length >= 0 &&
                matchedItems?.length <= 2
                  ? matchedItems
                      ?.slice(0, 2)
                      ?.map((item) => item?.name)
                      ?.join(", ")
                  : matchedItems
                      ?.slice(0, 2)
                      ?.map((item) => item?.name)
                      ?.join(", ") + " ..."
              }
              // onChange={(el) => printData(el)}
              readOnly
            />
            <label htmlFor=" " className="form-label">
              {placeHolder}
            </label>
            <div className="absolute inset-y-0 end-0 flex items-center pr-[15px]">
              <IoCaretDownOutline color="#999" />
            </div>
          </Popover>
        </ConfigProvider>
      )}
    </div>
  );
};

export default InputTextCustom;
