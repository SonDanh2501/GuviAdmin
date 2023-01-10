import axiosClient from "../axios";

export const postFile = (data, header) => {
  return axiosClient.post("/cloudinary/cloudinary/upload", data, header);
};

export const postMutipleFile = (data, header) => {
  return axiosClient.post(
    "/cloudinary/cloudinary/uploadMultiple",
    data,
    header
  );
};

export const getDistrictApi = () => {
  return axiosClient.get(
    "/admin/aministrative_division_manager/get_aministrative_division?lang=vi"
  );
};
