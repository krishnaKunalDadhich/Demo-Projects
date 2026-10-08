import { getState, updateState } from './state.js';
import { saveState } from './storage.js';

// A small static JSON endpoint gives the lab project a realistic Fetch API boundary
// without requiring a backend, credentials or an external service.
export const loadProductivitySnapshot = async () => {
  try {
    const response = await fetch('./assets/productivity.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Snapshot request failed: ${response.status}`);
    const data = await response.json();
    updateState(state => ({ ...state, statistics: { ...state.statistics, snapshot: data, lastSync: new Date().toISOString() } }));
    saveState(getState());
    return { ok: true, data };
  } catch (error) {
    // The app remains usable even if the static asset cannot be fetched.
    updateState(state => ({ ...state, statistics: { ...state.statistics, lastSyncError: error.message } }));
    return { ok: false, error };
  }
};
