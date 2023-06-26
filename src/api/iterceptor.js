import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:8000/api/v1",
  baseURL: "https://weekly-lottery-back-end-rx7c.onrender.com/api/v1",
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;