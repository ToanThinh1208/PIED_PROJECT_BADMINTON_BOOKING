import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  MapPin, 
  Info,
  Loader2,
  AlertCircle
} from "lucide-react";


import { useSubCourts } from "../hooks/useSubCourts";
import { useAvailableSlots, useCreateBooking, useCreateBookingByWallet } from "../hooks/useBookingOperations";
import { SubCourtTabList } from "../components/SubCourtTabList";
import { SlotPicker } from "../components/SlotPicker";
import { BookingPaymentSummary } from "../components/BookingPaymentSummary";
import { PaymentQrDialog } from "../components/PaymentQrDialog";
import { useCourtDetail } from "@/features/courts/hooks/useCourts";
import type { AvailableSlot, CreateBookingResponse, SubCourt } from "../types";
import { toast } from "sonner";

export function BookingPage() {
  const { id: courtId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSubCourtId, setSelectedSubCourtId] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<AvailableSlot[]>([]);
  const [bookingResponse, setBookingResponse] = useState<CreateBookingResponse | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Queries
  const { data: court, isLoading: isCourtLoading } = useCourtDetail(courtId || "");
  const { data: subCourts, isLoading: isSubCourtsLoading } = useSubCourts(courtId || "");
  
  // Normalize sub-courts data (handle both array and paginated object)
  const subCourtsList = useMemo(() => {
    if (!subCourts) return [];
    if (Array.isArray(subCourts)) return subCourts;
    // Handle paginated response if applicable
    if (typeof subCourts === 'object' && 'items' in subCourts) {
      return (subCourts as { items: SubCourt[] }).items;
    }
    return [];
  }, [subCourts]);

  const effectiveSubCourtId = selectedSubCourtId || (subCourtsList.length > 0 ? subCourtsList[0].subCourtId : null);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const { data: slots, isLoading: isSlotsLoading, isError: isSlotsError } = useAvailableSlots(
    effectiveSubCourtId || "",
    formattedDate
  );

  // Mutations
  const createBooking = useCreateBooking();
  const createBookingByWallet = useCreateBookingByWallet();

  // Handlers
  const handleToggleSlot = (slot: AvailableSlot) => {
    setSelectedSlots(prev => {
      const exists = prev.find(s => s.startTime === slot.startTime && s.endTime === slot.endTime);
      if (exists) {
        return prev.filter(s => s !== exists);
      }
      return [...prev, slot];
    });
  };

  const handleBookBank = async () => {
    if (!effectiveSubCourtId || selectedSlots.length === 0) return;

    try {
      const result = await createBooking.mutateAsync({
        subCourtId: effectiveSubCourtId,
        date: formattedDate,
        slots: selectedSlots.map(s => ({ startTime: s.startTime, endTime: s.endTime }))
      });
      setBookingResponse(result);
      setIsQrOpen(true);
    } catch {
      toast.error("Không thể tạo đơn đặt sân. Vui lòng thử lại.");
    }
  };

  const handleBookWallet = async () => {
    if (!effectiveSubCourtId || selectedSlots.length === 0) return;

    try {
      await createBookingByWallet.mutateAsync({
        subCourtId: effectiveSubCourtId,
        date: formattedDate,
        slots: selectedSlots.map(s => ({ startTime: s.startTime, endTime: s.endTime }))
      });
      toast.success("Đặt sân thành công bằng ví!");
      navigate("/history");
    } catch {
      toast.error("Thanh toán bằng ví thất bại. Vui lòng kiểm tra số dư.");
    }
  };

  const isLoading = isCourtLoading || isSubCourtsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FBFA]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-emerald-500 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">ĐANG TẢI DỮ LIỆU...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFA] pb-32 pt-20">
      <PaymentQrDialog 
        isOpen={isQrOpen}
        bookingResponse={bookingResponse}
        onClose={() => setIsQrOpen(false)}
        onSuccess={() => {
          setIsQrOpen(false);
          toast.success("Hệ thống đang xác nhận thanh toán của bạn!");
          navigate("/history");
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs / Back */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-[#0B2421] transition-colors mb-8 group"
        >
          <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quay lại</span>
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[#0B2421] leading-tight">
              Đặt sân <span className="text-emerald-500">{court?.name}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <MapPin size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-gray-600">{court?.address}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Info size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-600">Mỗi slot mặc định 30 phút</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Chọn ngày đặt</p>
            <div className="relative w-full md:w-[280px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                <CalendarIcon size={18} />
              </div>
              <input
                type="date"
                value={formattedDate}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split('-').map(Number);
                  setSelectedDate(new Date(year, month - 1, day));
                }}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-100 bg-white font-black text-xs uppercase tracking-widest focus:border-emerald-500 focus:outline-none transition-all appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Sub-courts Selection */}
        <div className="mb-12">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Danh sách sân con</p>
          <SubCourtTabList 
            subCourts={subCourtsList}
            selectedId={effectiveSubCourtId}
            onSelect={(id) => {
              setSelectedSubCourtId(id);
              setSelectedSlots([]);
            }}
          />
        </div>

        {/* Slots Grid */}
        <div className="relative min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-[#0B2421]">Chọn khung giờ</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-gray-200" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Đã đặt</span>
              </div>
            </div>
          </div>

          {isSlotsLoading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <Loader2 size={32} className="text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-400 font-bold italic">Đang cập nhật lịch sân...</p>
            </div>
          ) : isSlotsError ? (
            <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-[2.5rem] border border-red-100 p-8 text-center">
              <AlertCircle size={40} className="text-red-400 mb-4" />
              <h4 className="text-red-600 font-black mb-2 uppercase text-xs tracking-widest">Đã có lỗi xảy ra</h4>
              <p className="text-red-500/70 text-sm font-medium">Không thể tải danh sách slot. Vui lòng thử lại sau.</p>
            </div>
          ) : slots && slots.length > 0 ? (
            <SlotPicker 
              slots={slots}
              selectedSlots={selectedSlots}
              onToggleSlot={handleToggleSlot}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
              <CalendarIcon size={32} className="text-gray-300 mb-4" />
              <p className="text-gray-400 font-bold italic">Không có slot nào trong ngày này</p>
            </div>
          )}
        </div>
      </div>

      <BookingPaymentSummary 
        selectedSlots={selectedSlots}
        onBookBank={handleBookBank}
        onBookWallet={handleBookWallet}
        isLoading={createBooking.isPending || createBookingByWallet.isPending}
      />
    </div>
  );
}
