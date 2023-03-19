import axios from "axios";
import { BASE_URL } from "../config/config";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
