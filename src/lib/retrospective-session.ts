export function isValidCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isValidTime(value: string) {
  return value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isCompletedDateTime(date: string, time: string, now = new Date()) {
  if (!isValidCalendarDate(date) || !isValidTime(time)) return false;
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (date < localToday) return true;
  if (date > localToday) return false;
  if (!time) return true;
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return time <= currentTime;
}

export const RETROSPECTIVE_LOG_NOTICE = "This log records a session already completed with appropriate safety in place. It does not create, time, schedule, or progress breath-hold work.";

