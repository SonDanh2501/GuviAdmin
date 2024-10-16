import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Drawer,
  Input,
  List,
  Select,
  Space,
  Switch,
  Upload,
} from "antd";
// import _debounce from "lodash/debounce";
import _, { filter } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomersApi } from "../../../../api/customer";
import { createPushNotification } from "../../../../api/notification";
import { getGroupCustomerApi } from "../../../../api/promotion";
import InputCustom from "../../../../components/textInputCustom";
import UploadImage from "../../../../components/uploadImage";
import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import { loadingAction } from "../../../../redux/actions/loading";
import { getNotification } from "../../../../redux/actions/notification";
import { getLanguageState } from "../../../../redux/selectors/auth";
import "./index.scss";
import ButtonCustom from "../../../../components/button";
import InputTextCustom from "../../../../components/inputCustom";
import { formatArray } from "../../../../utils/contant";
import resizeFile from "../../../../helper/resizer";
import { postFile } from "../../../../api/file";

import { IoCloudUploadOutline,IoCloseCircleOutline, IoClose  } from "react-icons/io5";

const AddPushNotification = ( props) => {
  const {isCreateNotification,setIsCreateNotification} = props;
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(""); // Tiêu đề thông báo
  const [description, setDescription] = useState(""); // Nội dung thông báo
  // const [isSelectDateSchedule, setIsSelectDateSchedule] = useState(false); // Giá trị true/false thời gian thông báo
  const [isSelectCustomer, setIsSelectCustomer] = useState(true); // Giá trị true/false khách hàng
  const [isSelectGroupCustomer, setIsSelectGroupCustomer] = useState(false); // Giá trị true/false nhóm khách hàng
  const [isSelectCollaborator, setIsSelectCollaborator] = useState(false); // Giá trị true/false đối tác
  const [dateSchedule, setDateSchedule] = useState(
    moment().seconds(0).format("YYYY-MM-DD HH:mm:ss")
  ); // Giá trị ngày thông báo
  const [nameCustomer, setNameCustomer] = useState(""); // Giá trị searching tên khách hàng
  const [dataFilter, setDataFilter] = useState([]); // Giá trị fetch dữ liệu khách hàng tìm kiếm
  const [listCustomers, setListCustomers] = useState([]); // Giá trị khách hàng đã chọn (lưu _id)
  // const [listNameCustomers, setListNameCustomers] = useState([]); // Giá trị khách hàng đã chọn (lưu toàn bộ thông tin, để render ra tên với sđt, ...)
  const [groupCustomer, setGroupCustomer] = useState([]); // Giá trị nhóm khách hàng đã chọn (lưu _id)
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]); // Giá trị fetch dữ liệu nhóm khách hàng
  const [imgThumbnail, setImgThumbnail] = useState(""); // Giá trị ảnh thumbnail
  const [dataFilterTemp, setDataFilterTemp] = useState([]); // Giá trị lưu tạm lại dữ liệu khách hàng tìm kiếm để hiển thị thông tin những khách hàng mà đã lựa chọn
  const options = [];
  const listOptions = [
    { name: "Tên", value: "<full_name>" },
    { name: "Cấp bậc", value: "<rank>" },
  ];

  /* ~~~ Support function ~~~ */
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const width = window.innerWidth;

  /* ~~~ Handle function ~~~ */
  // 1. Hàm tìm kiếm khách hàng
  const handleSearchCustomer = useCallback(
    _.debounce(async (nameCustomer) => {
      if (nameCustomer.length > 0) {
        const dataCustomersFetch = await searchCustomersApi(nameCustomer);
        setDataFilter(dataCustomersFetch ? dataCustomersFetch?.data : []);
        setDataFilterTemp((prev) => [
          ...prev,
          ...(dataCustomersFetch?.data || []),
        ]);
      } else {
        setDataFilter([]);
      }
    }, 500),
    []
  );
  // 2. Hàm tạo thông báo
  const handleCreateNotification = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createPushNotification({
      title: title,
      body: description,
      image_url: imgThumbnail,
      // is_date_schedule: isSelectDateSchedule,
      date_schedule: moment(dateSchedule).toISOString(),
      is_id_customer: isSelectCustomer,
      id_customer: listCustomers,
      is_id_group_customer: groupCustomer?.length > 0 ? true : false,
      id_group_customer: groupCustomer,
      is_id_collaborator: isSelectCollaborator,
    })
      .then(() => {
        // dispatch(
        //   getNotification.getNotificationRequest({
        //     status: "todo",
        //     start: 0,
        //     length: 20,
        //   })
        // );
        dispatch(loadingAction.loadingRequest(false));
        setOpen(false);
        setIsSelectCustomer(true); // Giá trị thông báo cho khách hàng
        setTitle("");
        setDescription("");
        setDateSchedule(moment().seconds(0).format("YYYY-MM-DD HH:mm:ss"));
        // setIsSelectDateSchedule(false);
        setListCustomers([]);
        setGroupCustomer([]);
        setImgThumbnail("");
        setIsCreateNotification(!isCreateNotification);
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    title,
    description,
    dateSchedule,
    isSelectCustomer,
    listCustomers,
    groupCustomer,
    imgThumbnail,
    dispatch,
    isSelectGroupCustomer,
  ]);
  // 3. Hàm đổi ảnh
  const handleChangeThumbnail = async (e) => {
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgThumbnail(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    const image = await resizeFile(file, extend);
    const formData = new FormData();
    formData.append("multi-files", image);
    dispatch(loadingAction.loadingRequest(true));
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgThumbnail(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        setImgThumbnail("");
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  // 4. Hàm xử lí xóa khách khỏi list
  const handleDeleteCustomer = (id) => {
    const filterCustomer = listCustomers.filter((customer) => customer !== id);
    setListCustomers(filterCustomer);
  }
  // const handleSelectTag = (tag) => {
  //   let newDescription = description;
  //   newDescription = `${newDescription} ${tag.value}`.trim();
  //   setDescription(newDescription);
  // };
  // const changeValue = (value) => {
  //   setNameCustomer(value);
  // };

  // const onChooseCustomer = (item) => {
  //   setNameCustomer("");
  //   setDataFilter([]);
  //   const newData = listCustomers.concat(item?._id);
  //   const newNameData = listNameCustomers.concat({
  //     _id: item?._id,
  //     full_name: item?.full_name,
  //     phone: item?.phone,
  //     id_view: item?.id_view,
  //   });
  //   setListCustomers(newData);
  //   setListNameCustomers(newNameData);
  // };

  // const removeItemCustomer = (item) => {
  //   const newNameArray = listNameCustomers.filter((i) => i?._id !== item?._id);
  //   const newArray = listCustomers.filter((i) => i !== item?._id);
  //   setListNameCustomers(newNameArray);
  //   setListCustomers(newArray);
  // };

  // const handleChange = (value) => {
  //   setGroupCustomer(value);
  // };

  // const handleChangeImg = async (info) => {
  //   console.log("Check info ", info);
  //   // if (info.file.status === "uploading") {
  //   //   setLoading(true);
  //   //   return;
  //   // }
  //   // const extend = info.fileList[0].type.slice(
  //   //   info.fileList[0].type.indexOf("/") + 1
  //   // );
  //   // try {
  //   //   const file = info.fileList[0].originFileObj;
  //   //   const image = await resizeFile(file, extend);
  //   //   const formData = new FormData();
  //   //   formData.append("multi-files", image);
  //   //   postFile(formData, {
  //   //     headers: {
  //   //       "Content-Type": "multipart/form-data",
  //   //     },
  //   //   })
  //   //     .then((res) => {
  //   //       setImage(res[0]);
  //   //       setLoading(false);
  //   //     })
  //   //     .catch((err) => {
  //   //       setImage("");
  //   //       errorNotify({
  //   //         message: err?.message,
  //   //       });
  //   //       setLoading(false);
  //   //     });
  //   // } catch (error) {}
  // };

  // const searchCustomer = _debounce((value) => {
  //   setNameCustomer(value);
  //   if (value) {
  //     searchCustomersApi(value)
  //       .then((res) => {
  //         if (value === "") {
  //           setDataFilter([]);
  //         } else {
  //           setDataFilter(res.data);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   } else {
  //     setDataFilter([]);
  //   }
  // }, 500);

  /* ~~~ Use effect ~~~ */
  // 1. Hàm fetch giá trị các nhóm khách hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataGroupCustomerFetch = await getGroupCustomerApi(0, 10);
        setDataGroupCustomer(
          dataGroupCustomerFetch.data ? dataGroupCustomerFetch.data : []
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // 2. Hàm fetch giá trị khách hàng khi search
  useEffect(() => {
    if (nameCustomer) {
      handleSearchCustomer(nameCustomer);
    }
  
    // Cleanup function để hủy debounce khi component unmount hoặc khi nameCustomer thay đổi
    return () => {
      handleSearchCustomer.cancel(); 
    };
  }, [nameCustomer, handleSearchCustomer]);

  dataGroupCustomer?.map((item, index) => {
    return options.push({
      label: item?.name,
      value: item?._id,
    });
  });

  return (
    <div>
      <ButtonCustom
        label={`${i18n.t("create_noti", { lng: lang })}`}
        onClick={showDrawer}
      />
      <Drawer
        // title={`${i18n.t("create_noti", { lng: lang })}`}
        title="Nội dung"
        placement="right"
        onClose={onClose}
        closable={false}
        width={430}
        open={open}
        footer={
          <div className="add-push-notification__footer">
            <ButtonCustom
              disable={
                title.length > 0 && description.length > 0 ? false : true
              }
              label="Đăng thông báo"
              onClick={handleCreateNotification}
            />
            <ButtonCustom label="Hủy" onClick={onClose} style="normal" />
          </div>
        }
      >
        <div className="add-push-notification">
          <div className="add-push-notification__radio">
            <div className="add-push-notification__radio--child">
              <input
                className="add-push-notification__radio--child-box"
                type="radio"
                name="create_for"
                checked={isSelectCustomer}
                onChange={() => {
                  setIsSelectCustomer(true);
                  setIsSelectCollaborator(false);
                }}
              />
              <span
                className={`add-push-notification__radio--child-text ${
                  isSelectCustomer ? "checked" : "un-checked"
                }`}
              >
                Tạo thông báo cho khách hàng
              </span>
            </div>
            <div className="add-push-notification__radio--child">
              <input
                className="add-push-notification__radio--child-box"
                type="radio"
                name="create_for"
                checked={isSelectCollaborator}
                onChange={() => {
                  setIsSelectCollaborator(true);
                  setIsSelectCustomer(false);
                }}
              />
              <span
                className={`add-push-notification__radio--child-text ${
                  isSelectCollaborator ? "checked" : "un-checked"
                }`}
              >
                Tạo thông báo cho đối tác
              </span>
            </div>
          </div>
          {/* Tiêu đề thông báo */}
          <div className="add-push-notification__field">
            <div className="add-push-notification__field--child">
              <InputTextCustom
                type="text"
                value={title}
                placeHolder="Tiêu đề thông báo"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          {/* Nội dung thông báo */}
          <div className="add-push-notification__field">
            <div className="add-push-notification__field--child">
              <InputTextCustom
                type="textArea"
                value={description}
                placeHolder="Nội dung thông báo"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {/* Các thẻ select trường muốn thông báo (tính năng hiện tại ẩn) */}
          {/* <div className="add-push-notification__field">
            <div className="add-push-notification__field--child drap-field">
              {listOptions?.map((el) => (
                <span onClick={() => handleSelectTag(el)}>{el.name}</span>
              ))}
            </div>
          </div> */}
          {/* Thời gian thông báo */}
          <div className="add-push-notification__field">
            <div className="add-push-notification__field--child">
              <Input
                // disabled={!isSelectDateSchedule}
                type="datetime-local"
                className="w-full"
                value={dateSchedule}
                onChange={(e) => setDateSchedule(e.target.value)}
              />
            </div>
          </div>
          {/* Khách hàng */}
          <div className="add-push-notification__field">
            <div className="add-push-notification__field--child">
              <InputTextCustom
                type="multiSelect"
                disable={groupCustomer.length > 0 ? true : false}
                value={listCustomers}
                multiSelectOptions={
                  dataFilter
                    ? formatArray(dataFilter, "_id", "full_name", "phone")
                    : []
                }
                placeHolder="Khách hàng"
                limitShows={1}
                setValueSelectedProps={setListCustomers}
                searchField={true}
                setSearchValue={setNameCustomer}
              />
            </div>
          </div>
          <div
            className={`add-push-notification__field ${
              listCustomers.length === 0 && "hidden"
            }`}
          >
            <div className="add-push-notification__field--info">
              {dataFilterTemp
                .filter(
                  (value, index, self) =>
                    index === self.findIndex((obj) => obj._id === value._id)
                )
                .filter((item) => listCustomers.includes(item._id))
                // .slice(0, 3)
                .map((el, index) => (
                  <div className="add-push-notification__field--info-customer">
                    <span className="add-push-notification__field--info-customer-text">
                      {el.full_name} - {el.phone}
                    </span>
                    <span
                      onClick={() => handleDeleteCustomer(el._id)}
                      className="add-push-notification__field--info-customer-icon"
                    >
                      <IoClose size="16px" />
                    </span>
                  </div>
                ))}
              {/* {dataFilterTemp
                .filter(
                  (value, index, self) =>
                    index === self.findIndex((obj) => obj._id === value._id)
                )
                .filter((item) => listCustomers.includes(item._id)).length >
                3 && <div>hello</div>} */}
            </div>
          </div>
          {/* Nhóm khách hàng */}
          <div className="add-push-notification__field">
            <div className="add-push-notification__field--child">
              <InputTextCustom
                type="multiSelect"
                disable={listCustomers?.length > 0 ? true : false}
                value={groupCustomer}
                multiSelectOptions={
                  options ? formatArray(options, "value", "label") : []
                }
                placeHolder="Nhóm khách hàng"
                limitShows={2}
                setValueSelectedProps={setGroupCustomer}
              />
            </div>
          </div>
          {/* Upload ảnh */}
          <div className="add-push-notification__field">
            <div className="add-push-notification__field--child">
              <InputTextCustom
                type="fileArea"
                value={imgThumbnail}
                setValueSelectedProps={setImgThumbnail}
                onChangeImage={handleChangeThumbnail}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default AddPushNotification;
