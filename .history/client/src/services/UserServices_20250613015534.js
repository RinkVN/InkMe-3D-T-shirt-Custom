import { baseUrl, fetchDataFromApi, postData } from "../utils/api";

const endpoint = `${baseUrl}/user`;
export const getUsers = () => {
  const response = fetchDataFromApi(endpoint);
  return response;
};

export const getUserById = (id) => {
  const response = fetchDataFromApi(`${endpoint}/${id}`);
  return response;
};

export const Login = async (email, password) => {
  const response = await postData(`${baseUrl}/user/signin`, {
    email,
    password,
  });
  if (response) {
    console.log("Login successfull", response);
  } else {
    console.log("login failed");
  }
};
