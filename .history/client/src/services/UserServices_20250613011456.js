import { fetchDataFromApi } from "../utils/api";

export const getUsers = async () => {
  const response = fetchDataFromApi("/api/user/signin");
  return response;
};
