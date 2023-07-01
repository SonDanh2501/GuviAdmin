import axiosClient from "../axios";

export const postFile = (data, header) => {
  return axiosClient.post(`/image/upload`, data, header);
};

export const postMutipleFile = (data, header) => {
  return axiosClient.post(`/image/upload`, data, header);
};

export const getDistrictApi = () => {
  return axiosClient.get(
    "/admin/aministrative_division_manager/get_aministrative_division?lang=vi"
  );
};

export const getListImageApi = (start, length) => {
  return axiosClient.get(
    `/admin/file_manager/get_list?lang=vi&start=${start}&length=${length}`
  );
};

export const deleteFileImage = (data) => {
  return axiosClient.post(`/admin/file_manager/delete_file`, data);
};
