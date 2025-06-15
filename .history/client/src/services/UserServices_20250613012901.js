import { baseUrl, fetchDataFromApi } from "../utils/api";

const endpoint = `${baseUrl}/user`;
export const getUsers = async () => {
  const response = fetchDataFromApi("/user");
  return response;
};
