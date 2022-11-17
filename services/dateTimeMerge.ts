import { DateTime } from "luxon";

export default function MergeDateTime(date: Date, time: string): string | Date {
  const ee = date;
  const ff = ee.toString();
  const gg = DateTime.fromISO(ff);
  const hh = gg.set({ hour: parseInt(time.substring(0, 2)) });
  const ii = hh.set({ minute: parseInt(time.substring(3)) });

  if (ii.diff(DateTime.now()).milliseconds < 0) {
    return "Due Date cannot be in the past.";
  }
  const kk = ii.toUTC();
  return kk.toJSDate();
}
