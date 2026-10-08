const KEY='focusos_state_v1';
export const loadState = fallback => { try { const raw=localStorage.getItem(KEY); return raw ? {...fallback,...JSON.parse(raw)} : fallback; } catch(error){ console.error('Storage load failed',error); return fallback; } };
export const saveState = state => { try { localStorage.setItem(KEY,JSON.stringify(state)); return true; } catch(error){ console.error('Storage save failed',error); return false; } };
export const clearData = () => { try { localStorage.removeItem(KEY); return true; } catch(error){ return false; } };
export const hasSavedData = () => { try { return Boolean(localStorage.getItem(KEY)); } catch { return false; } };
