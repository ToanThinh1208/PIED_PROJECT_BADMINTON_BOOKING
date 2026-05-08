import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  useSubCourtSlots, 
  useAvailableSlots,
  useCreateOverrideSlot 
} from "../hooks/useOwnerSlots";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Plus,
  Zap
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";

export default function OwnerSubCourtCalendarPage() {
  const { id: subCourtId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Override Slot Form State
  const [isRecurring, setIsRecurring] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<string>("0");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [price, setPrice] = useState<string>("100000");

  const createOverrideMutation = useCreateOverrideSlot();
  
  // Manual formatting for initial state
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Fetch slot configuration (all slots for this sub-court)
  const { data: configSlots, isLoading: isLoadingConfig } = useSubCourtSlots(subCourtId || "");


  const handleCreateOverride = async () => {
    await createOverrideMutation.mutateAsync({
      subCourtId: subCourtId || "",
      isRecurring,
      dayOfWeek: isRecurring ? Number(dayOfWeek) : undefined,
      date: isRecurring ? undefined : selectedDate,
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      price: Number(price)
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Lịch sân con
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Xem chi tiết các slot thời gian và trạng thái đặt sân
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl px-6">
                Gộp slot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-black">
                  <Plus className="text-emerald-600" />
                  Gộp Slot Mới
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl">
                  <Checkbox 
                    id="recurring" 
                    checked={isRecurring} 
                    onCheckedChange={(checked) => setIsRecurring(!!checked)}
                  />
                  <Label htmlFor="recurring" className="text-sm font-bold cursor-pointer">Lặp lại hàng tuần</Label>
                </div>

                {isRecurring && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Thứ trong tuần</Label>
                    <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                      <SelectTrigger className="h-11 rounded-xl border-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Thứ Hai</SelectItem>
                        <SelectItem value="2">Thứ Ba</SelectItem>
                        <SelectItem value="3">Thứ Tư</SelectItem>
                        <SelectItem value="4">Thứ Năm</SelectItem>
                        <SelectItem value="5">Thứ Sáu</SelectItem>
                        <SelectItem value="6">Thứ Bảy</SelectItem>
                        <SelectItem value="0">Chủ Nhật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Giờ bắt đầu</Label>
                    <Input 
                      type="time" 
                      className="h-11 rounded-xl border-gray-100" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Giờ kết thúc</Label>
                    <Input 
                      type="time" 
                      className="h-11 rounded-xl border-gray-100" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Giá gộp (VNĐ)</Label>
                  <Input 
                    type="number" 
                    className="h-11 rounded-xl border-gray-100 font-bold text-emerald-600" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20"
                  onClick={handleCreateOverride}
                  disabled={createOverrideMutation.isPending}
                >
                  {createOverrideMutation.isPending ? "Đang xử lý..." : "Xác nhận Gộp Slot"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-xl border border-gray-100 shadow-sm h-11">
            <CalendarIcon size={16} className="text-emerald-500" />
            <input 
              type="date" 
              className="border-none focus:ring-0 text-sm font-bold text-gray-700 outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Statistics / Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
             <p className="text-xs text-gray-400 font-medium leading-relaxed">
               Tại đây bạn có thể xem cấu hình slot mặc định của sân và thực hiện gộp các slot nhỏ thành slot lớn hơn cho giờ cao điểm.
             </p>
          </div>

          <div className="bg-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-600/20">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Ngày đang xem</p>
            <p className="text-xl font-black">{formatDate(selectedDate)}</p>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-emerald-600" />
                Cấu hình Slot mặc định
              </h2>
              {configSlots && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Tổng cộng: {configSlots.length} slots
                </p>
              )}
            </div>

            {isLoadingConfig ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Đang tải cấu hình slot...</p>
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
                <h3 className="text-lg font-bold text-gray-400">Không tìm thấy slot</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[300px] mx-auto font-medium">
                  Chưa có cấu hình slot cho sân này hoặc không có slot vào ngày đã chọn
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
