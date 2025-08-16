export type RootStackParamList = {
  Menu: undefined;
  Compare: undefined;
  Dev: undefined;
  KeeperCalc: undefined;
  CheatSheet: undefined;
  DraftChecklist: undefined;
  DraftChecklistView: { sheet: any };
  EditCheatSheet: { cheatSheetId?: string } | undefined;
  CheatSheetChecklist: { cheatSheet: any };
};

export type Action = {
    type: string
    payload: any
}

export type State = {
  players: Player[]
}

export type ChecklistItem = Player & { drafted?: boolean } | { type: 'tier', title: string };

export function isPlayerItem(item: ChecklistItem): item is Player & { drafted?: boolean } {
  return !('type' in item);
}

export type Player = {
  player_id: string | number;   // allow both from APIs
  first_name: string;
  last_name: string;
  team: string;
  position: string;
  is_injured?: boolean;
  is_favorite?: boolean;
};

export type CheatSheet = {
  id: string;
  name: string;
  players: Player[];
  modified?: string;
  notes?: string;
};

export type KeeperRecPlayer = {
  player: string;
  team: string;
  keep_round: number;
  keep_pick: number;
  keep_overall: number;
  estimated_adp_overall: number;
  value_vs_adp: number;     // + good, - bad
  capital_weight?: number;  // new
  adjusted_value?: number;  // new (used for sorting)
  risk_notes?: string[];
  reasoning: string;
};

export type KeeperRecResponse = {
  assumptions?: { opponent_keepers?: number; notes?: string };
  recommendations: {
    keep: KeeperRecPlayer[];
    bench: KeeperRecPlayer[];
  };
  summary?: string;
};

