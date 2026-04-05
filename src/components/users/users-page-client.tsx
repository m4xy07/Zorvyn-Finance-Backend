"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UserForm } from "@/components/users/user-form";
import { UsersTable } from "@/components/users/users-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api-client";
import { AppUser, PaginatedResult } from "@/types";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: "viewer" | "analyst" | "admin";
  status: "active" | "inactive";
}

export function UsersPageClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResult<AppUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const users = await apiFetch<PaginatedResult<AppUser>>(`/api/users?${params.toString()}`);
      setData(users);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSave = async (values: UserFormValues, userId?: string) => {
    setFormLoading(true);

    try {
      const isEdit = Boolean(userId);
      const endpoint = isEdit ? `/api/users/${userId}` : "/api/users";
      const method = isEdit ? "PATCH" : "POST";

      const payload: Record<string, unknown> = {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
      };

      if (values.password.trim()) {
        payload.password = values.password;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json();

      if (!response.ok || !responsePayload.success) {
        throw new Error(responsePayload.message || "Failed to save user");
      }

      toast.success(isEdit ? "User updated" : "User created");
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (user: AppUser) => {
    try {
      const nextStatus = user.status === "active" ? "inactive" : "active";

      const response = await fetch(`/api/users/${user.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to update status");
      }

      toast.success("Status updated");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin</p>
          <h2 className="page-title">User Management</h2>
          <p className="page-subtitle">Create users, assign roles, and control account status.</p>
        </div>

        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            className="w-60"
          />
          <Button variant="secondary" onClick={() => void loadUsers()}>
            Search
          </Button>
        </div>
      </div>

      <UserForm
        key={selectedUser?.id ?? "new-user"}
        selectedUser={selectedUser}
        onSubmit={handleSave}
        loading={formLoading}
        onCancelEdit={() => setSelectedUser(null)}
      />

      {loading && !data ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <Spinner />
        </div>
      ) : data ? (
        <>
          <UsersTable users={data.items} onEdit={setSelectedUser} onToggleStatus={handleToggleStatus} />

          <Card className="flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="text-xs text-[var(--muted)]">
              Page {data.page} of {data.totalPages} - {data.total} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= data.totalPages || loading}
              >
                Next
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-sm text-[var(--danger)]">Unable to load users.</p>
        </Card>
      )}
    </div>
  );
}
