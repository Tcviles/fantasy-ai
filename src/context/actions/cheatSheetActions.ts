// context/actions/cheatSheetActions.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'react';
import { CheatSheet } from '../../utils/types';

const STORAGE_KEY = 'cheatSheets';

export const loadCheatSheets = (dispatch: Dispatch<any>) => {
  return async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      dispatch({ type: 'set_cheat_sheets', payload: parsed });
    } catch (e) {
      console.error('[loadCheatSheets] Failed:', e);
    }
  };
};

export const addCheatSheet = (dispatch: Dispatch<any>, getState: () => any) => {
  return async (newSheet: CheatSheet) => {
    try {
      const { cheatSheets = [] } = getState();
      const updated = [...cheatSheets.filter((s: CheatSheet) => s.name !== newSheet.name), newSheet];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      dispatch({ type: 'set_cheat_sheets', payload: updated });
    } catch (e) {
      console.error('[addCheatSheet] Failed:', e);
    }
  };
};

export const deleteCheatSheet = (dispatch: Dispatch<any>, getState: () => any) => {
  return async (name: string) => {
    try {
      const { cheatSheets = [] } = getState();
      const updated = cheatSheets.filter((s: CheatSheet) => s.name !== name);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      dispatch({ type: 'set_cheat_sheets', payload: updated });
    } catch (e) {
      console.error('[deleteCheatSheet] Failed:', e);
    }
  };
};
