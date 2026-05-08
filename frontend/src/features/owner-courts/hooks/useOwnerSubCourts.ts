import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ownerCourtService } from "../services";
import type { CreateSubCourtRequest, GetMySubCourtsRequest } from "../types";
import { toast } from "sonner";

export const useCreateSubCourt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubCourtRequest) => ownerCourtService.createSubCourt(data),
    onSuccess: () => {
      toast.success("Đã tạo sân con thành công");
      queryClient.invalidateQueries({ queryKey: ["owner-sub-courts"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Tạo sân con thất bại");
    },
  });
};

export const useOwnerSubCourts = (params: GetMySubCourtsRequest) => {
  return useQuery({
    queryKey: ["owner-sub-courts", params],
    queryFn: () => ownerCourtService.getSubCourts(params),
    enabled: !!params.courtId,
  });
};
