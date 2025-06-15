import { baseUrl, fetchDataFromApi } from "../utils/api";

const endpoint = `${baseUrl}/user`;
export const getUsers = () => {
  const response = fetchDataFromApi(endpoint);
  return response;
};

export const getUserById = (id) => {
  const response = fetchDataFromApi(`${endpoint}/${id}`);
  return response;
};
