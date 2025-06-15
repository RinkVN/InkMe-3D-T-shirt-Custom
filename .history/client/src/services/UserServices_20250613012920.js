import { fetchDataFromApi } from "../utils/api";

export const getUsers = async () => {
  const response = fetchDataFromApi("/user");
  return response;
};
