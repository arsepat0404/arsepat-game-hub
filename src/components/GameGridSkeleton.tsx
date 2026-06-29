import { Skeleton } from "@/components/ui/skeleton";

export function GameGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-fr items-stretch">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="rounded-3xl w-full h-full aspect-[4/3]" />
      ))}
    </div>
  );
}
