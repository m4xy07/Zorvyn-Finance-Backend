"use client";

import { AppUser } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onToggleStatus: (user: AppUser) => void;
}

export function UsersTable({ users, onEdit, onToggleStatus }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="data-table w-full min-w-[760px] text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-[var(--muted)]">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="text-[var(--text)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--surface-muted),transparent_55%)]"
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="info">{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.status === "active" ? "success" : "warning"}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => onEdit(user)}>
                      Edit
                    </Button>
                    <Button
                      variant={user.status === "active" ? "danger" : "primary"}
                      className="h-8 px-3 text-xs"
                      onClick={() => onToggleStatus(user)}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
