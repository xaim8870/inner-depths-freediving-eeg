// Display formatting shared by the UI. Dates from the database are calendar dates ("YYYY-MM-DD").

export function formatDate(value: string, withYear = false) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

export function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function formatDepth(meters: number) {
  return `${Number.isInteger(meters) ? meters : meters.toFixed(1)} m`;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}
