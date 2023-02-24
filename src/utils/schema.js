import * as Yup from "yup";
const requiredErrorMessage = "Vui lòng điền đầy đủ thông tin";
const validPhoneMessage = "Vui lòng điền đúng định dạng sđt";
const validEmailMessage = "Vui lòng điền đúng định dạng email";
const validPasswordMessage = "Password phải có ít nhất 8 ký tự, 1 chữ số";
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const regexPhone =
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
const regexEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateLoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(regexEmail, validEmailMessage)
    .required(requiredErrorMessage),
  // password: Yup.string()
  //   .min(8, validPasswordMessage)
  //   .required(requiredErrorMessage),
  // .matches(regexPassword, validPasswordMessage),
});

const validateAddCustomerSchema = Yup.object().shape({
  // code_phone_area: Yup.string().required(requiredErrorMessage),
  phone: Yup.string()
    .matches(regexPhone, validPhoneMessage)
    .required(requiredErrorMessage),
  password: Yup.string()
    .min(8, validPasswordMessage)
    .required(requiredErrorMessage)
    .matches(regexPassword, validPasswordMessage),
  name: Yup.string().required(requiredErrorMessage),
});

const validateAddCollaboratorSchema = Yup.object().shape({
  // code_phone_area: Yup.string().required(requiredErrorMessage),
  phone: Yup.string()
    .matches(regexPhone, validPhoneMessage)
    .required(requiredErrorMessage),
  email: Yup.string(),
  name: Yup.string().required(requiredErrorMessage),
  identify: Yup.string().required(requiredErrorMessage),
});

const validateAddGroupServiceSchema = Yup.object().shape({
  titleVN: Yup.string().required(requiredErrorMessage),
  titleEN: Yup.string().required(requiredErrorMessage),
  descriptionVN: Yup.string().required(requiredErrorMessage),
  descriptionEN: Yup.string().required(requiredErrorMessage),
  identify: Yup.string().required(requiredErrorMessage),
});

export {
  validateLoginSchema,
  validateAddCustomerSchema,
  validateAddCollaboratorSchema,
  validateAddGroupServiceSchema,
};
