// All dates are "YYYY-MM-DD" strings, computed in UTC so the browser timezone can't shift them.

const OFFICE_TZ = "Europe/Amsterdam";
const DAY_MS = 86_400_000;

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);

export const todayInOffice = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: OFFICE_TZ });

export const addDays = (iso: string, n: number) =>
  toIso(new Date(toDate(iso).getTime() + n * DAY_MS));

/** 1 = Monday ... 7 = Sunday */
export const isoWeekday = (iso: string) => ((toDate(iso).getUTCDay() + 6) % 7) + 1;

export const weekStart = (iso: string) => addDays(iso, 1 - isoWeekday(iso));

/** The date itself on a weekday, otherwise the next Monday. */
export const nextWeekday = (iso: string) =>
  isoWeekday(iso) > 5 ? addDays(iso, 8 - isoWeekday(iso)) : iso;

export const weekDays = (iso: string) =>
  Array.from({ length: 5 }, (_, i) => addDays(weekStart(iso), i));

export const isoWeekNumber = (iso: string) => {
  const thursday = toDate(addDays(weekStart(iso), 3));
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  return Math.ceil(((thursday.getTime() - yearStart) / DAY_MS + 1) / 7);
};

const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
  toDate(iso).toLocaleDateString("en-GB", { ...options, timeZone: "UTC" });

export const formatWeekday = (iso: string) => format(iso, { weekday: "short" });
export const formatDayNumber = (iso: string) => format(iso, { day: "numeric" });
export const formatMonthYear = (iso: string) =>
  format(iso, { month: "long", year: "numeric" });
