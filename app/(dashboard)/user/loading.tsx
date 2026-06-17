import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-3 pt-3 space-y-3">
      {/* Filters */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-full" />

      {/* Cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}
