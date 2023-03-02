import axiosClient from "../axios";

export const googlePlaceAutocomplete = (value) => {
  return axiosClient.get(`/goong/auto_complete?input=${value}`);
};

export const getPlaceDetailApi = (id) => {
  return axiosClient.get(`/goong/place_detail?place_id=${id}`);
};
