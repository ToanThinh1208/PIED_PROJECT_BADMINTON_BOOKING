import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAvailableSlots, useCreateOverrideSlot } from "../hooks/useOwnerSlots";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Loader2, 
  Lock,
  CalendarCheck
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
  DialogFooter
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ Hai" },
  { value: 2, label: "Thứ Ba" },
  { value: 3, label: "Thứ Tư" },
  { value: 4, label: "Thứ Năm" },
  { value: 5, label: "Thứ Sáu" },
  { value: 6, label: "Thứ Bảy" },
  { value: 0, label: "Chủ Nhật" },
];

export default function OwnerSubCourtSchedulePage() {
  const { id: subCourtId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isScheduleContext = searchParams.get("mode") === "schedule";
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("05:00");
  const [endTime, setEndTime] = useState("06:00");
  const [price, setPrice] = useState("");

  const { data: availableSlots, isLoading } = useAvailableSlots({
    subCourtId: subCourtId || "",
    date: selectedDate
  });

  const createOverrideMutation = useCreateOverrideSlot();

  const handleMergeSlots = async () => {
    if (!startTime || !endTime || !price) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const payloadBase = {
      subCourtId: subCourtId || "",
      isRecurring,
      startTime: startTime + ":00",
      endTime: endTime + ":00",
      price: Number(price),
    };

    try {
      if (isRecurring) {
        if (selectedDays.length === 0) {
          toast.error("Vui lòng chọn ít nhất một thứ trong tuần");
          return;
        }
        for (const day of selectedDays) {
          await createOverrideMutation.mutateAsync({
            ...payloadBase,
            dayOfWeek: day,
          });
        }
      } else {
        await createOverrideMutation.mutateAsync({
          ...payloadBase,
          date: selectedDate,
        });
      }
      setIsModalOpen(false);
      setPrice("");
      setSelectedDays([]);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(d);
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
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
              Quản lý lịch sân
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Theo dõi tình trạng đặt sân thực tế
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isScheduleContext && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-emerald-600/20 font-bold">
                  Gộp slot mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-emerald-600 p-6 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black">
                      Gộp Slot Mới
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-emerald-100 text-xs mt-1 font-medium">Tạo khung giờ cố định cho sân này</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Checkbox 
                      id="recurring" 
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(!!checked)}
                      className="border-emerald-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label htmlFor="recurring" className="text-sm font-bold text-gray-700 cursor-pointer">
                      Lặp lại hàng tuần
                    </Label>
                  </div>

                  {isRecurring ? (
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Chọn thứ trong tuần</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <div 
                            key={day.value}
                            onClick={() => toggleDay(day.value)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                              selectedDays.includes(day.value) 
                                ? "bg-emerald-50 border-emerald-200" 
                                : "bg-white border-gray-100 hover:border-gray-200"
                            )}
                          >
                            <Checkbox 
                              checked={selectedDays.includes(day.value)}
                              className="border-emerald-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 pointer-events-none"
                            />
                            <span className={cn(
                              "text-xs font-bold",
                              selectedDays.includes(day.value) ? "text-emerald-700" : "text-gray-600"
                            )}>
                              {day.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày áp dụng</Label>
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-700">{formatDate(selectedDate)}</span>
                        <CalendarIcon size={16} className="text-emerald-500" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Giờ bắt đầu</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          type="time" 
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Giờ kết thúc</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          type="time" 
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Giá tiền (VNĐ)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₫</span>
                      <Input 
                        type="number" 
                        placeholder="Ví dụ: 100000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-8 h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl font-bold text-gray-500"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    onClick={handleMergeSlots}
                    disabled={createOverrideMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 font-black shadow-lg shadow-emerald-600/20"
                  >
                    {createOverrideMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : "XÁC NHẬN GỘP"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-xl border border-gray-100 shadow-sm h-11">
            <CalendarIcon size={16} className="text-emerald-500" />
            <input 
              type="date" 
              className="border-none focus:ring-0 text-sm font-bold text-gray-700 outline-none cursor-pointer"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Statistics / Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Trạng thái slot</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-gray-600">Còn trống</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-xs font-medium text-gray-600">Đã được đặt</span>
              </div>
            </div>
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
                <CalendarCheck size={18} className="text-emerald-600" />
                Lịch trình chi tiết
              </h2>
              {availableSlots && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {availableSlots.filter(s => s.isAvailable).length} Trống / {availableSlots.length} Tổng
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Đang tải lịch sân...</p>
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {availableSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                      slot.isAvailable 
                        ? "bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md" 
                        : "bg-gray-50 border-transparent opacity-60 grayscale"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        slot.isAvailable ? "bg-emerald-50" : "bg-gray-100"
                      )}>
                        <Clock size={16} className={slot.isAvailable ? "text-emerald-600" : "text-gray-400"} />
                      </div>
                      <Badge 
                        variant={slot.isAvailable ? "outline" : "secondary"}
                        className={cn(
                          "text-[10px] font-bold border-none px-3",
                          slot.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-gray-200 text-gray-500"
                        )}
                      >
                        {slot.isAvailable ? "TRỐNG" : "ĐÃ ĐẶT"}
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

                    {!slot.isAvailable && (
                      <div className="absolute -bottom-2 -right-2 opacity-5">
                        <Lock size={60} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-gray-400">Không có dữ liệu lịch</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[300px] mx-auto font-medium">
                  Hiện tại không có slot nào được ghi nhận cho ngày đã chọn.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
