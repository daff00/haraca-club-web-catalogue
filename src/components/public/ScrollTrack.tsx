export function ScrollTrack({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="horizontal-scroll-track"
      className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
    >
      {children}
    </div>
  );
}