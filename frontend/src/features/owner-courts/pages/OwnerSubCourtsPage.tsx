import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerCourts } from "../hooks/useOwnerCourts";
import { useOwnerSubCourts, useCreateSubCourt } from "../hooks/useOwnerSubCourts";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { 
  Loader2, 
  Plus, 
  Layers, 
  CalendarCheck, 
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export default function OwnerSubCourtsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isScheduleMode = location.pathname.includes("/owner/schedules");
  const [view, setView] = useState<"list" | "create">("list");
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  const [subCourtName, setSubCourtName] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");

  // Fetch all main courts
  const { data: courtsData, isLoading: isLoadingCourts } = useOwnerCourts({
    pageIndex: 1,
    pageSize: 100,
  });

  // Fetch sub-courts for selected court
  const { data: subCourtsData, isLoading: isLoadingSubCourts } = useOwnerSubCourts({
    courtId: selectedCourtId,
    pageIndex: 1,
    pageSize: 100,
  });

  const createSubCourtMutation = useCreateSubCourt();

  const handleCreate = async () => {
    if (!selectedCourtId || !subCourtName || !defaultPrice) return;
    
    createSubCourtMutation.mutate({
      courtId: selectedCourtId,
      name: subCourtName,
      defaultPrice: Number(defaultPrice),
    }, {
      onSuccess: () => {
        setSubCourtName("");
        setDefaultPrice("");
        setView("list");
      }
    });
  };

  const selectedCourt = courtsData?.items.find(c => c.courtId === selectedCourtId);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isScheduleMode 
              ? "Quản lý lịch sân" 
              : view === "list" ? "Quản lý sân con" : "Thêm sân con mới"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isScheduleMode
              ? "Chọn sân con để theo dõi tình trạng đặt sân thực tế"
              : view === "list" 
                ? "Xem và quản lý danh sách sân con thuộc cơ sở chính" 
                : `Đang thiết lập sân con cho: ${selectedCourt?.name || "..."}`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isScheduleMode && (
            view === "list" ? (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5"
                onClick={() => setView("create")}
              >
                <Plus className="mr-2" size={18} />
                Thêm sân con
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="text-gray-600 border-gray-200 rounded-lg"
                onClick={() => setView("list")}
              >
                <ArrowLeft className="mr-2" size={16} />
                Quay lại
              </Button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Court Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] sticky top-24">
            <div className="p-4 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={14} />
                Chọn cơ sở chính
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {isLoadingCourts ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-emerald-600/50" size={24} />
                </div>
              ) : courtsData?.items && courtsData.items.length > 0 ? (
                courtsData.items.map((court) => (
                  <button
                    key={court.courtId}
                    onClick={() => setSelectedCourtId(court.courtId)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all border flex items-center gap-3",
                      selectedCourtId === court.courtId
                        ? "bg-emerald-50/50 border-emerald-100 text-emerald-900 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.1)]"
                        : "border-transparent hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-gray-100">
                      <img 
                        src={court.pictureUrl} 
                        alt={court.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Sân"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{court.name}</p>
                      <p className="text-[10px] opacity-50 truncate">{court.address}</p>
                    </div>
                    {selectedCourtId === court.courtId && (
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={14} />
                    )}
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs text-gray-400 italic">Chưa có cơ sở nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8">
          {!selectedCourtId ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Vui lòng chọn cơ sở</h3>
              <p className="text-gray-400 text-xs mt-1 text-center max-w-[240px]">
                Chọn một cơ sở từ danh sách bên trái để tiếp tục quản lý các sân con
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {view === "list" ? (
                /* LIST VIEW */
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Sân con hiện có</h2>
                      <p className="text-[10px] text-emerald-600 font-medium">Cơ sở: {selectedCourt?.name}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-bold">
                      {subCourtsData?.items.length || 0} sân
                    </Badge>
                  </div>

                  <div className="p-0">
                    {isLoadingSubCourts ? (
                      <div className="py-20 text-center">
                        <Loader2 className="animate-spin text-emerald-600/30 mx-auto" size={32} />
                      </div>
                    ) : subCourtsData?.items && subCourtsData.items.length > 0 ? (
                      <Table>
                        <TableHeader className="bg-gray-50/50">
                          <TableRow className="border-b border-gray-100">
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Tên sân</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">ID</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4 text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subCourtsData.items.map((sub) => (
                            <TableRow key={sub.subCourtId} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                              <TableCell className="px-6 py-4">
                                <span className="font-semibold text-gray-900 text-sm">{sub.name}</span>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <span className="text-[10px] font-mono text-gray-400 uppercase">
                                  {sub.subCourtId.split('-')[0]}
                                </span>
                              </TableCell>
                              <TableCell className="text-right px-6 py-4 flex items-center justify-end gap-2">
                                <Button 
                                  variant={isScheduleMode ? "default" : "ghost"}
                                  size="sm" 
                                  className={cn(
                                    "font-bold rounded-lg h-8",
                                    isScheduleMode 
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                      : "text-emerald-600 hover:bg-emerald-50"
                                  )}
                                  onClick={() => navigate(`/owner/sub-courts/${sub.subCourtId}/schedule${isScheduleMode ? "?mode=schedule" : ""}`)}
                                >
                                  <CalendarCheck size={14} className="mr-2" />
                                  Xem lịch sân
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="py-20 text-center">
                        <Layers className="mx-auto text-gray-100 mb-3" size={40} />
                        <p className="text-sm text-gray-400">Cơ sở này chưa có sân con nào</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* CREATE VIEW */
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-8">
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-gray-900">Thông tin sân con mới</h2>
                    <p className="text-xs text-gray-500 italic">Vị trí: {selectedCourt?.name}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-600">Tên sân con</Label>
                      <Input
                        placeholder="VD: Sân 1, Sân A..."
                        className="h-11 rounded-lg border-gray-200 focus:ring-emerald-500/20"
                        value={subCourtName}
                        onChange={(e) => setSubCourtName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-600">Giá niêm yết (VNĐ/Giờ)</Label>
                      <Input
                        type="number"
                        placeholder="VD: 150000"
                        className="h-11 rounded-lg border-gray-200 focus:ring-emerald-500/20"
                        value={defaultPrice}
                        onChange={(e) => setDefaultPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50">
                    <Button
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/10"
                      onClick={handleCreate}
                      disabled={!subCourtName || !defaultPrice || createSubCourtMutation.isPending}
                    >
                      {createSubCourtMutation.isPending ? (
                        <Loader2 className="animate-spin mr-2" size={18} />
                      ) : (
                        <Plus className="mr-2" size={18} />
                      )}
                      Xác nhận tạo sân con
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
