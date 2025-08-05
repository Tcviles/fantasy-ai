import axios from 'axios';

const API_URL = 'https://zymj4plc0e.execute-api.us-east-1.amazonaws.com/Prod';

export const fetchPlayersByPosition = async (position: string) => {
  const url = `${API_URL}/players?position=${position}`;
  console.log(`[API] GET ${url}`);
  const res = await axios.get(url);
  console.log(res)
  return res.data;
};

export const startSync = async () => {
  const url = `${API_URL}/start-sync`;
  console.log(`[API] POST ${url}`);
  const res = await axios.post(url);
  return res.data;
};

export const comparePlayers = async (players: any[]) => {
  const url = `${API_URL}/compare`;
  const response = await axios.post(url, { players });
  return response.data.recommendation;
};