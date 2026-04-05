"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { suggestedCategories } from "@/lib/validators";

interface RecordFormValues {
  amount: string;
  type: "income" | "expense";
  category: string;
  date: string;
  notes: string;
}

interface RecordFormProps {
  mode: "create" | "edit";
  recordId?: string;
  initialValues?: Partial<RecordFormValues>;
}

const defaultValues: RecordFormValues = {
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function RecordForm({ mode, recordId, initialValues }: RecordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<RecordFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const normalizedCategories = useMemo(() => [...suggestedCategories].sort(), []);

  const submitLabel = mode === "create" ? "Create Record" : "Update Record";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.category.trim()) {
      toast.error("Category is required");
      return;
    }

    const amount = Number(values.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "create" ? "/api/records" : `/api/records/${recordId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount,
          type: values.type,
          category: values.category,
          date: values.date,
          notes: values.notes,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save record");
      }

      toast.success(mode === "create" ? "Record created" : "Record updated");
      router.push("/records");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
            Amount
          </label>
          <Input
            value={values.amount}
            onChange={(event) => setValues((prev) => ({ ...prev, amount: event.target.value }))}
            type="number"
            min="0"
            step="0.01"
            placeholder="1200"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
            Type
          </label>
          <Select
            value={values.type}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                type: event.target.value as RecordFormValues["type"],
              }))
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
            Category
          </label>
          <Input
            list="categories"
            value={values.category}
            onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))}
            placeholder="food"
            required
          />
          <datalist id="categories">
            {normalizedCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
            Date
          </label>
          <Input
            type="date"
            value={values.date}
            onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
          Notes
        </label>
        <Textarea
          value={values.notes}
          onChange={(event) => setValues((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Optional context"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
