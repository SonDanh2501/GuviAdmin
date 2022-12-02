import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getBanners = createActions({
  getBannersRequest: (payload) => payload,
  getBannersSuccess: (payload) => payload,
  getBannersFailure: (err) => err,
});

export const createBanner = createActions({
  createBannerRequest: (payload) => payload,
  createBannerSuccess: (payload) => payload,
  createBannerFailure: (err) => err,
});

export const updateBanner = createActions({
  updateBannerRequest: (payload) => payload,
  updateBannerSuccess: (payload) => payload,
  updateBannerFailure: (err) => err,
});
