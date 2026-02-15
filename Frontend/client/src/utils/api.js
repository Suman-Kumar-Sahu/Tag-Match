import axios from "axios";

const API = axios.create({
  baseURL: "https://tag-match.onrender.com/api/ats/", 
});

export const uploadResume = (data) => {
  return API.post("analyze", data);
};
