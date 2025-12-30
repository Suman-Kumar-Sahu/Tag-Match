import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/ats", 
});

export const uploadResume = (data) => {
  return API.post("/analyze", data);
};