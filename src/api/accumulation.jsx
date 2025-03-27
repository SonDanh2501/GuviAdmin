import axiosClient from "../axios";

export const getCurrentLeaderBoardApi = () => {
    return axiosClient.get("api/admin/accumulation/get_current_leader_board");
  };
  