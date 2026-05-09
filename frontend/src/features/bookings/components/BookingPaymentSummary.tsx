import { Button } from "@/shared/components/ui/button";
import { ShoppingBag, Wallet } from "lucide-react";
import type { AvailableSlot } from "../types";

interface BookingPaymentSummaryProps {
  selectedSlots: AvailableSlot[];
  onBookBank: () => void;
  onBookWallet: () => void;
  isLoading?: boolean;
}

export function BookingPaymentSummary({ 
  selectedSlots, 
  onBookBank, 
  onBookWallet,
  isLoading 
}: BookingPaymentSummaryProps) {
  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  if (selectedSlots.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">
              ĐÃ CHỌN {selectedSlots.length} SLOT
            </p>
            <p className="text-2xl font-black text-[#0B2421]">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <Button
            onClick={onBookWallet}
            disabled={isLoading}
            variant="outline"
            className="flex-1 md:flex-none h-14 px-8 rounded-2xl border-2 border-emerald-100 text-emerald-600 font-black text-xs uppercase tracking-widest hover:bg-emerald-50"
          >
            <Wallet size={18} className="mr-2" /> Thanh toán ví
          </Button>
          <Button
            onClick={onBookBank}
            disabled={isLoading}
            className="flex-1 md:flex-none h-14 px-10 rounded-2xl bg-[#00897B] hover:bg-[#00796B] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
          >
            ĐẶT SÂN NGAY
          </Button>
        </div>
      </div>
    </div>
  );
}
