import axiosClient from "../axios";

export const getFeedbackApi = (start, length) => {
  return axiosClient.get(
    `/admin/feedback_manager/get_list?start=${start}&length=${length}`
  );
};

export const searchFeedbackApi = (payload) => {
  return axiosClient.get(
    `/admin/feedback_manager/get_list?search=${payload}&start=0&length=20`
  );
};

export const deleteFeedbackApi = (id) => {
  return axiosClient.post(`/admin/feedback_manager/delete_feedback/${id}`);
};

//examtest

export const getListTestCollaboratorApi = (start, length) => {
  return axiosClient.get(
    `/admin/info-test-collaborator/get_list?start=${start}&length=${length}`
  );
};

export const getDetailsTestCollaboratorApi = (id) => {
  return axiosClient.get(
    `/admin/info-test-collaborator/detail_info_test/${id}`
  );
};

export const getDataReviewCollaborator = (
  start,
  length,
  start_date,
  end_date,
  star,
  // search,
  // type,
  // city,
  // district
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_review?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&star=${star}`
  );
};

export const updateProcessHandleReview = (payload) => {
  return axiosClient.post(
    `/admin/order_manager/update_process_review_order`,
    payload
  )
}


export const getFeedback = (search, start, length) => {
  return axiosClient.get(
    `/admin/feedback_manager/get_list?search=${search}&start=${start}&length=${length}`
  );
};


export const updateProcessHandleFeedback = (idFeedback, payload) => {
  return axiosClient.post(
    `/admin/feedback_manager/update_process_handle_feedback/${idFeedback}`,
    payload
  )
}