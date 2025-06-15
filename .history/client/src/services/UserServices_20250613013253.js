import { fetchDataFromApi } from "../utils/api";

export const getUsers = async () => {
  const response = fetchDataFromApi("/user");
  return response;
};

export const getUserById = async (id) => {
  const response = fetchDataFromApi(`/user/${id}`);
  return response;
};
