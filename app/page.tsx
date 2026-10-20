import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { todayInOffice } from "@/lib/dates";
import WeekPicker from "@/components/WeekPicker";
import UserMenu from "@/components/UserMenu";
import type { Attendance, Person } from "@/lib/types";

type AttendanceRow = {
  date: string;
  user_id: string;
  profiles: { name: string | null; avatar_url: string | null } | null;
};

async function signOut() {
  "use server";
  await (await createClient()).auth.signOut();
  redirect("/login");
}

type Claims = { sub: string; user_metadata?: { full_name?: string; avatar_url?: string } };

const personFromClaims = ({ sub, user_metadata }: Claims): Person => ({
  id: sub,
  name: user_metadata?.full_name ?? null,
  avatarUrl: user_metadata?.avatar_url ?? null,
});

async function Header() {
  const { data } = await (await createClient()).auth.getClaims();
  const claims = data!.claims;
  return <UserMenu person={personFromClaims(claims)} signOut={signOut} />;
}

async function Week() {
  const supabase = await createClient(); // also opts out of prerendering, "today" changes
  const today = todayInOffice();
  const { data: auth } = await supabase.auth.getClaims();
  const { data } = await supabase
    .from("attendance")
    .select("date, user_id, profiles(name, avatar_url)")
    .gte("date", today)
    .overrideTypes<AttendanceRow[], { merge: false }>();

  const attendances: Attendance[] = (data ?? []).map((row) => ({
    date: row.date,
    person: { id: row.user_id, name: row.profiles?.name ?? null, avatarUrl: row.profiles?.avatar_url ?? null },
  }));

  return <WeekPicker today={today} me={personFromClaims(auth!.claims)} initialAttendances={attendances} />;
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-4">
      <header className="flex w-full max-w-md justify-end">
        <Suspense>
          <Header />
        </Suspense>
      </header>
      <Suspense fallback={<p>Loading…</p>}>
        <Week />
      </Suspense>
    </main>
  );
}
