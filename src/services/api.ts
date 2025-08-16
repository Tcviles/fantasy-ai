import axios from 'axios';
import { KeeperRecResponse } from '../utils/types';

const API_URL = 'https://zymj4plc0e.execute-api.us-east-1.amazonaws.com/Prod';

export const fetchAllPlayers = async () => {
  const url = `${API_URL}/players`;
  console.log('[API] GET', url);

  try {
    const res = await axios.get(url); // No params
    const data = Array.isArray(res.data) ? res.data : res.data?.players || [];
    console.log(`[API] Loaded ${data.length} players`);
    return data;
  } catch (error: any) {
    console.error('[API] Error fetching all players:', error?.response?.data || error.message);
    throw error;
  }
};


export const fetchPlayersByPosition = async (pos: string, team?: string) => {
  const url = `${API_URL}/players`;
  const params: Record<string, string> = { position: pos };
  if (team) params.team = team;

  console.log('[API] GET', url, params);

  try {
    const res = await axios.get(url, { params });
    const count = Array.isArray(res.data) ? res.data.length : (res.data?.players?.length ?? 0);
    console.log(`[API] ${res.status} ${res.statusText} — ${count} players`);
    return res.data;
  } catch (error: any) {
    console.error('[API] Error fetching players:', error?.response?.data || error.message);
    throw error;
  }
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

export const getKeeperRecommendations = async (
  league: {
    teams: number;
    format: string;
    qb_slots: number;
    your_slot: number;
    keepers_allowed: number;
  },
  players: {
    player: string;
    keeper_overall: number;
    meta: { round: number; pick: number; team_abbr: string };
  }[]
): Promise<KeeperRecResponse> => {
  const url = `${API_URL}/keepers`;
  console.log(`[API] POST ${url}`, { league, players });
  const res = await axios.post(url, { league, players });
  return res.data as KeeperRecResponse;
};

