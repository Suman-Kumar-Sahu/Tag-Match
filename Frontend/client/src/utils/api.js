import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/ats",
});

export const uploadResume = (data) =>
    API.post("/analyze", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
});
