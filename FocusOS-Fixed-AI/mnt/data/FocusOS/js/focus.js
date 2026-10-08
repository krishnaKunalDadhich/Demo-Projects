import { getState, updateState } from './state.js';
import { saveState } from './storage.js';
import { uid, todayISO } from './utils.js';
import { browserNotify, notify } from './notifications.js';

// One interval owns the entire FocusOS timer lifecycle. UI rendering is
// deliberately decoupled from the interval so the Focus view is not rebuilt
// every second (the previous implementation caused visible flicker).
let interval = null;
const durations = { Focus: 25 * 60, 'Short Break': 5 * 60, 'Long Break': 15 * 60 };

const emitTick = () => {
  window.dispatchEvent(new CustomEvent('focusos:tick', { detail: getState().focus }));
};

export const initFocus = () => {
  const f = getState().focus;
  if (!f.remaining) {
    updateState(s => ({ ...s, focus: { ...s.focus, remaining: durations[s.focus.mode] } }));
  }
  emitTick();
};

export const getFocus = () => getState().focus;

export const startFocus = (durationMinutes = null) => {
  if (interval) return false;

  updateState(s => {
    const nextRemaining = Number.isFinite(durationMinutes) && durationMinutes > 0
      ? Math.round(durationMinutes * 60)
      : s.focus.remaining || durations[s.focus.mode];
    return { ...s, focus: { ...s.focus, remaining: nextRemaining, initialDuration: nextRemaining, running: true } };
  });

  saveState(getState());
  emitTick();
  interval = setInterval(tick, 1000);
  return true;
};

export const pauseFocus = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  updateState(s => ({ ...s, focus: { ...s.focus, running: false } }));
  saveState(getState());
  emitTick();
};

export const resetFocus = () => {
  pauseFocus();
  updateState(s => ({
    ...s,
    focus: { ...s.focus, running: false, remaining: durations[s.focus.mode], initialDuration: durations[s.focus.mode] }
  }));
  saveState(getState());
  emitTick();
};

export const skipFocus = () => {
  pauseFocus();
  transition(getState().focus.mode === 'Focus' ? 'Short Break' : 'Focus');
  saveState(getState());
};

export const setMode = mode => {
  if (!durations[mode]) return;
  pauseFocus();
  updateState(s => ({ ...s, focus: { ...s.focus, mode, remaining: durations[mode], initialDuration: durations[mode], running: false } }));
  saveState(getState());
  emitTick();
};

function tick() {
  const f = getState().focus;
  if (!f.running || f.remaining <= 1) {
    completeSession();
    return;
  }

  updateState(s => ({ ...s, focus: { ...s.focus, remaining: s.focus.remaining - 1 } }));
  emitTick();
}

function completeSession() {
  const f = getState().focus;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  if (f.mode === 'Focus') {
    const completedMinutes = Math.max(1, Math.round((f.initialDuration || durations.Focus) / 60));
    updateState(s => ({
      ...s,
      focusSessions: [...s.focusSessions, {
        id: uid('focus'),
        date: todayISO(),
        minutes: completedMinutes,
        mode: 'Focus',
        completed: true
      }],
      focus: { ...s.focus, running: false, sessionCount: s.focus.sessionCount + 1 }
    }));
    browserNotify('Focus session complete', 'Great work. Time for a break.');
    notify('Focus session complete. Take a short break.', 'success');
    transition('Short Break');
  } else {
    browserNotify('Break complete', 'Ready for another focus session?');
    notify('Break complete. Ready to focus?', 'success');
    transition('Focus');
  }

  saveState(getState());
  window.dispatchEvent(new CustomEvent('focusos:complete', { detail: getState().focus }));
}

function transition(mode) {
  updateState(s => ({
    ...s,
    focus: { ...s.focus, mode, remaining: durations[mode], running: false, initialDuration: durations[mode] }
  }));
  emitTick();
}
