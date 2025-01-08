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
// import { IoAccessibility, IoChevronDown , IoClose } from "react-icons/io5";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import moment from "moment";
import { getProvince } from "../../redux/selectors/service";
import { useSelector } from "react-redux";
import { moveElement } from "../../utils/contant";
import icons from "../../utils/icons";

import secretImage from "../../assets/images/preview_image.png";
import notFoundImage from "../../assets/images/not_found_image.svg";
import { formatMoney, formatNumber } from "../../helper/formatMoney";

const {
  IoCheckmarkCircleSharp,
  IoChevronDownOutline,
  IoSearchCircle,
  IoChevronDown,
  IoSearch,
  IoClose,
  IoCalendar,
  IoCloudUploadOutline,
  IoWarning,
  IoAlertCircleOutline,
} = icons;

const InputTextCustom = (props) => {
  const {
    disable, // Giá trị (boolean) vô hiệu hóa input
    placeHolder, // Giá trị (string) place holder của input
    placeHolderNormal, // Giá trị (string) place holder của input nhưng không có css (nếu có placeHolder thì không xài placeHolderNormal và ngược lại)
    type, // Giá trị (string) chọn kiểu của input (text, select, service: select multi cho dịch vụ, province: select cho tỉnh/thành phố, district: select cho huyện/quận, multiDistrict: select multi cho district )
    value, // Giá trị (string) hiển thị
    options, // Giá trị (array) các giá trị select nếu type là "select"
    setValueSelectedProps, // Gán giá trị của value
    setValueSelectedPropsSupport, // Gán giá trị phụ (giá trị liên quan hoặc phụ thuộc vào value, vd: khi chọn province phải chọn reset giá trị district)
    setValueArrayProps, // Gán giá trị cho mảng (vd: khi chọn province sẽ gán giá trị district mới mảng district)
    province, // Giá trị (array) mảng gồm 63 tỉnh thành
    district, // Giá trị (array) mảng gồm các quận/huyện tương ứng với tỉnh thành đã chọn
    multiSelectOptions, // Giá trị (array) mảng dùng cho multi select
    multiple, // Giá trị (boolean) chọn việc upload file lên là 1 file hay nhiều file
    previewImage, // Giá trị (boolean) hiển thị ảnh bên phải của select options (chỉ dành cho type === "select")
    required, // Giá trị (boolean) chọn việc input text là bắt buộc hay không
    searchField, // Giá trị (boolean) chọn việc hiển thị hay không hiển thị thanh tìm kiếm
    onChange, // Hàm thay đổi giá trị cho value khi tyle là "text"
    testing,
    name, // Giá trị tên cho dynamic input field
    onChangeImage, // Hàm xử lí cho thay đổi hình ảnh
    notShowPreviewImage, // Giá trị (boolean) hiển thị hay không preview image
    limitShows, // Hiển thị max là bao nhiêu lựa chọn
    valueUnit, // Phân vùng điện thoại
    onChangeValueUnit, // Hàm change của unit
    setSearchValue, // Lấy giá trị search viết trên component truyền ngược lại component cha
    isPassword, // Giá trị text password (che dấu *)
    describe, // Giá trị mô tả hỗ trợ
    isNumber, // Giá trị format lại text nếu là số
    contentChild, // Giá trị những phần tử bên ngoài để hiển thị thêm
  } = props;
  // Lấy district (quận/huyện) từ giá trị province có được
  const tempDistrictArray = province?.find(
    (el) => el?.code === value
  )?.districts;
  const refContainer = useRef(); // Lấy giá trị width của component để truyền xuống cho dropdown content
  const [matchedItems, setMatchedItems] = useState([]);
  const [multiSelectDataArray, setMultiSelectDataArray] = useState([]);
  const [districtSelect, setDistrictSelect] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [open, setOpen] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const [selectArea, setSelectArea] = useState("");

  // ~~~ Support Handle fucntion ~~~
  // 1. Hàm đóng Popover
  const handleClose = () => {
    setSearchInput("");
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
      (el) => el?.code === valueSelect?.code
    ).districts;
    // 2. Gắn giá trị mới cho input
    setValueSelectedProps(valueSelect);
    // 1. Check nếu select province mới thì phải reset lại giá trị district
    // 1.1 nếu selected province = province current thì ko reset

    if (setValueSelectedPropsSupport) {
      if (testing) {
        setValueSelectedPropsSupport([]);
      } else {
        setValueSelectedPropsSupport("");
      }
      setValueArrayProps(tempDistrictArray);
    }
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
    if (value?.length === 0) {
      setValueSelectedProps([valueSelect?.code]);
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
        setValueSelectedProps([...value, valueSelect?.code]);
      }
    }
  };
  // 6. Hàm xử lí khi type === "multiDistrict"
  const handleSelectMultiDistric = (valueSelect) => {
    let found = [];
    if (value?.length === 0) {
      setValueSelectedProps([valueSelect?.code]);
    } else {
      // Kiểm tra trong mảng truyền vào (value)
      // có giá trị nào giống giá trị được chọn hiện tại
      found = value.find((el) => el === valueSelect?.code);

      if (found) {
        // Nếu có thì bỏ chọn
        const result = value.filter((el) => el !== found);
        setValueSelectedProps(result);
      } else {
        // Nếu không có thì thêm vào giá trị value
        setValueSelectedProps([...value, valueSelect?.code]);
      }
    }
  };
  // 7. Hàm xử lí khi type === "multiSelect"
  const handleSelectMulti = (valueSelect) => {
    if (value?.length === 0) {
      setValueSelectedProps([valueSelect?.code]);
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
        setValueSelectedProps([...value, valueSelect?.code]);
      }
    }
  };
  // ~~~ Content for input !=== "text" ~~~
  // 1. Content khi type === "select"
  const content = (
    <div className="input-custom-content">
      {/* {searchField && (
        <div
          className="w-full"
          style={{ position: "relative", paddingBottom: "2px" }}
        >
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            style={{
              border: "2px solid #eee",
              borderRadius: "4px",
              outline: "none",
            }}
            className="py-2 pr-[20px] pl-[28px] mb-0.5 duration-300 flex items-center justify-between w-full"
          />
          {searchInput.length === 0 && (
            <span
              style={{ position: "absolute", top: 13, left: 30 }}
              className="text-gray-500/60"
            >
              Nhập tìm kiếm
            </span>
          )}
          <IoSearch style={{ position: "absolute", top: 14, left: 8 }} />
          {searchInput.length > 0 && (
            <IoClose
              onClick={() => setSearchInput("")}
              size="20px"
              className="hover:bg-violet-500 hover:text-white p-0.5 rounded-full duration-300"
              style={{ position: "absolute", top: 12, right: 8 }}
            />
          )}
        </div>
      )} */}
      {contentChild}
      {searchInput.length > 0 && type === "select" && !setSearchValue ? (
        options
          .filter((el) =>
            el.name.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((itemFound, index) => (
            <div
              onClick={() => {
                handldeSelected(itemFound.value);
              }}
              className={`
                input-custom-content__child ${
                  itemFound?.code === value && "selected"
                } `}
            >
              <span key={index}>
                {itemFound.label ? itemFound.label : itemFound.name}
              </span>
              {itemFound?.code === value && (
                <IoCheckmarkCircleSharp size={"18px"} />
              )}
            </div>
          ))
      ) : options && options.length > 0 ? (
        options.map((item, index) => (
          <div
            onClick={() => {
              handldeSelected(item.code);
            }}
            className={`input-custom-content__child ${
              item?.code === value && "selected"
            } `}
          >
            <span key={index}>{item.label ? item.label : item.name}</span>
            {item?.code === value && <IoCheckmarkCircleSharp size={"18px"} />}
          </div>
        ))
      ) : (
        <div className="input-custom-content__no-data">
          <span className="input-custom-content__no-data--label">
            Không có dữ liệu
          </span>
          <IoAlertCircleOutline color="#43464b" />
        </div>
      )}
    </div>
  );
  // 2. Content khi type === "calendar"
  const contentCalendar = (
    <Calendar value={value} onChange={handleChangeCalendar} />
  );
  // 3. Content khi type === "province"
  const contentProvince = (
    <div className="flex flex-col">
      {searchField && (
        <div
          className="w-full"
          style={{ position: "relative", paddingBottom: "2px" }}
        >
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            style={{
              border: "2px solid #eee",
              borderRadius: "4px",
              outline: "none",
            }}
            className="py-2 pr-[20px] pl-[28px] mb-0.5 duration-300 flex items-center justify-between w-full"
          />
          {searchInput.length === 0 && (
            <span
              style={{ position: "absolute", top: 13, left: 30 }}
              className="text-gray-500/60"
            >
              Nhập tìm kiếm
            </span>
          )}
          <IoSearch style={{ position: "absolute", top: 14, left: 8 }} />
          {searchInput.length > 0 && (
            <IoClose
              onClick={() => setSearchInput("")}
              size="20px"
              className="hover:bg-violet-500 hover:text-white p-0.5 rounded-full duration-300"
              style={{ position: "absolute", top: 12, right: 8 }}
            />
          )}
        </div>
      )}
      {searchInput.length > 0 && type === "province"
        ? province
            .filter((location) =>
              location.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((province, index) => (
              <div
                onClick={() => {
                  handleSelectProvince({
                    name: province?.name,
                    code: province?.code,
                  });
                }}
                style={{ borderRadius: "6px" }}
                className={`${
                  (province?.code === value?.code ||
                    province?.code === value) &&
                  "bg-violet-500 text-white"
                } hover:bg-violet-500 hover:text-white cursor-pointer p-2 mb-0.5 duration-300 flex items-center justify-between`}
              >
                <span key={index}>{province?.name}</span>
                {(province?.code === value?.code ||
                  province?.code === value) && (
                  <IoCheckmarkCircleSharp size={"18px"} />
                )}
              </div>
            ))
        : province &&
          province.length > 0 &&
          moveElement(province, 2, (obj) => obj?.code === 48)?.map(
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
                  (province?.code === value?.code ||
                    province?.code === value) &&
                  "bg-violet-500 text-white"
                } hover:bg-violet-500 hover:text-white cursor-pointer p-2 mb-0.5 duration-300 flex items-center justify-between`}
              >
                <span key={index}>{province?.name}</span>
                {(province?.code === value?.code ||
                  province?.code === value) && (
                  <IoCheckmarkCircleSharp size={"18px"} />
                )}
              </div>
            )
          )}
    </div>
  );
  // 4. Content khi type === "district"
  const contentDistrict = (
    <div className="flex flex-col">
      {searchField && (
        <div
          className="w-full"
          style={{ position: "relative", paddingBottom: "2px" }}
        >
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            style={{
              border: "2px solid #eee",
              borderRadius: "4px",
              outline: "none",
            }}
            className="py-2 pr-[20px] pl-[28px] mb-0.5 duration-300 flex items-center justify-between w-full"
          />
          <IoSearch style={{ position: "absolute", top: 14, left: 8 }} />
          {searchInput.length > 0 && (
            <IoClose
              onClick={() => setSearchInput("")}
              size="20px"
              className="hover:bg-violet-500 hover:text-white p-0.5 rounded-full duration-300"
              style={{ position: "absolute", top: 12, right: 8 }}
            />
          )}
        </div>
      )}
      {searchInput.length > 0 && type === "district"
        ? district
            .filter((location) =>
              location.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((item, index) => (
              <div
                onClick={() => {
                  handleSelectDistrict({ name: item?.name, code: item?.code });
                }}
                style={{ borderRadius: "6px" }}
                className={`${
                  item?.code === value?.code &&
                  "bg-violet-500 font-bold text-white"
                } hover:bg-violet-500 hover:text-white cursor-pointer p-2 mb-0.5 duration-300 flex items-center justify-between`}
              >
                <span key={index}>{item?.name}</span>
                {item?.code === value?.code && (
                  <IoCheckmarkCircleSharp size={"18px"} />
                )}
              </div>
            ))
        : district &&
          district.length > 0 &&
          district?.map((item, index) => (
            <div
              onClick={() => {
                handleSelectDistrict({ name: item?.name, code: item?.code });
              }}
              style={{ borderRadius: "6px" }}
              className={`${
                item?.code === value?.code &&
                "bg-violet-500 font-bold text-white"
              } hover:bg-violet-500 hover:text-white cursor-pointer p-2 mb-0.5 duration-300 flex items-center justify-between`}
            >
              <span key={index}>{item?.name}</span>
              {item?.code === value?.code && (
                <IoCheckmarkCircleSharp size={"18px"} />
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
          //   element?.code === item._id ? "bg-black" : "bg-yellow-500";
          // })}`}
        >
          <span key={index}>{item?.title?.vi}</span>
          {item?.is_select === true && <IoCheckmarkCircleSharp size={"18px"} />}
        </div>
      ))}
    </div>
  );
  // 6. Content khi type === "multiDistrict"
  const contentDistrictMultiSelect = (
    <div className="flex flex-col">
      {searchField && (
        <div
          className="w-full"
          style={{ position: "relative", paddingBottom: "2px" }}
        >
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            style={{
              border: "2px solid #eee",
              borderRadius: "4px",
              outline: "none",
            }}
            className="py-2 pr-[20px] pl-[28px] mb-0.5 duration-300 flex items-center justify-between w-full"
          />
          <IoSearch style={{ position: "absolute", top: 14, left: 8 }} />
          {searchInput.length > 0 && (
            <IoClose
              onClick={() => setSearchInput("")}
              size="20px"
              className="hover:bg-violet-500 hover:text-white p-0.5 rounded-full duration-300"
              style={{ position: "absolute", top: 12, right: 8 }}
            />
          )}
        </div>
      )}
      {searchInput.length > 0 && type === "multiDistrict"
        ? multiSelectDataArray
            .filter((location) =>
              location.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((item, index) => (
              <div
                onClick={() => {
                  handleSelectMultiDistric({
                    name: item?.name,
                    code: item?.code,
                  });
                }}
                style={{ borderRadius: "6px" }}
                className={`${
                  item?.is_select === true &&
                  "bg-violet-500 text-white font-bold"
                } hover:bg-violet-500 hover:text-white duration-300 p-2 my-0.5 cursor-pointer font-normal flex items-center justify-between`}
              >
                <span key={index}>{item?.name}</span>
                {item?.is_select === true && (
                  <IoCheckmarkCircleSharp size={"18px"} />
                )}
              </div>
            ))
        : multiSelectDataArray &&
          multiSelectDataArray.length > 0 &&
          multiSelectDataArray?.map((item, index) => (
            <div
              onClick={() => {
                handleSelectMultiDistric({
                  name: item?.name,
                  code: item?.code,
                });
              }}
              style={{ borderRadius: "6px" }}
              className={`${
                item?.is_select === true && "bg-violet-500 text-white font-bold"
              } hover:bg-violet-500 hover:text-white duration-300 p-2 my-0.5 cursor-pointer font-normal flex items-center justify-between`}
              // className={`${value.forEach((element) => {
              //   element?.code === item._id ? "bg-black" : "bg-yellow-500";
              // })}`}
            >
              <span key={index}>{item?.name}</span>
              {item?.is_select === true && (
                <IoCheckmarkCircleSharp size={"18px"} />
              )}
            </div>
          ))}
    </div>
  );
  // 7. Content khi type === "multiSelect"
  const contentMultiSelect = (
    <div className="flex flex-col">
      {searchField && (
        <div
          className="w-full"
          style={{ position: "relative", paddingBottom: "2px" }}
        >
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            style={{
              border: "2px solid #eee",
              borderRadius: "4px",
              outline: "none",
            }}
            className="py-2 pr-[20px] pl-[28px] mb-0.5 duration-300 flex items-center justify-between w-full"
          />
          {searchInput.length === 0 && (
            <span
              style={{ position: "absolute", top: 13, left: 30 }}
              className="text-gray-500/60"
            >
              Nhập tìm kiếm
            </span>
          )}
          <IoSearch style={{ position: "absolute", top: 14, left: 8 }} />
          {searchInput.length > 0 && (
            <IoClose
              onClick={() => setSearchInput("")}
              size="20px"
              className="hover:bg-violet-500 hover:text-white p-0.5 rounded-full duration-300"
              style={{ position: "absolute", top: 12, right: 8 }}
            />
          )}
        </div>
      )}
      {multiSelectDataArray?.map((item, index) => (
        <div
          onClick={() => {
            handleSelectMulti({ name: item?.label, code: item?.code });
          }}
          style={{ borderRadius: "6px" }}
          className={`${
            item?.is_select === true && "bg-violet-500 text-white font-bold"
          } hover:bg-violet-500 hover:text-white duration-300 p-2 my-0.5 cursor-pointer font-normal flex items-center justify-between`}
          // className={`${value.forEach((element) => {
          //   element?.code === item._id ? "bg-black" : "bg-yellow-500";
          // })}`}
        >
          <span key={index}>{item?.label}</span>
          {item?.is_select === true && <IoCheckmarkCircleSharp size={"18px"} />}
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
  // 2. Lấy giá trị từ component cha hiển thị trên component con
  useEffect(() => {
    if (
      type === "service" ||
      type === "multiDistrict" ||
      type === "multiSelect"
    ) {
      // Lọc ra những phần tử (item) trong multiSelectOptions mà có _id tồn tại trong value
      // Hàm này có tác dụng là tạo ra một chỗ string gồm tất cả các label của các giá trị được chọn gộp lại với nhau và ngăn cách bởi dấu phẩy
      let matchedItemsTemp =
        type === "service"
          ? multiSelectOptions?.filter((item) => value.includes(item._id))
          : type === "multiDistrict"
          ? multiSelectOptions?.filter((item) => value.includes(item?.code))
          : type === "multiSelect"
          ? multiSelectOptions?.filter((item) => value.includes(item.code))
          : [];
      if (matchedItemsTemp) {
        setMatchedItems(matchedItemsTemp);
      }
      // Hàm viết ở đây chỉ đúng cho trường hợp là đã chọn giá trị (value) rồi,
      // Hàm này sẽ tạo ra một mảng mới gồm những giá trị được chọn sẽ thêm trường is_select là true
      const multiSelecDataOptions = multiSelectOptions?.map((itemOption) => {
        // phải bằng 0 vì nếu không có giá trị nào được chọn thì cũng phải hiển thị
        // if (value && value?.length >= 0) {
        if (type === "service") {
          const isSelected = value?.some(
            (valueItem) => valueItem === itemOption._id
          );
          return { ...itemOption, is_select: isSelected };
        }
        if (type === "multiDistrict") {
          const isSelected = value?.some(
            (valueItem) => valueItem === itemOption?.code
          );
          return { ...itemOption, is_select: isSelected };
        }
        if (type === "multiSelect") {
          const isSelected = value?.some(
            (valueItem) => valueItem === itemOption.code
          );
          return { ...itemOption, is_select: isSelected };
        }
      });
      //
      // if (multiSelecDataOptions?.length) {
      setMultiSelectDataArray(multiSelecDataOptions);
      // }
    }
  }, [multiSelectOptions, value]);
  // 3. Lấy giá trị cho district array nếu province có giá trị default
  useEffect(() => {
    if (
      type === "province" &&
      tempDistrictArray?.length > 0 &&
      setValueSelectedPropsSupport
    ) {
      setValueArrayProps(tempDistrictArray);
    }
  }, [tempDistrictArray]);
  // 4. Gán giá trị search cho một biến ở component cha
  useEffect(() => {
    if (setSearchValue) {
      setSearchValue(searchInput);
    }
  }, [searchInput]);

  return (
    <div className="input-custom" ref={refContainer}>
      {/* Input Field  */}
      {type === "text" && (
        <>
          <input
            type={isPassword ? "password" : "text"}
            disabled={disable}
            name={name ? name : ""}
            className="input-custom__input"
            placeholder={placeHolderNormal ? placeHolderNormal : " "}
            value={isNumber ? formatNumber(value) : value}
            onChange={onChange}
          />
          <label
            htmlFor=" "
            className={`input-custom__label ${describe && "have-describe"}`}
          >
            {placeHolder}{" "}
            {required && (
              <span className="input-custom__label--required">*</span>
            )}
          </label>
          <span className="input-custom__describe">{describe}</span>
        </>
      )}
      {/* File Field  */}
      {type === "file" && (
        <div
          style={{
            border: "2px solid #e7e5e4",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          <input
            multiple={multiple}
            disabled={disable}
            type="file"
            className="input-custom__input"
            placeholder=" "
            accept={".jpg,.png,.jpeg"}
            onChange={onChangeImage}
          />
          <label htmlFor=" " className="input-custom__label">
            {placeHolder}
          </label>
          <div
            onClick={() => {
              setHideImage(!hideImage);
            }}
            className="input-custom__hide-image"
          >
            <IoChevronDownOutline color="#999" />
          </div>
          {/* Preview image  */}
          {value?.length > 0 ? (
            multiple ? (
              value?.map((item, index) => {
                return (
                  <div
                    style={{
                      borderRadius: "6px",
                      border: "2px dashed #e5e7eb",
                      padding: "4px",
                    }}
                    className={`${
                      hideImage ? "hidden" : "flex"
                    } items-center justify-between mt-2 border-2 gap-2`}
                  >
                    <div
                      style={{ gap: "10px" }}
                      className="flex items-center px-2"
                    >
                      <Image
                        height={35}
                        width={35}
                        src={secretImage}
                        preview={{
                          src: `${item}`,
                        }}
                      />
                      <span style={{ maxWidth: "280px", overflow: "hidden" }}>
                        {`File ${placeHolder} ${index + 1}  (${item
                          ?.split("/")
                          .pop()
                          .split(".")
                          .pop()})`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        style={{ borderRadius: "100%" }}
                        className="p-2 hover:bg-red-500 hover:text-white text-red-500 duration-300 ease-out mr-1"
                      >
                        <IoClose
                          // className="mr-0.5"
                          onClick={() =>
                            setValueSelectedProps(
                              value?.filter((el) => el !== item)
                            )
                          }
                          size="14px"
                        />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  borderRadius: "6px",
                  border: "2px dashed #e5e7eb",
                  padding: "4px",
                }}
                className={`${
                  hideImage ? "hidden" : "flex"
                } items-center justify-between mt-2 border-2 gap-2`}
              >
                <div style={{ gap: "10px" }} className="flex items-center px-3">
                  <Image
                    height={30}
                    width={30}
                    src={notShowPreviewImage ? value : secretImage}
                    preview={{
                      src: `${value}`,
                    }}
                  />
                  <span style={{ maxWidth: "280px", overflow: "hidden" }}>
                    {`File ${placeHolder} (${value
                      ?.split("/")
                      .pop()
                      .split(".")
                      .pop()})`}
                    {/* Định dạng file:{" "}{value?.split("/").pop().split(".").pop()} */}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    style={{ borderRadius: "100%" }}
                    className="p-2 hover:bg-red-500 hover:text-white text-red-500 duration-300 ease-out mr-1"
                  >
                    <IoClose
                      // className="mr-1"
                      onClick={() => setValueSelectedProps("")}
                      size="14px"
                    />
                  </button>
                </div>
              </div>
            )
          ) : (
            ""
          )}
        </div>
      )}
      {/* Select Field */}
      {type === "select" && (
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
            content={content}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <div>
              <input
                disabled={disable}
                type="text"
                className="input-custom__input"
                style={{ cursor: "pointer" }}
                placeholder=" "
                value={
                  // options?.find((el) => el.code === value)?.name &&
                  // options?.find((el) => el.code === value)?.name !== "unknow"
                  options?.find((el) => el.code === value)?.label ||
                  options?.find((el) => el.code === value)?.name
                }
                readOnly={searchField ? false : true}
                onChange={onChange}
              />
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
            </div>
            {previewImage ? (
              <div className="input-custom__image">
                <img
                  className="input-custom__image--img"
                  src={
                    options?.find((el) => el.code === value)?.image
                      ? options?.find((el) => el.code === value)?.image
                      : notFoundImage
                  }
                />
              </div>
            ) : (
              <IoChevronDown
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
            )}
          </Popover>
        </ConfigProvider>
      )}
      {/* Date Picker */}
      {type === "date" && (
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
            content={contentCalendar}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="text"
                className="input-custom__input"
                placeholder=" "
                value={moment(value).format("DD/MM/YYYY")}
                // onChange={(el) => printData(el)}
                disabled={disable}
                readOnly
              />
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
              <IoCalendar
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
            </div>
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
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="text"
                className="input-custom__input"
                placeholder=" "
                // value={province.find((el))}
                value={
                  value?.code
                    ? province.find((el) => el?.code === value?.code)?.name
                    : province.find((el) => el?.code === value)?.name
                }
                readOnly
              />
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
              <IoChevronDown
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
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
            <div>
              <input
                style={{ cursor: "pointer" }}
                disabled={disable}
                type="text"
                className="input-custom__input"
                placeholder=" "
                // disabled={selectProvince?.code ? false : true}
                // value={
                //   value?.code
                //     ? province.find((el) => el?.code === value?.code)?.name
                //     : province.find((el) => el?.code === value)?.name
                // }
                value={
                  district.find((el) => el?.code === value)
                    ? district.find((el) => el?.code === value)?.name
                    : district.find((el) => el?.code === value?.code)?.name
                }
                // onChange={(el) => printData(el)}
                readOnly
              />
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
              <IoChevronDown
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
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
            <div>
              <input
                type="text"
                className="input-custom__input"
                placeholder=" "
                value={
                  matchedItems &&
                  matchedItems?.length >= 0 &&
                  matchedItems?.length <= 3
                    ? matchedItems
                        ?.slice(0, 3)
                        ?.map((item) => item?.title?.vi)
                        ?.join(", ")
                    : matchedItems
                        ?.slice(0, 3)
                        ?.map((item) => item?.title?.vi)
                        ?.join(", ") + " ..."
                }
                // onChange={(el) => printData(el)}
                readOnly
              />
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
              <IoChevronDown
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
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
            <div>
              <input
                // style={{ pointerEvents: "none" }}
                disabled={disable}
                type="text"
                className="input-custom__input"
                placeholder=" "
                value={
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
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
              <IoChevronDown
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
            </div>
          </Popover>
        </ConfigProvider>
      )}
      {/* Text with unit */}
      {type === "textValue" && (
        <>
          <input
            disabled={disable}
            className="input-custom__input"
            placeholder=" "
            value={value}
            onChange={onChange}
          />
          <label htmlFor=" " className="input-custom__label">
            {placeHolder}{" "}
            {required && (
              <span className="input-custom__label--required">*</span>
            )}
          </label>
          <div className="input-custom__image">
            {/* <span className="input-custom__image--plus">+</span> */}
            <input
              value={valueUnit}
              onChange={onChangeValueUnit}
              className="input-custom__image--number"
            ></input>
            {/* <img
              className="input-custom__image--img"
              src={
                options?.find((el) => el.code === value)?.image
                  ? options?.find((el) => el.code === value)?.image
                  : notFoundImage
              }
            /> */}
          </div>
        </>
      )}
      {/* Multi Select Field */}
      {type === "multiSelect" && (
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
            content={contentMultiSelect}
            arrow={false}
            onOpenChange={handleOpen}
          >
            <div>
              <input
                // style={{ pointerEvents: "none" }}
                disabled={disable}
                type="text"
                className="input-custom__input"
                placeholder=" "
                value={
                  matchedItems &&
                  matchedItems?.length >= 0 &&
                  matchedItems?.length <= limitShows
                    ? matchedItems
                        ?.slice(0, limitShows)
                        ?.map((item) => item?.label)
                        ?.join(", ")
                    : matchedItems
                        ?.slice(0, limitShows)
                        ?.map((item) => item?.label)
                        ?.join(", ") + " ..."
                }
                // onChange={(el) => printData(el)}
                readOnly
              />
              <label htmlFor=" " className="input-custom__label">
                {placeHolder}
              </label>
              <IoChevronDown
                className="input-custom__icon"
                size="14px"
                color="#999"
              />
            </div>
          </Popover>
        </ConfigProvider>
      )}
      {/* Text Area */}
      {type === "textArea" && (
        <>
          {/* <input
type=""
disabled={disable}
className="input-custom__input"
placeholder=" "
value={valueWithUnit}
onChange={onChange}1` ` ` `   10ou v41`1  
/> */}
          <textarea
            rows="2"
            className="input-custom__input"
            onChange={onChange}
            placeholder=" "
            value={value}
          ></textarea>
          <label htmlFor=" " className="input-custom__label">
            {placeHolder}{" "}
            {required && (
              <span className="input-custom__label--required">*</span>
            )}
          </label>
        </>
      )}
      {/* Drag and Drop File */}
      {type === "fileArea" && (
        <div className="input-custom__text-area">
          <label
            for="dropzone-file"
            className={`input-custom__text-area--container ${
              value && "showing-image"
            }`}
          >
            {value ? (
              <img
                className="input-custom__text-area--container-image"
                src={value}
              />
            ) : (
              <div className="input-custom__text-area--container-content">
                <IoCloudUploadOutline className="input-custom__text-area--container-content-main-icon" />
                <div className="input-custom__text-area--container-content-main-text">
                  <span className="text-bold">Nhấn để tải ảnh lên</span>
                  <span> hoặc kéo và thả ảnh vào đây</span>
                </div>
                <p className="input-custom__text-area--container-content-main-sub">
                  PNG, JPG (Tối đa 1MB, tỷ lệ 2:1)
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="input-custom__text-area--container-input"
              onChange={onChangeImage}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default InputTextCustom;
