import { fetchAllPlayers } from "../services/api";
import { Player } from "../utils/types";

type Action =
  | { type: 'set_players'; payload: Player[] }

export const playersReducer = (state: Player[] = [], action: Action): Player[] => {
  switch (action.type) {
    case 'set_players':
      return action.payload;
    default:
      return state;
  }
};

export const loadPlayers = (dispatch: any) => async () => {
  try {
    const data = await fetchAllPlayers();
    dispatch({ type: 'set_players', payload: data });
  } catch (e) {
    console.error('[Redux] Failed to load players', e);
  }
};
