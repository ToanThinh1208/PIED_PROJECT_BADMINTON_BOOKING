import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ownerCourtService } from "../services";
import type { GetAvailableSlotsRequest, CreateOverrideSlotRequest } from "../types";
import { toast } from "sonner";

export const useSubCourtSlots = (subCourtId: string) => {
  return useQuery({
    queryKey: ["sub-court-slots", subCourtId],
    queryFn: () => ownerCourtService.getSubCourtSlots(subCourtId),
    enabled: !!subCourtId,
  });
};

export const useAvailableSlots = (params: GetAvailableSlotsRequest) => {
  return useQuery({
    queryKey: ["available-slots", params],
    queryFn: () => ownerCourtService.getAvailableSlots(params),
    enabled: !!params.subCourtId && !!params.date,
  });
};

export const useOverrideSlots = (subCourtId: string) => {
  return useQuery({
    queryKey: ["override-slots", subCourtId],
    queryFn: () => ownerCourtService.getOverrideSlotsBySubCourtId(subCourtId),
    enabled: !!subCourtId,
  });
};

export const useCreateOverrideSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOverrideSlotRequest) => ownerCourtService.createOverrideSlot(data),
    onSuccess: () => {
      toast.success("Đã gộp slot thành công");
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["override-slots"] });
    },
  });
};
