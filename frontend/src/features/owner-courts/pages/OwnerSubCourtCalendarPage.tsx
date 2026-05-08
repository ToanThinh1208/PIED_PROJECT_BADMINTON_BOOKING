import { useParams, useNavigate } from "react-router-dom";
import { useSubCourtSlots } from "../hooks/useOwnerSlots";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Loader2, 
} from "lucide-react";

export default function OwnerSubCourtCalendarPage() {
  const { id: subCourtId } = useParams();
  const navigate = useNavigate();

  const { data: configSlots, isLoading } = useSubCourtSlots(subCourtId || "");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Cấu hình Slot Sân
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Xem danh sách các slot đã được cấu hình mặc định
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
            <CalendarIcon size={20} className="text-emerald-600" />
            Danh sách Slot cấu hình
          </h2>
          {configSlots && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold">
              {configSlots.length} SLOT
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-xs font-medium uppercase tracking-[0.2em]">Đang tải cấu hình...</p>
          </div>
        ) : configSlots && configSlots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {configSlots.map((slot, index) => (
              <div 
                key={index}
                className="p-5 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                    <Clock size={16} className="text-emerald-600" />
                  </div>
                  <Badge 
                    variant="outline"
                    className="text-[10px] font-bold border-none px-3 bg-emerald-50 text-emerald-600"
                  >
                    SLOT {index + 1}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-lg font-black text-gray-900 tracking-tight">
                    {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                  </p>
                  <p className="text-xs font-bold text-emerald-600">
                    {slot.price.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
              <CalendarIcon size={32} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-400">Chưa có cấu hình slot</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[300px] mx-auto font-medium">
              Vui lòng quay lại sau hoặc liên hệ bộ phận hỗ trợ nếu bạn cho rằng đây là lỗi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
