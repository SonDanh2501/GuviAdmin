import { DatePicker, List } from "antd";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Button, Col, Form, Row } from "reactstrap";
import { Col, Form, Row } from "reactstrap";
import {
  fetchCollaborators,
  getCollaboratorsById,
  updateInformationCollaboratorApi,
  updateDocumentCollaboratorApi,
} from "../../../../../../../api/collaborator";
import {
  getDetailBusiness,
  getListBusiness,
} from "../../../../../../../api/configuration";
import InputCustom from "../../../../../../../components/textInputCustom";
import { errorNotify, successNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import {
  getProvince,
  getService,
} from "../../../../../../../redux/selectors/service";
import "./index.scss";
import InputTextCustom from "../../../../../../../components/inputCustom";

//Import của document
import { Button, Checkbox, Image, Input } from "antd";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
// import { useCallback, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getCollaboratorsById,
//   updateDocumentCollaboratorApi,
// } from "../../../../../../../api/collaborator";
import { postFile } from "../../../../../../../api/file";
// import InputCustom from "../../../../../../../components/textInputCustom";
import resizeFile from "../../../../../../../helper/resizer";
import icons from "../../../../../../../utils/icons";
import ButtonCustom from "../../../../../../../components/button";
import { bankList } from "../../../../../../../utils/contant";
import user from "../../../../../../../assets/images/user.png";

// import { errorNotify, successNotify } from "../../../../../../../helper/toast";
// import i18n from "../../../../../../../i18n";
// import { loadingAction } from "../../../../../../../redux/actions/loading";
// import { getLanguageState } from "../../../../../../../redux/selectors/auth";
const {
  IoClose,
  IoEyeOutline,
  IoCloudUploadOutline,
  IoRemoveCircle,
  IoRemove,
} = icons;

const Information = ({ data, image, idCTV, setData, id }) => {
  const [resident, setResident] = useState("");
  const [staying, setStaying] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [type, setType] = useState("");
  const [serviceApply, setServiceApply] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [dataBusiness, setDataBusiness] = useState([]);
  const [idBusiness, setIdBusiness] = useState("");
  const [dataDistrict, setDataDistrict] = useState([]);
  const dispatch = useDispatch();
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const serviceOption = [];
  const cityOption = [];
  const districtsOption = [];
  const businessOption = [];
  const dateFormat = "YYYY-MM-DD";
  const lang = useSelector(getLanguageState);

  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");

  const [img, setImg] = useState(""); // Giá trị ảnh avatar
  const [name, setName] = useState(""); // Giá trị tên
  const [email, setEmail] = useState(""); // Giá trị tên
  const [gender, setGender] = useState("other"); // Giá trị giới tính lựa chọn
  const [birthday, setBirthday] = useState("2022-01-20T00:00:00.000Z"); // Giá trị ngày sinh
  const [phone, setPhone] = useState(""); // Giá trị số điện thoại
  const [ethnic, setEthnic] = useState(""); // Giá trị dân tộc
  const [religion, setReligion] = useState(""); // Giá trị tôn giáo
  const [level, setLevel] = useState(""); // Giá trị trình độ
  const [codeInvite, setCodeInvite] = useState(""); // Giá trị mã giới thiệu
  const [number, setNumber] = useState(""); // Giá trị CCCD
  const [issued, setIssued] = useState(""); // Giá trị nơi cấp CCCD/CMND
  const [issuedDay, setIssuedDay] = useState(""); // Giá trị ngày cấp CCCD/CMND

  const [selectService, setSelectService] = useState([]); // Giá trị service lựa chọn
  const [selectBank, setSelectBank] = useState([]); // Giá trị bank lựa chọn

  const [codeCity, setCodeCity] = useState(""); // Giá trị tỉnh, thành phố làm việc
  const [codeDistrict, setCodeDistrict] = useState([]); // Giá trị quận/ huyện làm việc

  const [selectProvinceLive, setSelectProvinceLive] = useState(""); // Giá trị province (tỉnh/thành phố) thường trú lựa chọn
  const [selectDistrictLive, setSelectDistrictLive] = useState(""); // Giá trị district (quận/huyện) thường trú lựa chọn
  const [districtArrayLive, setDistrictArrayLive] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (thường trú)
  const [addressResidentLive, setAddressResidentLive] = useState(""); // Giá trị địa chỉ thường trú cụ thể

  const [selectProvinceTemp, setSelectProvinceTemp] = useState(""); // Giá trị province (tỉnh/thành phố) thường trú lựa chọn
  const [selectDistrictTemp, setSelectDistrictTemp] = useState(""); // Giá trị district (quận/huyện) thường trú lựa chọn
  const [districtArrayTemp, setDistrictArrayTemp] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (thường trú)
  const [addressTemp, setAddressTemp] = useState(""); // Giá trị địa chỉ thường trú cụ thể

  const [selectProvinceWork, setSelectProvinceWork] = useState(""); // Giá trị province (tỉnh/thành phố) làm việc lựa chọn
  const [selectDistrictWork, setSelectDistrictWork] = useState([]); // Giá trị district (quận/huyện) làm việc lựa chọn
  const [districtArrayWork, setDistrictArrayWork] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (làm việc)

  const [contactPersons, setContactPersons] = useState([]);

  useEffect(() => {
    province.forEach((item) => {
      if (item?.code === data?.city) {
        setDataDistrict(item?.districts);
        return;
      }
    });
    getListBusiness(0, 100, "")
      .then((res) => {
        setDataBusiness(res?.data);
      })
      .catch((err) => {});
    setName(data?.full_name);
    setGender(data?.gender);
    setBirthday(data?.birthday);
    setResident(data?.permanent_address);
    setStaying(data?.temporary_address);
    setEthnic(data?.folk); // Dân tộc
    setReligion(data?.religion); // Tôn giáo
    setLevel(data?.edu_level); // Trình độ
    setNumber(data?.identity_number);
    setIssued(data?.identity_place);
    setIssuedDay(data?.identity_date);
    setImgUrl(data?.avatar);
    setPhone(data?.phone);
    setCodeInvite(data?.invite_code);
    setType(data?.type);
    setIdBusiness(data?.id_business);

    // Giá trị default (nếu có) của Quận/Huyện làm việc
    setCodeDistrict(data?.district); // Giá trị cũ
    setSelectDistrictWork(data?.district);

    // Giá trị default (nếu có) của service
    setServiceApply(data?.service_apply); // setServiceApply // Giá trị cũ (xóa sau này)
    setSelectService(data?.service_apply ? data?.service_apply : [""]);

    // Giá trị default (nếu có) của province làm việc
    setCodeCity(data?.city); // Giá trị cũ (xóa sau này)
    setSelectProvinceWork(data?.city);
  }, [data]);

  useEffect(() => {
    if (idBusiness) {
      getDetailBusiness(idBusiness)
        .then((res) => {
          setCodeCity(res?.area_manager_lv_1[0]);
          setCodeDistrict(res?.area_manager_lv_2);
          province?.forEach((item) => {
            res?.area_manager_lv_1?.forEach((i) => {
              if (item?.code === i) {
                setDataDistrict(item?.districts);
                return;
              }
            });
          });
        })
        .catch((err) => {});
    }
  }, [idBusiness]);

  // useEffect(() => {
  //   dispatch(loadingAction.loadingRequest(true));
  //   getCollaboratorsById(id)
  //     .then((res) => {
  //       setAccountNumber(res?.account_number);
  //       setBankName(res?.bank_name);
  //       setAccountName(res?.account_name);
  //       dispatch(loadingAction.loadingRequest(false));
  //     })
  //     .catch((err) => {
  //       errorNotify({
  //         message: err?.message,
  //       });
  //       dispatch(loadingAction.loadingRequest(false));
  //     });
  // }, [id, dispatch]);

  service.map((item) => {
    return serviceOption.push({
      label: item?.title?.[lang],
      value: item?._id,
    });
  });

  province?.map((item) => {
    return cityOption.push({
      label: item?.name,
      value: item?.code,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    return districtsOption.push({
      label: item?.name,
      value: item?.code,
    });
  });

  dataBusiness?.map((item) => {
    return businessOption.push({
      value: item?._id,
      label: item?.full_name,
    });
  });

  const onChangeCity = (value, label) => {
    setCodeCity(value);
    setDataDistrict(label?.district);
  };

  const onChangeDistrict = (value) => {
    setCodeDistrict(value);
  };

  const onChangeNumberIndentity = (value) => {
    if (value.target.value <= 999999999990) {
      setNumber(value.target.value);
    }
  };

  const searchValue = (value) => {
    setNameCollaborator(value);
  };

  const searchCollaborator = _debounce((value) => {
    setNameCollaborator(value);
    if (value) {
      fetchCollaborators(lang, 0, 100, "", value, "")
        .then((res) => {
          if (value === "") {
            setDataCollaborator([]);
          } else {
            setDataCollaborator(res.data);
          }
        })
        .catch((err) => console.log(err));
    } else if (idCollaborator) {
      setDataCollaborator([]);
    } else {
      setDataCollaborator([]);
    }
    setIdCollaborator("");
  }, 500);

  const updateInformation = useCallback(() => {
    // dispatch(loadingAction.loadingRequest(true));
    const birthDayFormat = moment(new Date(birthday)).toISOString(); // Format lại dữ liệu ngày sinh nhật (birthday)
    const indentityDay = moment(new Date(issuedDay)).toISOString(); // Format lại dữ liệu ngày cấp (issuedDay)
    const dataPost = {
      full_name: name, // Họ và tên của CTV (Đã check )
      email: email, // Email của CTV
      gender: gender, // Giới tính của CTV
      birthday: birthDayFormat, // Ngày sinh của CTV
      // phone: phone, // Điện thoại của CTV (không được quyền thay đổi)
      permanent_address: resident, // Địa chỉ thường trú của CTV (dữ liệu cũ)
      temporary_address: staying, //  Địa chỉ tạm trú của CTV (dữ liệu cũ)
      folk: ethnic, // Dân tộc của CTV
      religion: religion, // Tôn giáo của CTV
      edu_level: level, // Trình độ học vấn của CTV
      identity_number: number, // Căn cước công dân/ chứng minh nhân dân của CTV
      identity_place: issued, // Nơi cấp của CCCD/CMND của CTV
      identity_date: indentityDay, // Ngày cấp của CCCD/CMND của CTV
      avatar: image ? image : imgUrl, // Ảnh đại diện của CTV
      id_inviter: idCollaborator, // Mã giới thiệu của CTV
      type: type, // Kiểu thông tin của đối tượng hiện đang chỉnh sửa (để nguyên là được)
      service_apply: serviceApply, // Loại dịch vụ thực hiện của CTV
      district: codeDistrict, // Quận/Huyện làm việc của CTV
      city: !codeCity ? -1 : codeCity, // Tỉnh/Thành phố làm việc của CTV
      id_business: idBusiness, // Đối tác (dữ liệu cũ)
    };
    console.log("Check data upload >>>", dataPost);
    // updateInformationCollaboratorApi(data?._id, {
    //   gender: gender,
    //   full_name: name,
    //   birthday: day,
    //   permanent_address: resident,
    //   temporary_address: staying,
    //   folk: ethnic,
    //   religion: religion,
    //   edu_level: level,
    //   identity_number: number,
    //   identity_place: issued,
    //   identity_date: indentityDay,
    //   avatar: image ? image : imgUrl,
    //   id_inviter: idCollaborator,
    //   type: type,
    //   service_apply: serviceApply,
    //   district: codeDistrict,
    //   city: !codeCity ? -1 : codeCity,
    //   id_business: idBusiness,
    // })
    //   .then((res) => {
    //     dispatch(loadingAction.loadingRequest(false));
    //     setServiceApply([]);
    //     successNotify({
    //       message: `${i18n.t("update_success_info", { lng: lang })}`,
    //     });
    //     getCollaboratorsById(idCTV)
    //       .then((res) => {
    //         setData(res);
    //       })
    //       .catch((err) => {});
    //     dispatch(loadingAction.loadingRequest(false));
    //   })
    //   .catch((err) => {
    //     errorNotify({
    //       message: err?.message,
    //     });
    //     dispatch(loadingAction.loadingRequest(false));
    //   });
  }, [
    gender,
    name,
    resident,
    staying,
    ethnic,
    religion,
    level,
    number,
    issued,
    issuedDay,
    data,
    birthday,
    image,
    imgUrl,
    idCollaborator,
    type,
    idCTV,
    serviceApply,
    codeDistrict,
    codeCity,
    idBusiness,
    dispatch,
    lang,
  ]);

  const handleChangeContact = (e, index) => {
    const { name, value } = e.target;
    const onChangeValue = [...contactPersons];
    onChangeValue[index][name] = value;
    setContactPersons(onChangeValue);
  };

  const handleAddingContact = () => {
    // Giới hạn số người liên hệ tối đa là 3 người
    if (contactPersons.length < 3) {
      setContactPersons([
        ...contactPersons,
        {
          nameCollaborator: "",
          phoneCollaborator: "",
          relationWithCollaborator: "",
        },
      ]);
    }
  };
  const handleDeleteContact = (index) => {
    console.log("running ");
    const deleteContact = [...contactPersons]
    // console.log("check deleteContact", deleteContact);
    deleteContact.splice(index, 1);
    setContactPersons(deleteContact);
  }
  // Document data
  const [deal, setDeal] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [information, setInformation] = useState(false);
  const [certification, setCertification] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [valueDeal, setSetValueDeal] = useState("");
  const [imgIdentifyFronsite, setImgIdentifyFronsite] = useState("");
  const [imgIdentifyBacksite, setImgIdentifyBacksite] = useState("");
  const [imgInformation, setImgInformation] = useState([]);
  const [imgCertification, setImgCertification] = useState([]);
  const [imgRegistration, setImgRegistration] = useState([]);
  // const dispatch = useDispatch();
  // const lang = useSelector(getLanguageState);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));

    getCollaboratorsById(id)
      .then((res) => {
        setAccountNumber(res?.account_number);
        setBankName(res?.bank_name);
        setAccountName(res?.account_name);
        // console.log("check res document >>>", res.identity_frontside.split('/').pop());
        setDeal(res?.is_document_code);
        setSetValueDeal(res?.document_code);
        setIdentify(res?.is_identity);
        setImgIdentifyFronsite(res?.identity_frontside);
        setImgIdentifyBacksite(res?.identity_backside);
        setInformation(res?.is_personal_infor);
        setImgInformation(res?.personal_infor_image);
        setRegistration(res?.is_household_book);
        setImgRegistration(res?.household_book_image);
        setCertification(res?.is_behaviour);
        setImgCertification(res?.behaviour_image);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dispatch, lang]);

  const onChangeIdentifyBefore = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyFronsite(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    const image = await resizeFile(e.target.files[0], extend);

    formData.append("multi-files", image);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgIdentifyFronsite(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeIdentifyAfter = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyBacksite(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    const image = await resizeFile(e.target.files[0], extend);

    formData.append("multi-files", image);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgIdentifyBacksite(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeInformation = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      const image = await resizeFile(e.target.files[i], "png");
      formData.append("multi-files", image);
    }
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgInformation(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeRegistration = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      const image = await resizeFile(e.target.files[i], "png");
      formData.append("multi-files", image);
    }
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        // if (imgRegistration.length > 0) {
        //   const newImg = imgRegistration.concat(res);
        //   setImgRegistration(newImg);
        // } else {
        //   setImgRegistration(res);
        // }
        setImgRegistration(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeCertification = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      const image = await resizeFile(e.target.files[i], "png");
      formData.append("multi-files", image);
    }
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        // if (imgCertification.length > 0) {
        //   const newImg = imgCertification.concat(res);
        //   setImgCertification(newImg);
        // } else {
        //   setImgCertification(res);
        // }
        setImgCertification(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onUpdateDocument = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateDocumentCollaboratorApi(id, {
      is_document_code: deal,
      document_code: valueDeal,
      is_identity: identify,
      identity_frontside: imgIdentifyFronsite,
      identity_backside: imgIdentifyBacksite,
      is_personal_infor: information,
      personal_infor_image: imgInformation,
      is_household_book: registration,
      household_book_image: imgRegistration,
      is_behaviour: certification,
      behaviour_image: imgCertification,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        successNotify({
          message: `${i18n.t("update_success_info", { lng: lang })}`,
        });
        getCollaboratorsById(id)
          .then((res) => {
            setDeal(res?.is_document_code);
            setSetValueDeal(res?.document_code);
            setIdentify(res?.is_identity);
            setImgIdentifyFronsite(res?.identity_frontside);
            setImgIdentifyBacksite(res?.identity_backside);
            setInformation(res?.is_personal_infor);
            setImgInformation(res?.personal_infor_image);
            setRegistration(res?.is_household_book);
            setImgRegistration(res?.household_book_image);
            setCertification(res?.is_behaviour);
            setImgCertification(res?.behaviour_image);
          })
          .catch((e) => console.log(e));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    id,
    deal,
    valueDeal,
    identify,
    imgIdentifyFronsite,
    imgIdentifyBacksite,
    information,
    imgInformation,
    registration,
    imgRegistration,
    certification,
    imgCertification,
    dispatch,
    lang,
  ]);

  const removeItemInfomation = (item) => {
    const newArray = imgInformation.filter((i) => i !== item);

    return setImgInformation(newArray);
  };

  const removeItemRegistration = (item) => {
    const newArray = imgRegistration.filter((i) => i !== item);
    return setImgRegistration(newArray);
  };

  const removeItemCertification = (item) => {
    const newArray = imgCertification.filter((i) => i !== item);
    return setImgCertification(newArray);
  };

  const downloadImageIdentify = () => {
    saveAs(imgIdentifyFronsite, "identifyFronsite.png"); // Put your image url here.
    saveAs(imgIdentifyBacksite, "identifyBacksite.png"); // Put your image url here.
  };

  const downloadImageInformation = () => {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "Infomation.zip";
    imgInformation.forEach(function (url, i) {
      var filename = imgInformation[i];
      filename = filename
        .replace(/[\/\*\|\:\<\>\?\"\\]/gi, "")
        .replace("infomation", "");
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === imgInformation.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  const downloadImageRegistration = () => {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "Registration.zip";
    imgRegistration.forEach(function (url, i) {
      var filename = imgRegistration[i];
      filename = filename
        .replace(/[\/\*\|\:\<\>\?\"\\]/gi, "")
        .replace("registration", "");
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === imgRegistration.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  const downloadImageCertification = () => {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "Certification.zip";
    imgCertification.forEach(function (url, i) {
      var filename = imgCertification[i];
      filename = filename
        .replace(/[\/\*\|\:\<\>\?\"\\]/gi, "")
        .replace("registration", "");
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === imgCertification.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  // ~~~ CONSOLE LOG HERE ~~~
  const inputFile = useRef(null); 
  // console.log("Check inputFile", inputFile);
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };
  return (
    <>
      <div className="pb-4">
        <div className="flex gap-6">
          {/* Container 1 */}
          <div className="flex flex-col w-3/5 gap-6">
            <div
              style={{ borderRadius: "6px" }}
              className="w-full h-fit bg-white card-shadow"
            >
              {/* Header */}
              <div
                style={{ padding: "9px 14px" }}
                className="flex items-center justify-between gap-2 border-b-2 border-gray-200"
              >
                <div className="flex w-full items-center">
                  <span className="font-medium text-sm">
                    Thông tin cộng tác viên
                  </span>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <div className="bg-violet-500 px-1.5 py-1 rounded-lg cursor-pointer hover:bg-violet-400 duration-300 ease-out">
                    <input
                      type="file"
                      id="file"
                      ref={inputFile}
                      style={{ display: "none" }}
                    />
                    <IoCloudUploadOutline
                      onClick={onButtonClick}
                      // onClick={() => inputReference.current.click()}
                      color="white"
                    />
                  </div>
                  <Image
                    style={{
                      width: 30,
                      height: 25,
                      borderRadius: "100%",
                    }}
                    src={img ? img : data?.avatar ? data?.avatar : user}
                  />
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: "12px 18px" }} className="flex flex-col">
                {/* Họ và tên */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      value={name}
                      required
                      placeHolder="Họ và tên"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                {/* Số điện thoại, email */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="textValue"
                      // disable={true}
                      value={phone}
                      required
                      placeHolder="Số điện thoại"
                    />
                  </div>
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      value={email}
                      placeHolder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {/* Căn cước công dân, ngày sinh */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      // disable={true}
                      value={number}
                      number
                      placeHolder="CCCD/CMND"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <InputTextCustom
                      type="date"
                      value={birthday}
                      placeHolder="Ngày sinh"
                      birthday={
                        birthday ? dayjs(birthday.slice(0, 1), dateFormat) : ""
                      }
                      setValueSelectedProps={setBirthday}
                    />
                  </div>
                </div>
                {/* Nơi cấp, ngày cấp */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      // disable={true}
                      value={issued}
                      placeHolder="Nơi cấp"
                      onChange={(e) => setIssued(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <InputTextCustom
                      type="date"
                      value={issuedDay}
                      placeHolder="Ngày cấp"
                      birthday={
                        issuedDay
                          ? dayjs(issuedDay.slice(0, 11), dateFormat)
                          : ""
                      }
                      setValueSelectedProps={setIssuedDay}
                    />
                  </div>
                </div>
                {/* Quốc tịch, giới tính, quê quán */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="select"
                      value={gender}
                      placeHolder="Giới tính"
                      setValueSelectedProps={setGender}
                      options={[
                        {
                          value: "other",
                          label: `${i18n.t("other", { lng: lang })}`,
                        },
                        {
                          value: "male",
                          label: `${i18n.t("male", { lng: lang })}`,
                        },
                        {
                          value: "female",
                          label: `${i18n.t("female", { lng: lang })}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="w-full">
                    <InputTextCustom
                      type="province"
                      searchField={true}
                      // value={selectProvinceLive}
                      placeHolder="Quốc tịch"
                      province={province}
                      // setValueSelectedProps={setSelectProvinceLive}
                      // setValueSelectedPropsSupport={setSelectDistrictLive}
                      // setValueArrayProps={setDistrictArrayLive}
                    />
                  </div>
                  <div className="w-full">
                    <InputTextCustom
                      type="province"
                      searchField={true}
                      // value={selectProvinceLive}
                      placeHolder="Quê quán"
                      province={province}
                      // setValueSelectedProps={setSelectProvinceLive}
                      // setValueSelectedPropsSupport={setSelectDistrictLive}
                      // setValueArrayProps={setDistrictArrayLive}
                    />
                  </div>
                </div>
                {/* Tỉnh/Thành phố thường trú, Quận/Huyện thường trú*/}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <InputTextCustom
                      type="province"
                      searchField={true}
                      value={selectProvinceLive}
                      placeHolder="Tỉnh/Thành phố (thường trú)"
                      province={province}
                      setValueSelectedProps={setSelectProvinceLive}
                      setValueSelectedPropsSupport={setSelectDistrictLive}
                      setValueArrayProps={setDistrictArrayLive}
                    />
                  </div>
                  <div className="w-1/2">
                    <InputTextCustom
                      type="district"
                      searchField={true}
                      disable={selectProvinceLive ? false : true}
                      value={selectDistrictLive}
                      placeHolder="Quận/Huyện (thường trú)"
                      district={districtArrayLive}
                      setValueSelectedProps={setSelectDistrictLive}
                    />
                  </div>
                </div>
                {/* Địa chỉ cụ thể thường trú */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      disable={selectDistrictLive ? false : true}
                      value={addressResidentLive}
                      placeHolder="Số nhà, Tên đường (thường trú)"
                      onChange={(e) => setAddressResidentLive(e.target.value)}
                    />
                  </div>
                </div>
                {/* Tỉnh/Thành phố tạm trú, Quận/Huyện tạm trú*/}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <InputTextCustom
                      type="province"
                      searchField={true}
                      value={selectProvinceTemp}
                      placeHolder="Tỉnh/Thành phố (tạm trú)"
                      province={province}
                      setValueSelectedProps={setSelectProvinceTemp}
                      setValueSelectedPropsSupport={setSelectDistrictTemp}
                      setValueArrayProps={setDistrictArrayTemp}
                    />
                  </div>
                  <div className="w-1/2">
                    <InputTextCustom
                      type="district"
                      searchField={true}
                      disable={selectProvinceTemp ? false : true}
                      value={selectDistrictTemp}
                      placeHolder="Quận/Huyện (tạm trú)"
                      district={districtArrayTemp}
                      setValueSelectedProps={setSelectDistrictTemp}
                    />
                  </div>
                </div>
                {/* Địa chỉ cụ thể tạm trú */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      disable={selectDistrictTemp ? false : true}
                      value={addressTemp}
                      placeHolder="Số nhà, Tên đường (tạm trú)"
                      onChange={(e) => setAddressTemp(e.target.value)}
                    />
                  </div>
                </div>
                {/* Dân tộc, tôn giáo, trình độ văn hóa */}
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <InputTextCustom
                      type="text"
                      value={ethnic}
                      placeHolder="Dân tộc"
                      onChange={(e) => setEthnic(e.target.value)}
                    />
                  </div>
                  <div className="w-1/3">
                    <InputTextCustom
                      type="text"
                      value={religion}
                      placeHolder="Tôn giáo"
                      onChange={(e) => setReligion(e.target.value)}
                    />
                  </div>
                  <div className="w-1/3">
                    <InputTextCustom
                      type="select"
                      value={level}
                      placeHolder="Trình độ"
                      setValueSelectedProps={setLevel}
                      options={[
                        { value: "5/12", label: "5/12" },
                        { value: "9/12", label: "9/12" },
                        { value: "12/12", label: "12/12" },
                        {
                          value: "Cao đẳng",
                          label: `${i18n.t("college", { lng: lang })}`,
                        },
                        {
                          value: "Đại học",
                          label: `${i18n.t("university", { lng: lang })}`,
                        },
                        {
                          value: "Thạc sĩ",
                          label: `${i18n.t("master", { lng: lang })}`,
                        },
                        {
                          value: "Tiến sĩ",
                          label: `${i18n.t("doctor_philosophy", {
                            lng: lang,
                          })}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                {/* Loại dịch vụ */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="service"
                      value={selectService}
                      multiSelectOptions={service}
                      placeHolder="Loại dịch vụ"
                      setValueSelectedProps={setSelectService}
                    />
                  </div>
                </div>
                {/* Tỉnh/Thành phố làm việc, Quận/Huyện làm việc*/}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <InputTextCustom
                      type="province"
                      searchField={true}
                      value={selectProvinceWork}
                      placeHolder="Nơi làm việc (tỉnh/thành phố)"
                      province={province}
                      setValueSelectedProps={setSelectProvinceWork}
                      setValueSelectedPropsSupport={setSelectDistrictWork}
                      setValueArrayProps={setDistrictArrayWork}
                      testing
                    />
                  </div>
                  <div className="w-1/2">
                    <InputTextCustom
                      type="multiDistrict"
                      searchField={true}
                      disable={selectProvinceWork ? false : true}
                      value={selectDistrictWork}
                      multiSelectOptions={districtArrayWork}
                      placeHolder="Nơi làm việc (quận/huyện)"
                      // district={districtArrayWork}
                      setValueSelectedProps={setSelectDistrictWork}
                    />
                  </div>
                </div>
                {/* Mã giới thiệu */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      disable={true}
                      value={codeInvite}
                      // multiSelectOptions={service}
                      placeHolder="Mã giới thiệu"
                      // setValueSelectedProps={setSelectService}
                    />
                  </div>
                </div>
                {/* Tên, số điện thoại, mối quan hệ với CTV*/}
                {contactPersons?.map((inputField, index) => (
                  <div className="flex items-center gap-4">
                    <div className="w-1/3">
                      <InputTextCustom
                        type="text"
                        name="nameCollaborator"
                        value={inputField.nameCollaborator}
                        placeHolder={`Người liên hệ ${index + 1}`}
                        onChange={(e) => handleChangeContact(e, index)}
                      />
                    </div>
                    <div className="w-1/3">
                      <InputTextCustom
                        type="text"
                        name="phoneCollaborator"
                        value={inputField.phoneCollaborator}
                        placeHolder={`Số điện thoại`}
                        onChange={(e) => handleChangeContact(e, index)}
                      />
                    </div>
                    <div className="w-1/3">
                      <InputTextCustom
                        type="text"
                        name="relationWithCollaborator"
                        value={inputField.relationWithCollaborator}
                        placeHolder={`Quan hệ`}
                        onChange={(e) => handleChangeContact(e, index)}
                      />
                    </div>
                    <div
                      onClick={() => handleDeleteContact(index)}
                      style={{ margin: "18px 0px 0px 0px", padding: "2px" }}
                      className="w-fit bg-red-500 rounded-full hover:bg-red-300 duration-300 cursor-pointer text-white"
                    >
                      <IoRemove />
                    </div>
                  </div>
                ))}
                {/* Thêm người liên hệ */}
                <div style={{ padding: "4px 0px 0px 4px" }}>
                  <span
                    onClick={() => handleAddingContact()}
                    className={` ${
                      contactPersons.length >= 3
                        ? "text-gray-500/60 cursor-not-allowed"
                        : "text-violet-500 cursor-pointer"
                    } duration-300`}
                  >
                    Thêm người liên hệ
                  </span>
                </div>
              </div>
              {/* Button submit */}
              <div
                style={{ padding: "0px 18px 12px 18px" }}
                className="flex items-center justify-between "
              >
                <div className="w-0 h-0"></div>
                <ButtonCustom label="Cập nhật" onClick={updateInformation} />
              </div>
            </div>
            <div
              style={{ borderRadius: "6px" }}
              className="w-full h-fit bg-white card-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-gray-200 p-3.5">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm">
                    Thông tin ngân hàng
                  </span>
                </div>
              </div>
              {/* Content */}
              <div
                style={{ gap: "1px", padding: "12px 18px" }}
                className="flex flex-col p-3.5"
              >
                {/* Số tài khoản, Tên chủ thẻ */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <InputTextCustom
                      type="text"
                      value={accountName}
                      placeHolder="Tên chủ thẻ"
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <InputTextCustom
                      type="text"
                      value={accountNumber}
                      placeHolder="Số tài khoản"
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                </div>
                {/* Tên ngân hàng, tên chi nhánh */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="select"
                      value={selectBank}
                      placeHolder="Tên ngân hàng"
                      setValueSelectedProps={setSelectBank}
                      options={bankList}
                      // onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-full">
                    <InputTextCustom
                      type="text"
                      // value={accountNumber}
                      placeHolder="Tên chi nhánh"
                      // onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Button submit */}
              <div
                style={{ padding: "0px 18px 12px 18px" }}
                className="flex items-center justify-between "
              >
                <div className="w-0 h-0"></div>
                <ButtonCustom label="Cập nhật" />
              </div>
            </div>
          </div>
          {/* Container 2 */}
          <div
            style={{ borderRadius: "6px" }}
            className="w-2/5 bg-white card-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b-2 border-gray-200 p-3.5">
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">Thông tin tài liệu</span>
              </div>
            </div>
            {/* Content */}
            <div
              style={{
                gap: "1px",
                padding: "12px 4px",
              }}
              className="flex flex-col"
            >
              {/* Thông tin tổng quan tài liệu */}
              <div
                style={{
                  // gap: "2px",
                  padding: "0px 0px 12px 0px",
                  margin: "0px 13px 0px 13px",
                }}
                className="border-b-[2px] border-[#eee]"
              >
                <div className="pb-2">
                  <span className="font-medium text-gray-500/70 text-sm">
                    Tổng quan
                  </span>
                </div>
                {/* Checkbox */}
                <div className="flex flex-col gap-2">
                  {/* Thỏa thuận hợp tác */}
                  <div
                    style={{ borderRadius: "6px" }}
                    onClick={() => setDeal(!deal)}
                    className={`flex justify-between items-center ${
                      deal ? "bg-violet-500/80" : "bg-gray-100"
                    } p-2 cursor-pointer duration-300 ease-out`}
                  >
                    <span
                      className={`${
                        deal ? "text-white" : "text-gray-500/60"
                      } font-normal text-sm`}
                    >
                      {`${i18n.t("cooperation_agreement", { lng: lang })}`}
                    </span>
                    <Checkbox
                      checked={deal}
                      onChange={(e) => setDeal(e.target.checked)}
                      style={{
                        borderRadius: "6px",
                      }}
                    ></Checkbox>
                  </div>
                  {/* CCCD/CMND */}
                  <div
                    style={{ borderRadius: "6px" }}
                    onClick={() => setIdentify(!identify)}
                    className={`flex justify-between items-center ${
                      identify ? "bg-violet-500/80" : "bg-gray-100"
                    } p-2 cursor-pointer duration-300 ease-out`}
                  >
                    <span
                      className={`${
                        identify ? "text-white" : "text-gray-500/60"
                      } font-normal text-sm`}
                    >
                      {`${i18n.t("citizen_ID", { lng: lang })}`}
                    </span>
                    <Checkbox
                      checked={identify}
                      onChange={(e) => setIdentify(e.target.checked)}
                      style={{
                        borderRadius: "6px",
                      }}
                    ></Checkbox>
                  </div>
                  {/* Sơ yếu lí lịch */}
                  <div
                    style={{ borderRadius: "6px" }}
                    onClick={() => setInformation(!information)}
                    className={`flex justify-between items-center ${
                      information ? "bg-violet-500/80" : "bg-gray-100"
                    } p-2 cursor-pointer duration-300 ease-out`}
                  >
                    <span
                      className={`${
                        information ? "text-white" : "text-gray-500/60"
                      } font-normal text-sm`}
                    >
                      {`${i18n.t("curriculum_vitae", { lng: lang })}`}
                    </span>
                    <Checkbox
                      checked={information}
                      onChange={(e) => setInformation(e.target.checked)}
                      style={{
                        borderRadius: "6px",
                      }}
                    ></Checkbox>
                  </div>
                  {/* Sổ hộ khẩu */}
                  <div
                    style={{ borderRadius: "6px" }}
                    onClick={() => setRegistration(!registration)}
                    className={`flex justify-between items-center ${
                      registration ? "bg-violet-500/80" : "bg-gray-100"
                    } p-2 cursor-pointer duration-300 ease-out`}
                  >
                    <span
                      className={`${
                        registration ? "text-white" : "text-gray-500/60"
                      } font-normal text-sm`}
                    >
                      {`${i18n.t("household_book", { lng: lang })}`}
                    </span>
                    <Checkbox
                      checked={registration}
                      onChange={(e) => setRegistration(e.target.checked)}
                      style={{
                        borderRadius: "6px",
                      }}
                    ></Checkbox>
                  </div>
                  {/* Giấy xác nhận hạnh kiểm */}
                  <div
                    style={{ borderRadius: "6px" }}
                    onClick={() => setCertification(!certification)}
                    className={`flex justify-between items-center ${
                      certification ? "bg-violet-500/80" : "bg-gray-100"
                    } p-2 cursor-pointer duration-300 ease-out`}
                  >
                    <span
                      className={`${
                        certification ? "text-white" : "text-gray-500/60"
                      } font-normal text-sm`}
                    >
                      {`${i18n.t("certificate_conduct", { lng: lang })}`}
                    </span>
                    <Checkbox
                      checked={certification}
                      onChange={(e) => setCertification(e.target.checked)}
                      style={{
                        borderRadius: "6px",
                      }}
                    ></Checkbox>
                  </div>
                </div>
              </div>
              {/* Thông tin chi tiết tài liệu */}
              <div
                className="document-content"
                style={{
                  maxHeight: `${
                    contactPersons.length === 3
                      ? "none"
                      : contactPersons.length === 2
                      ? "950px"
                      : contactPersons.length === 1
                      ? "870px"
                      : "790px"
                  }`,
                  padding: "0px 6px",
                  scrollbarGutter: "stable both-edges",
                }}
              >
                {/* Mã hồ sơ */}
                <div className="w-full">
                  <InputTextCustom
                    type="text"
                    placeHolder={`${i18n.t("profile_ID", { lng: lang })}`}
                    value={valueDeal}
                    onChange={(e) => setSetValueDeal(e.target.value)}
                  />
                </div>
                {/* CCCD/CMND */}
                <div className="w-full">
                  {/* Mặt trước */}
                  <InputTextCustom
                    type="file"
                    placeHolder="CCCD/CMND (mặt trước)"
                    value={imgIdentifyFronsite}
                    setValueSelectedProps={setImgIdentifyFronsite}
                  />
                  {/* Mặt sau */}
                  <InputTextCustom
                    type="file"
                    placeHolder="CCCD/CMND (mặt sau)"
                    value={imgIdentifyBacksite}
                    setValueSelectedProps={setImgIdentifyBacksite}
                  />
                </div>
                {/* Sơ yếu lí lịch */}
                <div className="w-full">
                  <InputTextCustom
                    type="file"
                    placeHolder="Sơ yếu lí lịch"
                    multiple
                    value={imgInformation}
                    setValueSelectedProps={setImgInformation}
                  />
                </div>
                {/* Sổ hộ khẩu */}
                <div className="w-full">
                  <InputTextCustom
                    type="file"
                    placeHolder="Sổ hộ khẩu"
                    multiple
                    value={imgRegistration}
                    setValueSelectedProps={setImgRegistration}
                  />
                </div>
                {/* Giấy xác nhận hạnh kiểm */}
                <div className="w-full">
                  <InputTextCustom
                    type="file"
                    placeHolder="Giấy xác nhận hạnh kiểm"
                    multiple
                    value={imgCertification}
                    setValueSelectedProps={setImgCertification}
                  />
                </div>
              </div>
              <div
                style={{ padding: "14px 14px 0px 0px" }}
                className="flex items-center justify-between "
              >
                <div className="w-0 h-0"></div>
                <ButtonCustom label="Cập nhật" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code tài liệu cũ */}
      {/* <>
        <div className="pl-lg-5">
          <div className="div-check-document">
            <Checkbox
              checked={deal}
              onChange={(e) => setDeal(e.target.checked)}
              className="check-document"
            >
              {`${i18n.t("cooperation_agreement", { lng: lang })}`}
            </Checkbox>

            <div className="form-input">
              <InputCustom
                title={`${i18n.t("profile_ID", { lng: lang })}`}
                value={valueDeal}
                onChange={(e) => setSetValueDeal(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div className="div-check-document">
            <Checkbox
              checked={identify}
              onChange={(e) => setIdentify(e.target.checked)}
              className="check-document"
            >
              {`${i18n.t("citizen_ID", { lng: lang })}`}
            </Checkbox>

            <div className="form-input">
              <div>
                <p className="label-input">{`${i18n.t("citizen_ID_front", {
                  lng: lang,
                })}`}</p>
                <div className="col-img">
                  <Input
                    id="exampleThumbnail"
                    type="file"
                    className="input-file"
                    accept={".jpg,.png,.jpeg"}
                    name="thumbnail"
                    onChange={onChangeIdentifyBefore}
                  />
                  {imgIdentifyFronsite && (
                    <div className="div-img-thumbnail">
                      <i
                        class="uil uil-times-circle"
                        onClick={() => setImgIdentifyFronsite("")}
                      />
                      <Image
                        width={150}
                        src={imgIdentifyFronsite}
                        className={"img-thumbnail"}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="label-input">{`${i18n.t("citizen_ID_back", {
                  lng: lang,
                })}`}</p>
                <div className="col-img">
                  <Input
                    id="exampleThumbnail"
                    type="file"
                    className="input-file"
                    accept={".jpg,.png,.jpeg"}
                    name="thumbnail"
                    onChange={onChangeIdentifyAfter}
                  />
                  {imgIdentifyBacksite && (
                    <div className="div-img-thumbnail">
                      <i
                        class="uil uil-times-circle"
                        onClick={() => setImgIdentifyBacksite("")}
                      />
                      <Image
                        width={150}
                        src={imgIdentifyBacksite}
                        className={"img-thumbnail"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {imgIdentifyFronsite && (
              <div className="div-col-download">
                <Button
                  className="btn-download"
                  onClick={downloadImageIdentify}
                >
                  <i class="uil uil-image-download"></i>
                </Button>
              </div>
            )}
          </div>
          <hr />
          <div className="div-check-document">
            <Checkbox
              checked={information}
              onChange={(e) => setInformation(e.target.checked)}
              className="check-document"
            >
              {`${i18n.t("curriculum_vitae", { lng: lang })}`}
            </Checkbox>

            <div className="form-input">
              <div className="div-infomation">
                <p className="label-input">{`${i18n.t("image", {
                  lng: lang,
                })}`}</p>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={onChangeInformation}
                  />
                  <div className="div-thumbnail-infomation">
                    {imgInformation.length > 0 &&
                      imgInformation.map((item, index) => {
                        return (
                          <div
                            className="div-item-thumbnail-infomation"
                            key={index}
                          >
                            <i
                              class="uil uil-times-circle"
                              onClick={() => removeItemInfomation(item)}
                            ></i>
                            <Image
                              src={item}
                              className="img-thumbnail-infomation"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            {imgInformation.length > 0 && (
              <div className="div-col-download">
                <Button
                  className="btn-download"
                  onClick={downloadImageInformation}
                >
                  <i class="uil uil-image-download"></i>
                </Button>
              </div>
            )}
          </div>
          <hr />
          <div className="div-check-document">
            <Checkbox
              checked={registration}
              onChange={(e) => setRegistration(e.target.checked)}
              className="check-document"
            >
              {`${i18n.t("household_book", { lng: lang })}`}
            </Checkbox>

            <div className="form-input">
              <div className="div-infomation">
                <p className="label-input">{`${i18n.t("image", {
                  lng: lang,
                })}`}</p>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={onChangeRegistration}
                  />
                  <div className="div-thumbnail-infomation">
                    {imgRegistration.length > 0 &&
                      imgRegistration.map((item, index) => {
                        return (
                          <div
                            className="div-item-thumbnail-infomation"
                            key={index}
                          >
                            <i
                              class="uil uil-times-circle"
                              onClick={() => removeItemRegistration(item)}
                            ></i>
                            <Image
                              src={item}
                              className="img-thumbnail-infomation"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            {imgRegistration.length > 0 && (
              <div span="2" className="div-col-download">
                <Button
                  className="btn-download"
                  onClick={downloadImageRegistration}
                >
                  <i class="uil uil-image-download"></i>
                </Button>
              </div>
            )}
          </div>
          <hr />
          <div className="div-check-document">
            <Checkbox
              checked={certification}
              onChange={(e) => setCertification(e.target.checked)}
              className="check-document"
            >
              {`${i18n.t("certificate_conduct", { lng: lang })}`}
            </Checkbox>
            <div className="form-input">
              <div className="div-infomation">
                <p className="label-input">{`${i18n.t("image", {
                  lng: lang,
                })}`}</p>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={onChangeCertification}
                  />
                  <div className="div-thumbnail-infomation">
                    <div className="div-thumbnail-infomation">
                      {imgCertification.length > 0 &&
                        imgCertification.map((item, index) => {
                          return (
                            <div
                              className="div-item-thumbnail-infomation"
                              key={index}
                            >
                              <i
                                class="uil uil-times-circle"
                                onClick={() => removeItemCertification(item)}
                              ></i>
                              <Image
                                src={item}
                                className="img-thumbnail-infomation"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {imgCertification.length > 0 && (
              <div className="div-col-download">
                <Button
                  className="btn-download"
                  onClick={downloadImageCertification}
                >
                  <i class="uil uil-image-download"></i>
                </Button>
              </div>
            )}
          </div>
        </div>
      </> */}
      {/* Form cũ */}
      <>
        <Form>
          <div className="pl-lg-4">
            <h5>{`${i18n.t("info", { lng: lang })}`}</h5>
            <Row>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("full_name", { lng: lang })}`}
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
              <Col lg="6" className="gender">
                <InputCustom
                  title={`${i18n.t("gender", { lng: lang })}`}
                  value={gender}
                  onChange={(e) => setGender(e)}
                  select={true}
                  options={[
                    {
                      value: "other",
                      label: `${i18n.t("other", { lng: lang })}`,
                    },
                    {
                      value: "male",
                      label: `${i18n.t("male", { lng: lang })}`,
                    },
                    {
                      value: "female",
                      label: `${i18n.t("female", { lng: lang })}`,
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <div>
                  <p className="label-birthday-info">{`${i18n.t("birthday", {
                    lng: lang,
                  })}`}</p>
                  <DatePicker
                    onChange={(date, dateString) => setBirthday(dateString)}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    value={
                      birthday ? dayjs(birthday.slice(0, 11), dateFormat) : ""
                    }
                  />
                </div>
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("phone", { lng: lang })}`}
                  type="number"
                  value={phone}
                  disabled={true}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("permanent_address", { lng: lang })}`}
                  type="text"
                  value={resident}
                  onChange={(e) => setResident(e.target.value)}
                />
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("Đối tác", { lng: lang })}`}
                  value={idBusiness}
                  options={businessOption}
                  select={true}
                  onChange={(e) => setIdBusiness(e)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("temporary_address", { lng: lang })}`}
                  type="text"
                  value={staying}
                  onChange={(e) => setStaying(e.target.value)}
                />
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("type_service", { lng: lang })}`}
                  style={{ width: "100%" }}
                  mode="multiple"
                  allowClear
                  value={serviceApply}
                  onChange={(e) => {
                    setServiceApply(e);
                  }}
                  options={serviceOption}
                  select={true}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("nation", { lng: lang })}`}
                  type="text"
                  value={ethnic}
                  onChange={(e) => setEthnic(e.target.value)}
                />
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("religion", { lng: lang })}`}
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("cultural_level", { lng: lang })}`}
                  style={{ width: "100%" }}
                  value={level}
                  onChange={(e) => setLevel(e)}
                  options={[
                    { value: "5/12", label: "5/12" },
                    { value: "9/12", label: "9/12" },
                    { value: "12/12", label: "12/12" },
                    {
                      value: "Cao đẳng",
                      label: `${i18n.t("college", { lng: lang })}`,
                    },
                    {
                      value: "Đại học",
                      label: `${i18n.t("university", { lng: lang })}`,
                    },
                    {
                      value: "Thạc sĩ",
                      label: `${i18n.t("master", { lng: lang })}`,
                    },
                    {
                      value: "Tiến sĩ",
                      label: `${i18n.t("doctor_philosophy", { lng: lang })}`,
                    },
                  ]}
                  select={true}
                />
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("code_invite", { lng: lang })}`}
                  type="text"
                  value={codeInvite}
                  disabled={true}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("Tỉnh/Thành phố làm việc", { lng: lang })}`}
                  value={codeCity}
                  select={true}
                  options={cityOption}
                  style={{ width: "100%" }}
                  onChange={onChangeCity}
                />
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("Quận/huyện làm việc", { lng: lang })}`}
                  value={codeDistrict}
                  options={districtsOption}
                  style={{ width: "100%" }}
                  onChange={onChangeDistrict}
                  mode="multiple"
                  allowClear
                  select={true}
                />
              </Col>
            </Row>
            <hr />
            <h5>{`${i18n.t("citizen_ID", { lng: lang })}`}</h5>
            <Row>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("citizen_ID", { lng: lang })}`}
                  type="number"
                  value={number}
                  min={0}
                  onChange={(e) => onChangeNumberIndentity(e)}
                />
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("issued_by", { lng: lang })}`}
                  type="text"
                  value={issued}
                  onChange={(e) => setIssued(e.target.value)}
                />
              </Col>
              <Col lg="6">
                <div>
                  <p className="label-birthday-info">{`${i18n.t("issue_date", {
                    lng: lang,
                  })}`}</p>
                  <DatePicker
                    onChange={(date, dateString) => setIssuedDay(dateString)}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    value={
                      issuedDay ? dayjs(issuedDay.slice(0, 11), dateFormat) : ""
                    }
                  />
                </div>
              </Col>
            </Row>
            <hr />
            <h5>{`${i18n.t("introduce", { lng: lang })}`}</h5>
            <Row>
              <Col lg="12">
                <div>
                  <InputCustom
                    title={`${i18n.t("code_invite", { lng: lang })}`}
                    value={nameCollaborator}
                    disabled={data?.is_verify ? true : false}
                    className="input-seach-collaborator"
                    onChange={(e) => {
                      searchCollaborator(e.target.value);
                      searchValue(e.target.value);
                    }}
                  />

                  {dataCollaborator.length > 0 && (
                    <List type={"unstyled"} className="list-item">
                      {dataCollaborator?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            onClick={(e) => {
                              setIdCollaborator(item?._id);
                              setCodeInvite(item?.invite_code);
                              setNameCollaborator(item?.full_name);
                              setDataCollaborator([]);
                            }}
                          >
                            <p className="text-name">
                              {item?.full_name} - {item?.phone} -{" "}
                              {item?.id_view} - {item?.invite_code}
                            </p>
                          </div>
                        );
                      })}
                    </List>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <Button className="btn-update mt-3" onClick={updateInformation}>
            {`${i18n.t("update", { lng: lang })}`}
          </Button>
        </Form>
      </>
    </>
  );
};

export default Information;
