import { axiosPrivate } from "../axios/axiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { logoutReducer } from "../redux/slice/usersSlice";

const useAxiosPrivate = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const requestInterceptors = axiosPrivate.interceptors.request.use(
      (config) => {
        if (config.headers === undefined) config.headers = {};
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.token}`;
          ``;
        }
        return config;
      },
      (e) => {
        return Promise.reject(e);
      }
    );

    const responseInterceptors = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (e) => {
        if (e?.response?.status === 401) {
          message.info("You have been logged out");
          dispatch(logoutReducer());
          navigate("/login");
          return Promise.reject(e);
        }
        return Promise.reject(e);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptors);
      axiosPrivate.interceptors.request.eject(requestInterceptors);
    };
  }, [user]);

  return axiosPrivate;
};

export default useAxiosPrivate;
