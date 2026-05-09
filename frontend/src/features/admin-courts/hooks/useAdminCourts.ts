import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCourtService } from "../services";
import type { GetPendingCourtsRequest, RejectCourtRequest } from "../types";
import type { PaginatedResponse } from "@/shared/types";
import type { PendingCourt } from "../types";
import { toast } from "sonner";

export const usePendingCourts = (params: GetPendingCourtsRequest) => {
  return useQuery<PaginatedResponse<PendingCourt>>({
    queryKey: ["admin", "pending-courts", params],
    queryFn: async () => {
      const response = await adminCourtService.getAllPendingCourts(params);
      return response;
    },
  });
};

export const useApproveCourt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courtId: string) => adminCourtService.approveCourt(courtId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-courts"] });
      toast.success("Đã duyệt sân thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Duyệt sân thất bại");
    },
  });
};

export const useRejectCourt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courtId, data }: { courtId: string; data: RejectCourtRequest }) =>
      adminCourtService.rejectCourt(courtId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-courts"] });
      toast.success("Đã từ chối duyệt sân");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Từ chối duyệt sân thất bại");
    },
  });
};
