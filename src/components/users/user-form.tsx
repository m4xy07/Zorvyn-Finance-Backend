"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AppUser, UserRole, UserStatus } from "@/types";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

interface UserFormProps {
  selectedUser: AppUser | null;
  loading?: boolean;
  onSubmit: (values: UserFormValues, userId?: string) => Promise<void>;
  onCancelEdit: () => void;
}

const initialValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
  status: "active",
};

export function UserForm({ selectedUser, loading, onSubmit, onCancelEdit }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>(() => {
    if (!selectedUser) {
      return initialValues;
    }

    return {
      name: selectedUser.name,
      email: selectedUser.email,
      password: "",
      role: selectedUser.role,
      status: selectedUser.status,
    };
  });

  const isEditMode = !!selectedUser;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values, selectedUser?.id);

    if (!isEditMode) {
      setValues(initialValues);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="text-sm font-semibold text-[var(--text)]">
        {isEditMode ? "Edit User" : "Create User"}
      </h3>

      <div className="grid gap-3 md:grid-cols-2">
        <Input
          placeholder="Full name"
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Input
          type="email"
          placeholder="email@company.com"
          value={values.email}
          onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Select
          value={values.role}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, role: event.target.value as UserRole }))
          }
        >
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </Select>

        <Select
          value={values.status}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, status: event.target.value as UserStatus }))
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <Input
          type="password"
          placeholder={isEditMode ? "Leave blank to keep password" : "Temporary password"}
          value={values.password}
          onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
          required={!isEditMode}
        />
      </div>

      <div className="flex justify-end gap-2">
        {isEditMode ? (
          <Button variant="ghost" onClick={onCancelEdit}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditMode ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
