// context/PlayerContext.ts
// @ts-ignore
import createDataContext from './createDataContext';
import * as playerActions from './actions/playerActions';
import { State, Action } from '../utils/types';

const actions = {
  ...playerActions
}

// --- REDUCER ---
const AppReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'set_players':
      return { ...state, players: action.payload };
    default:
      return state;
  }
};

const initialState = {
  players: []
}

export const { Context: AppContext, Provider: AppProvider } = createDataContext(
  AppReducer,
  actions,
  initialState
);
