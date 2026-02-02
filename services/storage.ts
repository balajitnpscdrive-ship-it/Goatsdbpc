
import { SystemState, House } from '../types';

const STORAGE_KEY = 'bsrt_house_points_state';

const initialState: SystemState = {
  weeklyPoints: {
    [House.BOSCO]: 0,
    [House.SAVIO]: 0,
    [House.RUVA]: 0,
    [House.THOMAS]: 0,
  },
  championshipPoints: {
    [House.BOSCO]: 0,
    [House.SAVIO]: 0,
    [House.RUVA]: 0,
    [House.THOMAS]: 0,
  },
  history: [],
  weeklyWinners: [],
  lastResetTimestamp: Date.now(),
  studentNames: {},
};

export const loadState = (): SystemState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialState;
  try {
    const parsed = JSON.parse(stored);
    // Ensure studentNames exists for older versions
    if (!parsed.studentNames) {
      parsed.studentNames = {};
    }
    // Migration: If old house names exist, reset to prevent crashes
    if (parsed.weeklyPoints && parsed.weeklyPoints.Red !== undefined) {
      return initialState;
    }
    return parsed;
  } catch {
    return initialState;
  }
};

export const saveState = (state: SystemState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
