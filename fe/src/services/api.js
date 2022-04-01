import axios from 'axios';

const {
  API_URL
} = process.env

console.log("API_URL", API_URL)
export default function api({ headers }) {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers
  });

  return instance;
}
