import axios from "axios";

export const $api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4000/user",
});
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `bearer ${localStorage.getItem("token")}`;
  return config;
});
$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    const { data } = await axios.get("http://localhost:4000/user/refresh", {
      withCredentials: true,
    });
    localStorage.setItem("token", data.accessToken);
    return $api.request(originalRequest);
  }
);
