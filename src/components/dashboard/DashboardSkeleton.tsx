function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[1.6rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="h-4 w-24 rounded-full bg-white/10" />
          <div className="mt-4 h-8 w-3/4 rounded-full bg-white/10" />
          <div className="mt-4 h-20 rounded-[1rem] bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default DashboardSkeleton;
