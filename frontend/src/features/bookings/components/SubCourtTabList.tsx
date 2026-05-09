import { cn } from "@/lib/utils";
import type { SubCourt } from "../types";

interface SubCourtTabListProps {
  subCourts: SubCourt[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SubCourtTabList({ subCourts, selectedId, onSelect }: SubCourtTabListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Array.isArray(subCourts) && subCourts.map((sc) => (
        <button
          key={sc.subCourtId}
          onClick={() => onSelect(sc.subCourtId)}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-wider",
            selectedId === sc.subCourtId
              ? "bg-[#0B2421] text-white shadow-lg shadow-emerald-900/20 scale-[1.02]"
              : "bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-100"
          )}
        >
          {sc.name}
        </button>
      ))}
    </div>
  );
}
