import type { MyCourtListItem } from "../types";
import { Badge } from "@/shared/components/ui/badge";
import { Building2, Clock, MapPin } from "lucide-react";

interface CourtCardProps {
  court: MyCourtListItem;
}

export const CourtCard = ({ court }: CourtCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Đang chờ duyệt</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đang hoạt động</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Bị từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-emerald-50 rounded-xl">
          <Building2 className="text-emerald-600" size={24} />
        </div>
        {getStatusBadge(court.status)}
      </div>
      
      <h3 className="font-bold text-lg text-gray-900 mb-2">{court.name}</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <MapPin size={16} />
          <span className="line-clamp-1">Xem chi tiết để biết địa chỉ</span>
        </div>
      </div>
    </div>
  );
};
