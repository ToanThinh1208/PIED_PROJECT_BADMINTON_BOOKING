import { useState } from "react";
import { usePendingCourts, useApproveCourt, useRejectCourt } from "../hooks/useAdminCourts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MapPin, 
  Clock, 
  Building2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import type { PendingCourt } from "../types";

export default function AdminCourtsPage() {
  const [pageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingCourt, setViewingCourt] = useState<PendingCourt | null>(null);
  const [rejectingCourt, setRejectingCourt] = useState<PendingCourt | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading } = usePendingCourts({
    pageIndex,
    pageSize: 10,
    name: searchTerm,
  });

  const approveMutation = useApproveCourt();
  const rejectMutation = useRejectCourt();

  const handleApprove = (courtId: string) => {
    // Instead of window.confirm, the UI can have its own confirmation if needed, 
    // but for now I'll just make sure it closes the modal.
    approveMutation.mutate(courtId, {
      onSuccess: () => {
        setViewingCourt(null);
      }
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return;
    }
    if (rejectingCourt) {
      rejectMutation.mutate({
        courtId: rejectingCourt.courtId,
        data: { reason: rejectReason }
      }, {
        onSuccess: () => {
          setRejectingCourt(null);
          setViewingCourt(null); // Close detail too if it was open
          setRejectReason("");
        }
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Phê duyệt sân cầu lông 🏸
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Xem xét và phê duyệt các yêu cầu đăng ký sân mới từ các chủ sân
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-700 text-sm font-bold">
            {data?.totalItems || 0} yêu cầu đang chờ
          </span>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input 
          placeholder="Tìm kiếm theo tên sân..." 
          className="pl-12 h-12 rounded-2xl border-gray-100 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang tải danh sách...</p>
          </div>
        ) : data && data.items && data.items.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-50/50 border-b border-gray-100">
              <TableRow>
                <TableHead className="py-5 px-6 font-black text-gray-400 uppercase text-[10px] tracking-wider">Hình ảnh</TableHead>
                <TableHead className="py-5 px-6 font-black text-gray-400 uppercase text-[10px] tracking-wider">Thông tin sân</TableHead>
                <TableHead className="py-5 px-6 font-black text-gray-400 uppercase text-[10px] tracking-wider">Chủ sân</TableHead>
                <TableHead className="py-5 px-6 font-black text-gray-400 uppercase text-[10px] tracking-wider">Giờ hoạt động</TableHead>
                <TableHead className="py-5 px-6 font-black text-gray-400 uppercase text-[10px] tracking-wider text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((court: PendingCourt) => (
                <TableRow key={court.courtId} className="group hover:bg-emerald-50/30 transition-all border-b border-gray-50 last:border-0">
                  <TableCell className="py-4 px-6">
                    <div className="w-20 h-14 rounded-xl overflow-hidden shadow-sm border border-white">
                      <img 
                        src={court.pictureUrl} 
                        alt={court.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Court+Image";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 group-hover:text-emerald-700 transition-colors">{court.name}</span>
                      <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> {court.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                        {court.ownerName?.charAt(0) || "O"}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{court.ownerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className="bg-white border-gray-100 text-gray-500 font-bold text-[10px] py-1 px-3 rounded-full">
                      <Clock size={12} className="mr-1.5" />
                      {court.openTime} - {court.closeTime}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 transition-all">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-xl h-10 w-10 p-0 hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-emerald-600"
                        onClick={() => setViewingCourt(court)}
                      >
                        <Eye size={20} />
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-4 font-bold shadow-lg shadow-emerald-600/20"
                        onClick={() => handleApprove(court.courtId)}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Duyệt"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-100 text-red-500 hover:bg-red-50 rounded-xl h-10 px-4 font-bold"
                        onClick={() => setRejectingCourt(court)}
                      >
                        Từ chối
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="text-emerald-200" size={48} />
            </div>
            <h3 className="text-gray-900 font-black text-2xl">Đã sạch bóng yêu cầu!</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2">
              Tất cả các yêu cầu đăng ký sân đã được xử lý xong. Hãy nghỉ tay một lát nhé.
            </p>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!viewingCourt} onOpenChange={(open) => !open && setViewingCourt(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          {viewingCourt && (
            <>
              <div className="h-80 w-full relative group">
                <img 
                  src={viewingCourt.pictureUrl} 
                  alt={viewingCourt.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=Court+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="mb-3 bg-emerald-500 hover:bg-emerald-500 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Yêu cầu chờ duyệt
                  </Badge>
                  <h2 className="text-3xl font-black text-white">{viewingCourt.name}</h2>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                        <MapPin size={20} />
                      </div>
                      <span className="font-black text-gray-900 text-xs uppercase tracking-wider">Vị trí</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {viewingCourt.address}
                    </p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                        <Clock size={20} />
                      </div>
                      <span className="font-black text-gray-900 text-xs uppercase tracking-wider">Hoạt động</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      Mở cửa: <span className="text-gray-900 font-bold">{viewingCourt.openTime}</span>
                      <br />
                      Đóng cửa: <span className="text-gray-900 font-bold">{viewingCourt.closeTime}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600">
                      <Building2 size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-0.5">Chủ sở hữu</p>
                      <p className="text-lg font-black text-gray-900">{viewingCourt.ownerName || "Không rõ chủ sở hữu"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-emerald-600 font-bold hover:bg-white rounded-xl px-6">
                    Xem hồ sơ
                  </Button>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 text-base font-black shadow-xl shadow-emerald-600/20"
                    onClick={() => handleApprove(viewingCourt.courtId)}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Duyệt sân này"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-100 text-red-500 hover:bg-red-50 rounded-2xl h-14 text-base font-black"
                    onClick={() => setRejectingCourt(viewingCourt)}
                  >
                    Từ chối yêu cầu
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={!!rejectingCourt} onOpenChange={(open) => !open && setRejectingCourt(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 mx-auto">
              <XCircle size={32} />
            </div>
            <DialogTitle className="text-center text-2xl font-black text-gray-900">Từ chối yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Lý do từ chối</label>
            <textarea
              className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 text-gray-700 font-medium resize-none placeholder:text-gray-300 transition-all"
              placeholder="Nhập lý do chi tiết để thông báo cho chủ sân..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-center gap-3">
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 font-bold"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Xác nhận từ chối"}
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 rounded-xl h-12 font-bold text-gray-500"
              onClick={() => setRejectingCourt(null)}
            >
              Hủy bỏ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
