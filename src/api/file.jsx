import axiosClient from "../axios";

export const postFile = (data, header) => {
  return axiosClient.post("/cloudinary/cloudinary/upload", data, header);
};
