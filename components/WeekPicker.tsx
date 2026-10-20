"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Attendance, Person } from "@/lib/types";
import { celebrate } from "@/lib/celebrate";
import { Avatar, AvatarStack } from "@/components/Avatar";
import {
  addDays,
  formatDayNumber,
  formatMonthYear,
  formatWeekday,
  isoWeekNumber,
  nextWeekday,
  weekDays,
  weekStart,
} from "@/lib/dates";

type Props = { today: string; me: Person; initialAttendances: Attendance[] };

export default function WeekPicker({ today, me, initialAttendances }: Props) {
  const firstDay = nextWeekday(today);
  const currentWeek = weekStart(firstDay);

  const [week, setWeek] = useState(currentWeek);
  const [selected, setSelected] = useState(firstDay);
  const [attendances, setAttendances] = useState(initialAttendances);
  const [error, setError] = useState("");

  const peopleOn = (day: string) =>
    attendances.filter((a) => a.date === day).map((a) => a.person);
  const selectedPeople = peopleOn(selected);
  const isGoing = selectedPeople.some((p) => p.id === me.id);

  const toggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const previous = attendances;
    setError("");
    if (!isGoing) celebrate(event.currentTarget);
    setAttendances(
      isGoing
        ? attendances.filter(
            (a) => !(a.date === selected && a.person.id === me.id),
          )
        : [...attendances, { date: selected, person: me }],
    );

    const attendance = createClient().from("attendance");
    const { error } = isGoing
      ? await attendance.delete().eq("date", selected)
      : await attendance.insert({ date: selected });

    if (error) {
      setAttendances(previous);
      setError(error.message);
    }
  };

  const goToWeek = (start: string) => {
    setWeek(start);
    setSelected(start === currentWeek ? firstDay : start);
  };

  return (
    <section className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <button
          aria-label="Previous week"
          disabled={week === currentWeek}
          onClick={() => goToWeek(addDays(week, -7))}
          className="rounded-lg border bg-surface p-2 disabled:opacity-30"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold">
          {formatMonthYear(week)}, Week {isoWeekNumber(week)}
        </h2>
        <button
          aria-label="Next week"
          onClick={() => goToWeek(addDays(week, 7))}
          className="rounded-lg border bg-surface p-2"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-5 overflow-hidden rounded-xl border bg-surface shadow-card">
        {weekDays(week).map((day) => {
          const isPast = day < today;
          const isSelected = day === selected;
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => setSelected(day)}
              className={`flex flex-col items-center gap-1 py-3 disabled:opacity-30 ${
                isSelected ? "bg-primary text-white" : ""
              }`}
            >
              <span className="text-xs">{formatWeekday(day)}</span>
              <span className="text-lg font-semibold">
                {formatDayNumber(day)}
              </span>
              <AvatarStack people={peopleOn(day)} />
            </button>
          );
        })}
      </div>

      <button
        onClick={toggle}
        className={`w-full rounded-full py-3 font-semibold ${
          isGoing ? "border bg-surface" : "btn-primary"
        }`}
      >
        {isGoing ? "Kom toch neet..." : "Ich bin dao!"}
      </button>
      {error && <p className="text-center text-red-600">{error}</p>}

      <ul className="space-y-2">
        {selectedPeople.length === 0 && (
          <li className="text-center text-muted">Nog neemes dea kump... 🦗</li>
        )}
        {selectedPeople.map((person) => (
          <li key={person.id} className="flex items-center gap-3">
            <Avatar person={person} />
            {person.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
