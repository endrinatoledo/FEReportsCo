const axios = require('axios').default;
const token = localStorage.getItem("token")
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {'Authorization': `bearer ${token}`}
  });
export default instance;