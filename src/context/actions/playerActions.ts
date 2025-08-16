// src/context/actions/playerActions.ts
import { fetchAllPlayers } from '../../services/api';
import { Dispatch } from 'react';
import { Player } from '../../utils/types';

export const loadPlayers = (dispatch: Dispatch<any>) => {
  return async () => {
    try {
      const players: Player[] = await fetchAllPlayers();
      dispatch({ type: 'set_players', payload: players });
    } catch (e) {
      console.error('[loadPlayers] Failed to fetch all players', e);
    }
  };
};
