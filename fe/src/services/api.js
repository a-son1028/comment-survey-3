import axios from 'axios';

export default function api({ headers }) {
  const instance = axios.create({
    baseURL: `http://localhost:3333`,
    timeout: 60000,
    headers
  });

  return instance;
}
