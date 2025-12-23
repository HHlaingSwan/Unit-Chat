import axios from "axios";

const axios = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5500/api"
      : import.meta.env.VITE_API_URL,
});

export default axios;
