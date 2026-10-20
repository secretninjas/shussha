// Run: node --test lib/dates.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { addDays, isoWeekNumber, isoWeekday, nextWeekday, weekDays, weekStart } from "./dates.ts";

test("week helpers", () => {
  assert.equal(isoWeekday("2026-10-20"), 2); // Tuesday
  assert.equal(weekStart("2026-10-25"), "2026-10-19"); // Sunday -> its Monday
  assert.deepEqual(weekDays("2026-10-20"), [
    "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23",
  ]);
  assert.equal(nextWeekday("2026-10-24"), "2026-10-26"); // Saturday -> Monday
  assert.equal(nextWeekday("2026-10-26"), "2026-10-26");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
});

test("iso week numbers", () => {
  assert.equal(isoWeekNumber("2026-10-20"), 43);
  assert.equal(isoWeekNumber("2027-01-01"), 53); // Fri, still last week of 2026
  assert.equal(isoWeekNumber("2024-12-30"), 1); // Mon, week 1 of 2025
});
