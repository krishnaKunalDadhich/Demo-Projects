import { todayISO } from '../utils.js';

const endpoint = '/api/ai';

const compactTask = (task, subjectMap) => ({
  id: task.id,
  title: task.title,
  subject: subjectMap.get(task.subjectId) || 'General',
  category: task.category,
  priority: task.priority,
  status: task.status,
  dueDate: task.dueDate,
  overdue: task.status !== 'Completed' && task.dueDate < todayISO(),
  notes: task.notes || ''
});

export const buildAIContext = state => {
  const subjectMap = new Map(state.subjects.map(s => [s.id, s.name]));
  const now = new Date();
  return {
    now: now.toISOString(),
    localDate: todayISO(),
    localTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    tasks: state.tasks.map(t => compactTask(t, subjectMap)),
    subjects: state.subjects.map(({ id, name, code, teacher }) => ({ id, name, code, teacher })),
    planner: state.schedule,
    focusSessions: state.focusSessions.slice(-30),
    focusState: { mode: state.focus.mode, remaining: state.focus.remaining, running: state.focus.running },
    settings: { theme: state.settings.theme },
  };
};

export const requestAICoach = async (operation, context, taskId = '') => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, context, taskId }),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'AI Coach is temporarily unavailable.');
    return payload.result;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('AI Coach timed out. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const validateAIResponse = (result, operation) => {
  if (!result || typeof result !== 'object') return false;
  if (operation === 'next_action') return typeof result.title === 'string' && typeof result.reason === 'string' && Number.isFinite(Number(result.duration));
  if (operation === 'daily_plan') return Array.isArray(result.blocks);
  if (operation === 'breakdown') return Array.isArray(result.steps) && result.steps.length > 0;
  if (operation === 'weekly_review') return ['strength','weakness','pattern','recommendation'].every(k => typeof result[k] === 'string');
  return false;
};
