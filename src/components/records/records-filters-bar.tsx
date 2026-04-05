"use client";

import { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export interface RecordFilters {
  search: string;
  type: "" | "income" | "expense";
  category: string;
  dateFrom: string;
  dateTo: string;
  sortBy: "date" | "amount" | "createdAt" | "category";
  sortOrder: "asc" | "desc";
}

interface RecordsFiltersBarProps {
  value: RecordFilters;
  onChange: (value: RecordFilters) => void;
  onReset: () => void;
}

export function RecordsFiltersBar({ value, onChange, onReset }: RecordsFiltersBarProps) {
  const updateField = (key: keyof RecordFilters) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({
        ...value,
        [key]: event.target.value,
      });
    };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Input placeholder="Search category or notes" value={value.search} onChange={updateField("search")} />

        <Select value={value.type} onChange={updateField("type")}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>

        <Input placeholder="Category" value={value.category} onChange={updateField("category")} />

        <Select value={value.sortBy} onChange={updateField("sortBy")}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="category">Sort: Category</option>
          <option value="createdAt">Sort: Created At</option>
        </Select>

        <Input type="date" value={value.dateFrom} onChange={updateField("dateFrom")} />
        <Input type="date" value={value.dateTo} onChange={updateField("dateTo")} />

        <Select value={value.sortOrder} onChange={updateField("sortOrder")}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </Select>

        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
