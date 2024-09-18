import { DatePicker, List } from "antd";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Row } from "reactstrap";
import {
  fetchCollaborators,
  getCollaboratorsById,
  updateInformationCollaboratorApi,
  updateDocumentCollaboratorApi,
  editAccountBankCollaborator,
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
import { postFile } from "../../../../../../../api/file";
import resizeFile from "../../../../../../../helper/resizer";
import icons from "../../../../../../../utils/icons";
import ButtonCustom from "../../../../../../../components/button";
import {
  bankList,
  countryList,
  listSkills,
  listLanguages,
} from "../../../../../../../utils/contant";
import user from "../../../../../../../assets/images/user.png";
const {
  IoClose,
  IoEyeOutline,
  IoCloudUploadOutline,
  IoRemoveCircle,
  IoRemove,
} = icons;

const Information = ({ data, idCTV, setData, id }) => {
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

  // Thông tin cộng tác viên
  const [img, setImg] = useState(""); // Giá trị ảnh avatar
  const [name, setName] = useState(""); // Giá trị tên
  const [email, setEmail] = useState(""); // Giá trị email
  const [gender, setGender] = useState("other"); // Giá trị giới tính lựa chọn
  const [birthday, setBirthday] = useState("2022-01-20T00:00:00.000Z"); // Giá trị ngày sinh
  const [selectcountry, setSelectCountry] = useState("vietnam"); // Giá trị quốc tịch
  const [homeTown, setHomeTown] = useState(""); // Giá trị quê quán
  const [phone, setPhone] = useState(""); // Giá trị số điện thoại
  const [ethnic, setEthnic] = useState("Kinh"); // Giá trị dân tộc
  const [religion, setReligion] = useState("Không"); // Giá trị tôn giáo
  const [level, setLevel] = useState("12/12"); // Giá trị trình độ
  const [codeInvite, setCodeInvite] = useState(""); // Giá trị mã giới thiệu
  const [number, setNumber] = useState(""); // Giá trị CCCD
  const [issued, setIssued] = useState("Cục cảnh sát"); // Giá trị nơi cấp CCCD/CMND
  const [issuedDay, setIssuedDay] = useState("2024-01-01:00:00.000Z"); // Giá trị ngày cấp CCCD/CMND
  const [selectService, setSelectService] = useState([]); // Giá trị service lựa chọn
  const [codeCity, setCodeCity] = useState(""); // Giá trị tỉnh, thành phố làm việc
  const [codeDistrict, setCodeDistrict] = useState([]); // Giá trị quận/ huyện làm việc
  const [selectProvinceLive, setSelectProvinceLive] = useState(""); // Giá trị province (tỉnh/thành phố) thường trú lựa chọn
  const [selectDistrictLive, setSelectDistrictLive] = useState(""); // Giá trị district (quận/huyện) thường trú lựa chọn
  const [districtArrayLive, setDistrictArrayLive] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (thường trú)
  const [addressResidentLive, setAddressResidentLive] = useState(""); // Giá trị địa chỉ thường trú cụ thể
  const [selectProvinceTemp, setSelectProvinceTemp] = useState(""); // Giá trị province (tỉnh/thành phố) tạm trú lựa chọn
  const [selectDistrictTemp, setSelectDistrictTemp] = useState(""); // Giá trị district (quận/huyện) tạm trú lựa chọn
  const [districtArrayTemp, setDistrictArrayTemp] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (tạm trú)
  const [addressResidentTemp, setAddressResidentTemp] = useState(""); // Giá trị địa chỉ tạm trú cụ thể
  const [selectProvinceWork, setSelectProvinceWork] = useState(""); // Giá trị province (tỉnh/thành phố) làm việc lựa chọn
  const [selectDistrictWork, setSelectDistrictWork] = useState([]); // Giá trị district (quận/huyện) làm việc lựa chọn
  const [districtArrayWork, setDistrictArrayWork] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (làm việc)
  const [contactPersons, setContactPersons] = useState([
    {
      name_relative: "",
      phone_relative: "",
      relation_relative: "",
    },
  ]); // Giá trị người liên hệ (array)
  const [selectSkills, setSelectSkills] = useState([]); // Giá trị kỹ năng của CTV
  const [selectLanguages, setSelectLanguages] = useState([]); // Giá trị ngôn ngữ của CTV
  const [socialMediaInfo, setSocialMediaInfo] = useState(""); // Giá trị mạng xã hội
  // Thông tin tài khoản
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectBankName, setSelectBankName] = useState(""); // Giá trị bank lựa chọn thay cho tên bankName
  const [bankBrand, setBankBrand] = useState(""); // Giá trị tên chi nhánh ngân hàng
  // Thông tin tài liệu
  const [deal, setDeal] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [information, setInformation] = useState(false);
  const [certification, setCertification] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [imgProfile, setImgProfile] = useState("");
  const [imgIdentifyFronsite, setImgIdentifyFronsite] = useState("");
  const [imgIdentifyBacksite, setImgIdentifyBacksite] = useState("");
  const [imgInformation, setImgInformation] = useState([]);
  const [imgCertification, setImgCertification] = useState([]);
  const [imgRegistration, setImgRegistration] = useState([]);

  // ~~~ useEffect ~~~
  // 1. Lấy giá trị và gán cho các trường thông tin cộng tác viên
  useEffect(() => {
    // Code Cũ
    province.forEach((item) => {
      if (item?.code === data?.city) {
        setDataDistrict(item?.districts);
        return;
      }
    });
    // Lấy danh sách đối tác (chưa làm lại)
    getListBusiness(0, 100, "")
      .then((res) => {
        setDataBusiness(res?.data);
      })
      .catch((err) => {});
    // Trường nếu chưa có giá trị sẽ có giá trị default sẵn nên cần phải check lenght để set giá trị
    setName(data?.full_name);
    if (data?.gender?.length > 0) setGender(data?.gender);
    // setGender(data?.gender?.length > 0 && data?.gender);
    setEmail(data?.email);
    setPhone(data?.phone);
    if (data?.birthday?.length > 0) setBirthday(data?.birthday);
    setNumber(data?.identity_number);
    if (data?.identity_place?.length > 0) setIssued(data?.identity_place);
    if (data?.identity_date?.length > 0) setIssuedDay(data?.identity_date);
    // Hàm này chỉ để cho các chị admin khỏi phải chỉnh sửa lại giá trị country mà sẽ tự động cập nhật giá trị default
    // Do lúc đầu để giá trị cho việt name là vn mà đổi lại thành là vietnam
    if (data?.country?.length > 0)
      setSelectCountry(data?.country === "vn" ? "vietnam" : data?.country);
    // Tương tự hàm trên hàm này viết để convert từ giá trị số của tỉnh (do lúc đầu để input là kiểu select nhưng đổi thành dạng text)
    setHomeTown(
      data?.home_town > 0
        ? province?.find((el) => +el?.code === +data?.home_town)?.name
        : data?.home_town
    );
    setSelectProvinceLive(data?.province_live);
    setSelectDistrictLive(data?.district_live);
    setAddressResidentLive(data?.address_live);
    setSelectProvinceTemp(data?.province_temp);
    setSelectDistrictTemp(data?.district_temp);
    setAddressResidentTemp(data?.address_temp);
    if (data?.folk?.length > 0) setEthnic(data?.folk);
    if (data?.religion?.length > 0) setReligion(data?.religion);
    if (data?.edu_level?.length > 0) setLevel(data?.edu_level);
    // Code cũ không đụng
    setCodeInvite(data?.invite_code);
    setType(data?.type);
    setIdBusiness(data?.id_business);
    // Gán giá trị default (nếu có) cho service
    setServiceApply(data?.service_apply); // setServiceApply // Giá trị cũ (xóa sau này)
    if (data?.service_apply?.length > 0) setSelectService(data?.service_apply);
    if (data?.languages_list?.length > 0)
      setSelectLanguages(data?.languages_list);
    if (data?.skills_list?.length > 0) setSelectSkills(data?.skills_list);
    // Gán giá trị default (nếu có) cho province làm việc
    setCodeCity(data?.city); // Giá trị cũ (xóa sau này)
    // setSelectProvinceWork(
    //   data?.province_work > 0 ? data?.province_work : data?.city
    // );
    // Gán giá trị default (nếu có) của Quận/Huyện làm việc
    setCodeDistrict(data?.district); // Giá trị cũ (xóa sau này)
    // setSelectDistrictWork(
    //   data?.district_work > 0 ? data?.district_work : data?.district
    // );
    // Gán giá trị default (nếu có) cho avatar
    setImgUrl(data?.avatar); // Giá trị cũ
    setImg(data?.avatar);
    // Giá trị địa chỉ thường trú và tạm trú cũ
    setResident(data?.permanent_address);
    setStaying(data?.temporary_address);

    if (data?.contact_persons?.length > 0) setContactPersons(data?.contact_persons);
  }, [data]);
  // 2. Code cũ
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
  // 3. Lấy giá trị và gán cho các trường thông tin ngân hàng và thông tin tài liệu
  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));

    getCollaboratorsById(id)
      .then((res) => {
        if (res?.account_number) setAccountNumber(res?.account_number);
        if (res?.bank_name) setBankName(res?.bank_name);
        if (res?.bank_name) setSelectBankName(res?.bank_name);
        if (res?.account_name) setAccountName(res?.account_name);
        if (res?.bank_brand) setBankBrand(res?.bank_brand);

        setDeal(res?.is_document_code);
        setImgProfile(res?.document_code);
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
  // 4. Tự động check các giá trị checkbox nếu các biến img thay đổi
  useEffect(() => {
    if (imgProfile === "") {
      setDeal(false);
    }
    if (imgIdentifyFronsite === "" && imgIdentifyBacksite === "") {
      setIdentify(false);
    }
    if (imgCertification === "") {
      setCertification(false);
    }
    if (imgInformation === "") {
      setInformation(false);
    }
  }, [
    imgIdentifyBacksite,
    imgIdentifyFronsite,
    imgCertification,
    imgInformation,
    imgProfile,
  ]);
  // ~~~ Handle fucntion ~~~
  // 1. Handle thay đổi thông tin người liên hệ
  const handleChangeContact = (e, index) => {
    const { name, value } = e.target;
    const onChangeValue = [...contactPersons];
    onChangeValue[index][name] = value;
    setContactPersons(onChangeValue);
  };
  // 2. Handle thêm người liên hệ mới
  const handleAddingContact = () => {
    // Giới hạn số người liên hệ tối đa là 3 người
    if (contactPersons?.length < 3) {
      setContactPersons([
        ...contactPersons,
        {
          name_relative: "",
          phone_relative: "",
          relation_relative: "",
        },
      ]);
    }
  };
  // 3. Handle xóa người liên hệ
  const handleDeleteContact = (index) => {
    const deleteContact = [...contactPersons];
    deleteContact.splice(index, 1);
    setContactPersons(deleteContact);
  };
  // 4. Handle thay đổi ảnh avatar
  const onChangeThumbnail = async (e) => {
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImg(reader.result);
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
        setImg(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        setImg("");
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  // 5. Handle thay đổi ảnh hồ sơ
  const onChangeImageProfile = async (e) => {
    setDeal(true);
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );

    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgProfile(reader.result);
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
        setImgProfile(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  // 6. Handle thay đổi ảnh cccd mặt trước
  const onChangeIdentifyBefore = async (e) => {
    setIdentify(true);
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
  // 7. Handle thay đổi ảnh cccd mặt sau
  const onChangeIdentifyAfter = async (e) => {
    setIdentify(true);
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
  // 8. Handle thay đổi ảnh sơ yêu lí lịch
  const onChangeInformation = async (e) => {
    setInformation(true);
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
  // 9. Handle thay đổi ảnh sổ hộ khẩu
  const onChangeRegistration = async (e) => {
    setRegistration(true);
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
  // 10. Handle thay đổi ảnh xác nhận hạnh kiểm
  const onChangeCertification = async (e) => {
    setCertification(true);
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
  // ~~~ Update information fucntion ~~~
  // 1. Cập nhật thông tin cộng tác viên
  const handleUpdateCollaboratorInfo = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    const birthDayFormat = moment(new Date(birthday)).toISOString(); // Format lại dữ liệu ngày sinh nhật (birthday)
    const indentityDay = moment(new Date(issuedDay)).toISOString(); // Format lại dữ liệu ngày cấp (issuedDay)
    updateInformationCollaboratorApi(data?._id, {
      full_name: name.trim(), // Họ và tên của CTV [✓]
      gender: gender, // Giới tính của CTV [✓]
      email: email.trim(), // Email của CTV [✓]
      phone: phone.trim(), // Điện thoại của CTV [✓] (không được quyền thay đổi)
      birthday: birthDayFormat, // Ngày sinh của CTV [✓]
      identity_number: number.trim(), //  CCCD/CMND của CTV [✓]
      identity_place: issued.trim(), // Nơi cấp của CCCD/CMND của CTV [✓]
      identity_date: indentityDay, // Ngày cấp của CCCD/CMND czủa CTV [✓]
      country: selectcountry, // Quốc tịch của CTV [✓]
      home_town: homeTown, // Quê quán của CTV [✓]
      province_live: selectProvinceLive?.code, // Tỉnh/Thành phố thường trú của CTV [✓]
      district_live: selectDistrictLive?.code, // Quận/Huyện thường trú của CTV [✓]
      address_live: addressResidentLive.trim(), // Số nhà, tên đường thường trú của CTV [✓]
      province_temp: selectProvinceTemp?.code, // Tỉnh/Thành phố tạm trú của CTV [✓]
      district_temp: selectDistrictTemp?.code, // Quận/Huyện tạm trú của CTV [✓]
      address_temp: addressResidentTemp.trim(), // Số nhà, tên đường tạm trú của CTV [✓]
      folk: ethnic.trim(), // Dân tộc của CTV [✓]
      religion: religion.trim(), // Tôn giáo của CTV [✓]
      edu_level: level, // Trình độ học vấn của CTV [✓]
      service_apply: selectService, // Loại dịch vụ thực hiện của CTV [✓]
      skills_list: selectSkills, // Loại kỹ năng của CTV [✓]
      languages_list: selectLanguages, // Loại ngôn ngữ giao tiếp được của CTV [✓]
      province_work: selectProvinceWork?.code, // Tỉnh/Thành phố làm việc của CTV [✓]
      district_work: selectDistrictWork, // Quận/Huyện làm việc của CTV [✓] (Trả về theo kiểu array gồm các phần tử là code của tỉnh)
      codeInvite: codeInvite, // Mã giới thiệu của CTV [✓] (không được quyền thay đổi)
      contact_persons: contactPersons, // Người liên hệ của CTV [✓]
      avatar: img, // Ảnh đại diện của CTV [✓]
      type: type, // Kiểu đối tượng hiện đang chỉnh sửa [✓] (Để nguyên không cần chỉnh sửa)
      id_inviter: idCollaborator, // [✓] (Không rõ => để nguyên)

      //   // permanent_address: resident, // Địa chỉ thường trú của CTV (dữ liệu cũ)
      //   // temporary_address: staying, //  Địa chỉ tạm trú của CTV (dữ liệu cũ)
      //   // district: codeDistrict, // Quận/Huyện làm việc của CTV
      //   // city: !codeCity ? -1 : codeCity, // Tỉnh/Thành phố làm việc của CTV
      //   // id_business: idBusiness, // Đối tác (dữ liệu cũ)
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setServiceApply([]);
        successNotify({
          message: `${i18n.t("update_success_info", { lng: lang })}`,
        });
        getCollaboratorsById(idCTV)
          .then((res) => {
            setData(res);
          })
          .catch((err) => {});
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    name,
    gender,
    email,
    phone,
    birthday,
    number,
    issued,
    issuedDay,
    selectcountry,
    homeTown,
    selectProvinceLive,
    selectDistrictLive,
    addressResidentLive,
    selectProvinceTemp,
    selectDistrictTemp,
    addressResidentTemp,
    ethnic,
    religion,
    level,
    selectService,
    selectSkills,
    selectLanguages,
    selectProvinceWork,
    selectDistrictWork,
    idCollaborator,
    codeInvite,
    contactPersons,
    img,
    type,
    dispatch,
    lang,
  ]);
  // 2. Cập nhật thông tin tài liệu cộng tác viên
  const handleUpdateCollaboratorDocument = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateDocumentCollaboratorApi(id, {
      is_document_code: deal,
      document_code: imgProfile,
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
            setImgProfile(res?.document_code);
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
    imgProfile,
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
  // 3. Cập nhật thông tài tài khoản ngân hàng
  const handleUpdateAccountBankInfo = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    editAccountBankCollaborator(id, {
      account_number: accountNumber,
      bank_name: selectBankName,
      account_name: accountName,
      bank_brand: bankBrand,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        successNotify({
          message: `${i18n.t("update_success_info", { lng: lang })}`,
        });
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    id,
    accountNumber,
    bankName,
    accountName,
    selectBankName,
    bankBrand,
    dispatch,
  ]);

  // ↓ code cũ không quan tâm (code này để hiển thị tên trong các select cũ khi nào nhập xong dữ liệu thì xóa)
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
  // ↑ trở lên là code cũ không cần quan tâm


  // console.log("data?.contact_persons", data?.contact_persons > );
  return (
    <>
      <div>
        <div className="collaborator-information">
          {/* Container 1 */}
          <div className="collaborator-information__left">
            <div className="collaborator-information__left--card card-shadow">
              {/* Header */}
              <div className="collaborator-information__left--card-header">
                <span>Thông tin cộng tác viên</span>
              </div>
              {/* Content */}
              <div className="collaborator-information__left--card-body">
                {/* Avatar */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="file"
                      placeHolder="Ảnh đại diện"
                      // value={img ? img : data?.avatar ? data?.avatar : user}
                      value={img}
                      notShowPreviewImage={true}
                      onChangeImage={onChangeThumbnail}
                      setValueSelectedProps={setImg}
                    />
                  </div>
                </div>
                {/* Họ và tên, giới tính */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={name}
                      required
                      placeHolder="Họ và tên"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="select"
                      value={gender}
                      placeHolder="Giới tính"
                      setValueSelectedProps={setGender}
                      options={[
                        {
                          code: "other",
                          label: `${i18n.t("other", { lng: lang })}`,
                        },
                        {
                          code: "male",
                          label: `${i18n.t("male", { lng: lang })}`,
                        },
                        {
                          code: "female",
                          label: `${i18n.t("female", { lng: lang })}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={email}
                      placeHolder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {/* Số điện thoại, ngày sinh */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="textValue"
                      valueUnit="(+84)"
                      disable={true}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeHolder="Số điện thoại"
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
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
                {/* Mạng xã hội (Số điện thoại zalo, facebook, etc...) */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={socialMediaInfo}
                      placeHolder="Mạng xã hội"
                      onChange={(e) => setSocialMediaInfo(e.target.value)}
                    />
                  </div>
                </div>
                {/* CCCD/CMND, nơi cấp, ngày cấp */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      // disable={true}
                      value={number}
                      number
                      placeHolder="CCCD/CMND"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      // disable={true}
                      value={issued}
                      placeHolder="Nơi cấp"
                      onChange={(e) => setIssued(e.target.value)}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
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
                {/* Quốc tịch, quê quán */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="select"
                      searchField={true}
                      value={selectcountry}
                      placeHolder="Quốc tịch"
                      setValueSelectedProps={setSelectCountry}
                      options={countryList}
                      previewImage={true}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={homeTown}
                      placeHolder="Quê quán"
                      setValueSelectedProps={setHomeTown}
                      // options={province}
                    />
                  </div>
                </div>
                {/* Tỉnh/Thành phố thường trú, Quận/Huyện thường trú*/}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
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
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="district"
                      searchField={true}
                      disable={
                        selectProvinceLive > 0
                          ? false
                          : selectProvinceLive?.code > 0
                          ? false
                          : selectDistrictLive?.length > 0
                          ? false
                          : true
                      }
                      value={selectDistrictLive}
                      placeHolder="Quận/Huyện (thường trú)"
                      district={districtArrayLive}
                      setValueSelectedProps={setSelectDistrictLive}
                    />
                  </div>
                </div>
                {/* Địa chỉ cụ thể thường trú */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      disable={
                        selectDistrictLive > 0
                          ? false
                          : selectDistrictLive?.code > 0
                          ? false
                          : selectDistrictLive?.length > 0
                          ? false
                          : true
                      }
                      value={addressResidentLive}
                      placeHolder="Số nhà, Tên đường (thường trú)"
                      onChange={(e) => setAddressResidentLive(e.target.value)}
                    />
                  </div>
                </div>
                {/* Tỉnh/Thành phố tạm trú, Quận/Huyện tạm trú*/}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
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
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="district"
                      searchField={true}
                      disable={
                        selectProvinceTemp > 0
                          ? false
                          : selectProvinceTemp?.code > 0
                          ? false
                          : selectProvinceTemp?.length > 0
                          ? false
                          : true
                      }
                      value={selectDistrictTemp}
                      placeHolder="Quận/Huyện (tạm trú)"
                      district={districtArrayTemp}
                      setValueSelectedProps={setSelectDistrictTemp}
                    />
                  </div>
                </div>
                {/* Địa chỉ cụ thể tạm trú */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      disable={
                        selectDistrictTemp > 0
                          ? false
                          : selectDistrictTemp?.code > 0
                          ? false
                          : selectDistrictTemp?.length > 0
                          ? false
                          : true
                      }
                      value={addressResidentTemp}
                      placeHolder="Số nhà, Tên đường (tạm trú)"
                      onChange={(e) => setAddressResidentTemp(e.target.value)}
                    />
                  </div>
                </div>
                {/* Dân tộc, tôn giáo, trình độ văn hóa */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={ethnic}
                      placeHolder="Dân tộc"
                      onChange={(e) => setEthnic(e.target.value)}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={religion}
                      placeHolder="Tôn giáo"
                      onChange={(e) => setReligion(e.target.value)}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="select"
                      value={level}
                      placeHolder="Trình độ"
                      setValueSelectedProps={setLevel}
                      options={[
                        { code: "5/12", label: "5/12" },
                        { code: "9/12", label: "9/12" },
                        { code: "12/12", label: "12/12" },
                        {
                          code: "Cao đẳng",
                          label: `${i18n.t("college", { lng: lang })}`,
                        },
                        {
                          code: "Đại học",
                          label: `${i18n.t("university", { lng: lang })}`,
                        },
                        {
                          code: "Thạc sĩ",
                          label: `${i18n.t("master", { lng: lang })}`,
                        },
                        {
                          code: "Tiến sĩ",
                          label: `${i18n.t("doctor_philosophy", {
                            lng: lang,
                          })}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                {/* Ngoại ngữ, kỹ năng */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="multiSelect"
                      value={selectLanguages}
                      multiSelectOptions={listLanguages}
                      placeHolder="Ngôn ngữ"
                      limitShows={3}
                      setValueSelectedProps={setSelectLanguages}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="multiSelect"
                      value={selectSkills}
                      multiSelectOptions={listSkills}
                      placeHolder="Kỹ năng"
                      limitShows={3}
                      setValueSelectedProps={setSelectSkills}
                    />
                  </div>
                </div>
                {/* Loại dịch vụ */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
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
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="province"
                      searchField={true}
                      value={codeCity}
                      placeHolder="Nơi làm việc (tỉnh/thành phố)"
                      province={province}
                      setValueSelectedProps={setCodeCity}
                      setValueSelectedPropsSupport={setCodeDistrict}
                      setValueArrayProps={setDistrictArrayWork}
                      testing
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="multiDistrict"
                      searchField={true}
                      // disable={selectProvinceWork ? false : true}
                      disable={
                        codeCity > 0
                          ? false
                          : codeCity?.code > 0
                          ? false
                          : codeCity?.length > 0
                          ? false
                          : true
                      }
                      value={codeDistrict}
                      multiSelectOptions={districtArrayWork}
                      placeHolder="Nơi làm việc (quận/huyện)"
                      // district={districtArrayWork}
                      setValueSelectedProps={setCodeDistrict}
                    />
                  </div>
                </div>
                {/* Mã giới thiệu, đối tác */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      disable={true}
                      value={codeInvite}
                      // multiSelectOptions={service}
                      placeHolder="Mã giới thiệu"
                      // setValueSelectedProps={setSelectService}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="select"
                      disable={true}
                      // value={codeInvite}
                      // multiSelectOptions={service}
                      placeHolder="Đối tác"
                      // setValueSelectedProps={setSelectService}
                    />
                  </div>
                </div>
                {/* Tên, số điện thoại, mối quan hệ với CTV*/}
                {contactPersons?.map((inputField, index) => (
                  <div
                    style={{ alignItems: "center" }}
                    className="collaborator-information__input-field"
                  >
                    <div className="collaborator-information__input-field--child">
                      <InputTextCustom
                        type="text"
                        name="name_relative"
                        value={inputField.name_relative}
                        placeHolder={`Người liên hệ ${index + 1}`}
                        onChange={(e) => handleChangeContact(e, index)}
                      />
                    </div>
                    <div className="collaborator-information__input-field--child">
                      <InputTextCustom
                        type="text"
                        name="phone_relative"
                        value={inputField.phone_relative}
                        placeHolder={`Số điện thoại`}
                        onChange={(e) => handleChangeContact(e, index)}
                      />
                    </div>
                    <div className="collaborator-information__input-field--child">
                      <InputTextCustom
                        type="text"
                        name="relation_relative"
                        value={inputField.relation_relative}
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
              </div>
              {/* Thêm người liên hệ */}
              <div style={{ padding: "2px 14px 0px 14px" }}>
                <span
                  onClick={() => handleAddingContact()}
                  className={` ${
                    contactPersons?.length >= 3
                      ? "text-gray-500/60 cursor-not-allowed"
                      : "text-violet-500 cursor-pointer"
                  } duration-300`}
                >
                  Thêm người liên hệ
                </span>
              </div>
              {/* Cập nhật thông tin cộng tác viên */}
              <div style={{ padding: "4px 14px 0px 14px" }}>
                <ButtonCustom
                  label="Cập nhật"
                  onClick={handleUpdateCollaboratorInfo}
                />
              </div>
            </div>
            <div className="collaborator-information__left--card card-shadow">
              {/* Header */}
              <div className="collaborator-information__left--card-header">
                <span>Thông tin ngân hàng</span>
              </div>
              {/* Content */}
              <div className="collaborator-information__left--card-body">
                {/* Số tài khoản, Tên chủ thẻ */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={accountName}
                      placeHolder="Tên chủ thẻ"
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={accountNumber}
                      placeHolder="Số tài khoản"
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                </div>
                {/* Tên ngân hàng */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="select"
                      value={selectBankName}
                      placeHolder="Tên ngân hàng"
                      setValueSelectedProps={setSelectBankName}
                      options={bankList}
                      previewImage={true}
                    />
                  </div>
                </div>
                {/* Tên chi nhánh */}
                <div className="collaborator-information__input-field">
                  <div className="collaborator-information__input-field--child">
                    <InputTextCustom
                      type="text"
                      value={bankBrand}
                      placeHolder="Tên chi nhánh"
                      onChange={(e) => setBankBrand(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Cập nhật tài khoản ngân hàng */}
              <div style={{ padding: "8px 14px 0px 14px" }}>
                <ButtonCustom
                  label="Cập nhật"
                  onClick={handleUpdateAccountBankInfo}
                />
              </div>
            </div>
          </div>
          {/* Container 2 */}
          <div className="collaborator-information__right">
            <div className="collaborator-information__right--card card-shadow">
              {/* Header */}
              <div className="collaborator-information__right--card-header">
                <span className="">Thông tin tài liệu</span>
              </div>
              {/* Content */}
              <div className="collaborator-information__right--card-body">
                {/* Thông tin tổng quan tài liệu */}
                <div className="collaborator-information__right--card-body-overview">
                  <div className="collaborator-information__right--card-body-overview-label">
                    <span>Tổng quan</span>
                  </div>
                  {/* Checkbox */}
                  <div className="collaborator-information__right--card-body-overview-checklist">
                    {/* Thỏa thuận hợp tác */}
                    <div
                      className={`collaborator-information__right--card-body-overview-checklist-checkbox ${
                        deal && "unchecked"
                      }`}
                    >
                      <span className="font-normal">
                        {`${i18n.t("cooperation_agreement", { lng: lang })}`}
                      </span>
                      <input
                        style={{
                          accentColor: "green",
                          height: "16px",
                          width: "16px",
                        }}
                        type="checkbox"
                        checked={deal}
                      />
                    </div>
                    {/* CCCD/CMND */}
                    <div
                      className={`collaborator-information__right--card-body-overview-checklist-checkbox ${
                        identify && "unchecked"
                      }`}
                    >
                      <span>{`${i18n.t("citizen_ID", { lng: lang })}`}</span>
                      <input
                        style={{
                          accentColor: "green",
                          height: "16px",
                          width: "16px",
                        }}
                        type="checkbox"
                        checked={identify}
                      />
                    </div>
                    {/* Sơ yếu lí lịch */}
                    <div
                      className={`collaborator-information__right--card-body-overview-checklist-checkbox ${
                        information && "unchecked"
                      }`}
                    >
                      <span>
                        {`${i18n.t("curriculum_vitae", { lng: lang })}`}
                      </span>
                      <input
                        style={{
                          accentColor: "green",
                          height: "16px",
                          width: "16px",
                        }}
                        type="checkbox"
                        checked={information}
                      />
                    </div>
                    {/* Sổ hộ khẩu */}
                    <div
                      className={`collaborator-information__right--card-body-overview-checklist-checkbox ${
                        registration && "unchecked"
                      }`}
                    >
                      <span>{`${i18n.t("household_book", {
                        lng: lang,
                      })}`}</span>
                      <input
                        style={{
                          accentColor: "green",
                          height: "16px",
                          width: "16px",
                        }}
                        type="checkbox"
                        checked={registration}
                      />
                    </div>
                    {/* Giấy xác nhận hạnh kiểm */}
                    <div
                      className={`collaborator-information__right--card-body-overview-checklist-checkbox ${
                        certification && "unchecked"
                      }`}
                    >
                      <span>
                        {`${i18n.t("certificate_conduct", { lng: lang })}`}
                      </span>
                      <input
                        style={{
                          accentColor: "green",
                          height: "16px",
                          width: "16px",
                        }}
                        type="checkbox"
                        checked={certification}
                      />
                      {/* <Checkbox></Checkbox> */}
                    </div>
                  </div>
                </div>
                {/* Thông tin chi tiết tài liệu */}
                <div
                  className="collaborator-information__right--card-body-upload"
                  style={{
                    maxHeight: `${
                      // Mỗi cái input có height là 52px
                      contactPersons?.length === 3
                        ? "772px"
                        : contactPersons?.length === 2
                        ? "720px"
                        : contactPersons?.length === 1
                        ? "668px"
                        : "616px"
                    }`,
                    // maxHeight: "686px",
                    // padding: "0px 6px",
                    // scrollbarGutter: "stable both-edges",
                  }}
                >
                  {/* Mã hồ sơ */}
                  <div>
                    {/* <InputTextCustom
                      type="text"
                      placeHolder={`${i18n.t("profile_ID", { lng: lang })}`}
                      value={imgProfile}
                      onChange={(e) => setImgProfile(e.target.value)}
                    /> */}
                    <InputTextCustom
                      type="file"
                      placeHolder="Hồ sơ"
                      value={imgProfile}
                      onChangeImage={onChangeImageProfile}
                      setValueSelectedProps={setImgProfile}
                    />
                  </div>
                  {/* CCCD/CMND mặt trước*/}
                  <div>
                    <InputTextCustom
                      type="file"
                      placeHolder="CCCD/CMND (mặt trước)"
                      value={imgIdentifyFronsite}
                      onChangeImage={onChangeIdentifyBefore}
                      setValueSelectedProps={setImgIdentifyFronsite}
                    />
                  </div>
                  {/* CCCD/CMND mặt sau*/}
                  <div>
                    <InputTextCustom
                      type="file"
                      placeHolder="CCCD/CMND (mặt sau)"
                      value={imgIdentifyBacksite}
                      onChangeImage={onChangeIdentifyAfter}
                      setValueSelectedProps={setImgIdentifyBacksite}
                    />
                  </div>
                  {/* Sơ yếu lí lịch */}
                  <div>
                    <InputTextCustom
                      type="file"
                      placeHolder="Sơ yếu lí lịch"
                      multiple
                      value={imgInformation}
                      onChangeImage={onChangeInformation}
                      setValueSelectedProps={setImgInformation}
                    />
                  </div>
                  {/* Sổ hộ khẩu */}
                  <div>
                    <InputTextCustom
                      type="file"
                      placeHolder="Sổ hộ khẩu"
                      multiple
                      value={imgRegistration}
                      onChangeImage={onChangeRegistration}
                      setValueSelectedProps={setImgRegistration}
                    />
                  </div>
                  {/* Giấy xác nhận hạnh kiểm */}
                  <div>
                    <InputTextCustom
                      type="file"
                      placeHolder="Giấy xác nhận hạnh kiểm"
                      multiple
                      value={imgCertification}
                      onChangeImage={onChangeCertification}
                      setValueSelectedProps={setImgCertification}
                    />
                  </div>
                </div>
              </div>
              {/* Cập nhật thông tin tài liệu */}
              <div style={{ padding: "8px 22px" }}>
                <ButtonCustom
                  label="Cập nhật"
                  onClick={handleUpdateCollaboratorDocument}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <>
        <Form>
          <div>
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
              <Col lg="6">
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
            <Row>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("phone", { lng: lang })}`}
                  type="number"
                  value={phone}
                  disabled={true}
                />
              </Col>
            </Row>
            <Row>
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
            <Row>
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
            <Row>
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
            <Row>
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
            <Row>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("Tỉnh/Thành phố làm việc", { lng: lang })}`}
                  value={codeCity}
                  select={true}
                  options={cityOption}
                  style={{ width: "100%" }}
                  // onChange={onChangeCity}
                />
              </Col>
              <Col lg="6">
                <InputCustom
                  title={`${i18n.t("Quận/huyện làm việc", { lng: lang })}`}
                  value={codeDistrict}
                  options={districtsOption}
                  style={{ width: "100%" }}
                  // onChange={onChangeDistrict}
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
                  // onChange={(e) => onChangeNumberIndentity(e)}
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

                    // onChange={(e) => {
                    //   searchCollaborator(e.target.value);
                    //   searchValue(e.target.value);
                    // }}
                  />

                  {dataCollaborator.length > 0 && (
                    <List type={"unstyled"}>
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
                            <p>
                              {item?.full_name} - {item?.phone} -{item?.id_view}{" "}
                              - {item?.invite_code}
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
          <Button onClick={handleUpdateCollaboratorInfo}>
            {`${i18n.t("update", { lng: lang })}`}
          </Button>
        </Form>
      </> */}
    </>
  );
};

export default Information;
