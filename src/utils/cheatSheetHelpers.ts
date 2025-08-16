// cheatSheetHelpers.ts
import { Player } from './types';
import uuid from 'react-native-uuid';
import { getDataFromAsyncStorage, saveDataToAsyncStorage } from './asyncStorageHelper';

export const getPlayerRank = (players: any[], index: number): number => {
  let rank = 1;
  for (let i = 0; i < index; i++) {
    if (players[i].type !== 'tier') rank++;
  }
  return rank;
};

export const getIndexOfRankedPlayer = (players: any[], rank: number): number => {
  let playerCount = 0;
  for (let i = 0; i < players.length; i++) {
    if (players[i].type !== 'tier') {
      playerCount++;
      if (playerCount === rank) return i;
    }
  }
  return players.length;
};

export const moveItem = (array: any[], from: number, to: number): any[] => {
  const updated = [...array];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
};

export const isTier = (item: any) => item?.type === 'tier';

export const createBlankCheatSheet = () => ({
  id: uuid.v4(),
  name: 'Untitled',
  players: [],
});

export const autoSaveCheatSheet = async (cheatSheetId: string, name: string, players: any[]) => {
  const updatedSheet = { id: cheatSheetId, name, players };
  await saveDataToAsyncStorage(`cheatSheet-${cheatSheetId}`, updatedSheet);

  const existingList = await getDataFromAsyncStorage('cheatSheets') || [];
  const updatedList = existingList.map((sheet: any) =>
    sheet.id === cheatSheetId ? updatedSheet : sheet
  );
  await saveDataToAsyncStorage('cheatSheets', updatedList);
};

export const createNewTier = (existingPlayers: any[]) => {
  const tierCount = existingPlayers.filter(p => p.type === 'tier').length;
  return {
    type: 'tier',
    id: uuid.v4(),
    title: `Tier ${tierCount + 1}`,
  };
};
