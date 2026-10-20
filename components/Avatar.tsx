import Image from "next/image";
import type { Person } from "@/lib/types";

const SIZE = "h-6 w-6";

export function Avatar({ person }: { person: Person }) {
  const name = person.name ?? "?";

  if (!person.avatarUrl) {
    return (
      <span
        title={name}
        className={`${SIZE} flex items-center justify-center rounded-full bg-elevated text-xs font-semibold text-foreground ring-2 ring-background`}
      >
        {name[0].toUpperCase()}
      </span>
    );
  }
  return (
    <Image
      src={person.avatarUrl}
      alt={name}
      title={name}
      width={48}
      height={48}
      className={`${SIZE} rounded-full ring-2 ring-background`}
    />
  );
}

const MAX_SHOWN = 3;

export function AvatarStack({ people }: { people: Person[] }) {
  const extra = people.length - MAX_SHOWN;

  return (
    <span className="flex h-6 items-center -space-x-2">
      {people.slice(0, MAX_SHOWN).map((person) => (
        <Avatar key={person.id} person={person} />
      ))}
      {extra > 0 && (
        <span
          className={`${SIZE} flex items-center justify-center rounded-full bg-elevated text-xs font-semibold text-muted ring-2 ring-background`}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
