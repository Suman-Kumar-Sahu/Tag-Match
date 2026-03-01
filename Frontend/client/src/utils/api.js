import axios from "axios";

const API = axios.create({
  baseURL: "https://tag-match.onrender.com", 
  //http://localhost:3000/api/ats
});

export const uploadResume = (data) => {
  return API.post("/analyze", data);
};

export const aiAnalyzeResume = (data) => {
  return API.post("/ai-analyze", data);
};