export type Person = { id: string; name: string | null; avatarUrl: string | null };

export type Attendance = { date: string; person: Person };
