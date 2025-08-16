// context/PlayerContext.ts
// @ts-ignore
import createDataContext from './createDataContext';
import * as playerActions from './actions/playerActions';
import * as cheatSheetActions from './actions/cheatSheetActions';
import { State, Action } from '../utils/types';

const actions = {
  ...playerActions,
  ...cheatSheetActions
}

// --- REDUCER ---
const AppReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'set_players':
      return { ...state, players: action.payload };
    case 'set_cheat_sheets':
      return { ...state, cheatSheets: action.payload };
    default:
      return state;
  }
};

const initialState = {
  players: [],
  cheatSheets: []
}

export const { Context: AppContext, Provider: AppProvider } = createDataContext(
  AppReducer,
  actions,
  initialState
);
