// cheatSheetHelpers.ts
import { CheatSheet, ChecklistItem, isPlayerItem, Player, TierItem } from './types';
import uuid from 'react-native-uuid';
import { getDataFromAsyncStorage, saveDataToAsyncStorage } from './asyncStorageHelper';

export const getPlayerRank = (players: any[], index: number): number => {
  let rank = 1;

  if (index < 0 || index >= players.length || !players[index]) return rank;

  for (let i = 0; i < index; i++) {
    if (players[i] && players[i].type !== 'tier') rank++;
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
    type: 'tier' as const,
    id: uuid.v4() as string,
    title: `Tier ${tierCount + 1}`,
  };
};

export const updatePlayerRank = (
  players: ChecklistItem[],
  selectedPlayerIndex: number,
  newRank: number
): ChecklistItem[] => {
  const totalPlayers = players.filter(p => p.type !== 'tier').length;
  if (newRank < 1 || newRank > totalPlayers) throw new Error('Invalid rank');

  const targetIndex = getIndexOfRankedPlayer(players, newRank);
  return moveItem(players, selectedPlayerIndex, targetIndex);
};

export const removePlayer = (
  players: ChecklistItem[],
  player_id: string | number
): ChecklistItem[] => {
  return players.filter((p: any) => p.player_id !== player_id);
};

export const moveTierToRank = (
  players: ChecklistItem[],
  tierIndex: number,
  moveAboveRank: number
): ChecklistItem[] => {
  const targetIndex = getIndexOfRankedPlayer(players, moveAboveRank);
  return moveItem(players, tierIndex, targetIndex);
};
