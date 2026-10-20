"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import type { Person } from "@/lib/types";

type Props = { person: Person; signOut: () => Promise<void> };

export default function UserMenu({ person, signOut }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1 outline-none hover:bg-elevated data-[state=open]:bg-elevated">
        <Avatar person={person} />
        <span className="truncate text-sm">{person.name?.split(" ")[0] ?? "Account"}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="min-w-40 rounded-lg border bg-surface p-1 shadow-card"
        >
          <DropdownMenu.Item
            onSelect={() => signOut()}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none data-[highlighted]:bg-elevated"
          >
            <LogOut size={16} />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
