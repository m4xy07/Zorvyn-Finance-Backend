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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">Filters</p>
        <Button variant="ghost" onClick={onReset} className="h-8 px-3 text-xs">
          Reset
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
      </div>
    </div>
  );
}
