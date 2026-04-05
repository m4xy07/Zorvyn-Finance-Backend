import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface TopCategory {
  category: string;
  volume: number;
  count: number;
}

interface TopCategoriesCardProps {
  categories: TopCategory[];
}

export function TopCategoriesCard({ categories }: TopCategoriesCardProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-[var(--text)]">Top Categories</h3>
      <div className="mt-3 space-y-2.5">
        {categories.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No categories yet.</p>
        ) : (
          categories.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm"
            >
              <div>
                <p className="text-[var(--text)]">{item.category}</p>
                <p className="text-xs text-[var(--muted)]">{item.count} entries</p>
              </div>
              <p className="font-medium text-[var(--info)]">{formatCurrency(item.volume)}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
